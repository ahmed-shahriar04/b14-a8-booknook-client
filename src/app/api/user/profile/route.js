import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { auth } from "../../../../lib/auth";
import { headers } from "next/headers";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/booknook";
let clientPromise;

function getMongoClient() {
  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function GET(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const client = await getMongoClient();
    const db = client.db("booknook");

    // Fetch user details from user collection
    const userDoc = await db.collection("user").findOne({
      $or: [
        { email: session.user.email },
        ...(session.user.id ? [{ id: session.user.id }] : []),
      ],
    });

    // Count user's added books and active borrows
    const [booksCount, borrowsCount] = await Promise.all([
      db.collection("books").countDocuments({ userEmail: session.user.email }).catch(() => 0),
      db.collection("borrows").countDocuments({ userEmail: session.user.email }).catch(() => 0),
    ]);

    return NextResponse.json({
      success: true,
      user: {
        id: session.user.id,
        name: userDoc?.name || session.user.name || "Reader",
        email: session.user.email,
        image: userDoc?.image || session.user.image || "",
        createdAt: userDoc?.createdAt || session.user.createdAt || new Date(),
        stats: {
          booksContributed: booksCount,
          activeBorrows: borrowsCount,
        },
      },
    });
  } catch (err) {
    console.error("GET /api/user/profile error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, image } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Name cannot be empty" },
        { status: 400 }
      );
    }

    const client = await getMongoClient();
    const db = client.db("booknook");

    const updateFields = {
      name: name.trim(),
      updatedAt: new Date(),
    };
    if (typeof image === "string") {
      updateFields.image = image.trim();
    }

    // Prepare search filter
    let filter = { email: session.user.email };
    if (session.user.id) {
      try {
        if (ObjectId.isValid(session.user.id)) {
          filter = {
            $or: [
              { _id: new ObjectId(session.user.id) },
              { id: session.user.id },
              { email: session.user.email },
            ],
          };
        } else {
          filter = {
            $or: [{ id: session.user.id }, { email: session.user.email }],
          };
        }
      } catch (_) {
        filter = { email: session.user.email };
      }
    }

    await db.collection("user").updateOne(filter, { $set: updateFields });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        ...session.user,
        name: updateFields.name,
        image: updateFields.image !== undefined ? updateFields.image : session.user.image,
      },
    });
  } catch (err) {
    console.error("PATCH /api/user/profile error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

