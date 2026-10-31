import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { auth } from "../../../lib/auth";
import { headers } from "next/headers";

export async function GET(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET || "booknook_jwt_super_secret_express_2026";
    const token = jwt.sign(
      {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      secret,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ success: true, token, user: session.user });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

