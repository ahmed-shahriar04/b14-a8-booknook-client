import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { auth } from "../../../../lib/auth";
import { headers } from "next/headers";
import { hashPassword, verifyPassword } from "better-auth/crypto";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/booknook";
let clientPromise;

function getMongoClient() {
  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, currentPassword, newPassword } = body;

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword)) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must contain at least one uppercase and one lowercase letter.",
        },
        { status: 400 }
      );
    }

    const client = await getMongoClient();
    const db = client.db("booknook");

    // Check if called by authenticated session
    let session = null;
    try {
      session = await auth.api.getSession({
        headers: await headers(),
      });
    } catch (_) {}

    let targetEmail = session?.user?.email || email;

    if (!targetEmail) {
      return NextResponse.json(
        { success: false, message: "Email address is required." },
        { status: 400 }
      );
    }

    targetEmail = targetEmail.trim().toLowerCase();

    // Find user in user collection
    const userDoc = await db.collection("user").findOne({ email: targetEmail });
    if (!userDoc) {
      return NextResponse.json(
        { success: false, message: "No account found with this email address." },
        { status: 404 }
      );
    }

    const userId = userDoc._id ? userDoc._id.toString() : userDoc.id;

    // Find credential account in account collection
    const accountDoc = await db.collection("account").findOne({
      $or: [
        { userId: userId },
        ...(userDoc.id ? [{ userId: userDoc.id }] : []),
        ...(ObjectId.isValid(userId) ? [{ userId: new ObjectId(userId) }] : []),
      ],
      providerId: "credential",
    });

    // If currentPassword was supplied or user is logged in, verify it
    if (currentPassword && accountDoc?.password) {
      const isValid = await verifyPassword({
        hash: accountDoc.password,
        password: currentPassword,
      });

      if (!isValid) {
        return NextResponse.json(
          { success: false, message: "Current password is incorrect." },
          { status: 400 }
        );
      }
    }

    // Hash the new password using BetterAuth's exact crypto hasher
    const newHashedPassword = await hashPassword(newPassword);

    if (accountDoc) {
      await db.collection("account").updateOne(
        { _id: accountDoc._id },
        {
          $set: {
            password: newHashedPassword,
            updatedAt: new Date(),
          },
        }
      );
    } else {
      // Create credential account if only registered via social or missing
      await db.collection("account").insertOne({
        userId: userId,
        accountId: targetEmail,
        providerId: "credential",
        password: newHashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully! You can now sign in with your new password.",
    });
  } catch (err) {
    console.error("Password reset/change error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
