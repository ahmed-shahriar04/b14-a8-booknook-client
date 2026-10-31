import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/booknook";
const client = new MongoClient(uri);
const db = client.db("booknook");

const getBaseURL = () => {
  if (process.env.NODE_ENV === "production") {
    // In production on Vercel, ignore localhost if it was set in env by accident
    if (process.env.BETTER_AUTH_URL && !process.env.BETTER_AUTH_URL.includes("localhost")) {
      return process.env.BETTER_AUTH_URL;
    }
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    return "https://booknooktoday.vercel.app";
  }
  return process.env.BETTER_AUTH_URL || "http://localhost:3000";
};

export const auth = betterAuth({
  plugins: [
    nextCookies(), // Essential for Next.js App Router cookie persistence!
  ],
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET || "booknook_super_secure_better_auth_secret_key_2026",
  baseURL: getBaseURL(),
  trustedOrigins: [
    "https://booknooktoday.vercel.app",
    "http://localhost:3000",
    "http://localhost:5000",
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
    process.env.BETTER_AUTH_URL || "",
  ].filter(Boolean),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false, // Per specs: navigate to Login page after register
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      path: "/",
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!(
        process.env.GOOGLE_CLIENT_ID &&
        process.env.GOOGLE_CLIENT_ID !== "your_google_client_id_here"
      ),
    },
  },
  user: {
    additionalFields: {
      photoURL: {
        type: "string",
        required: false,
      },
    },
  },
});
