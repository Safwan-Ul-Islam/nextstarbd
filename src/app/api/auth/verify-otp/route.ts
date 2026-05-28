import { type NextRequest } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, otp } = body;

  if (!email || !otp) return Response.json({ error: "Email and OTP are required" }, { status: 400 });

  try {
    const doc = await adminDb.collection("pendingVerifications").doc(email).get();
    if (!doc.exists) return Response.json({ error: "invalid-otp" }, { status: 400 });

    const data = doc.data()!;

    if (Date.now() > data.expiresAt) {
      await doc.ref.delete();
      return Response.json({ error: "otp-expired" }, { status: 400 });
    }

    if (data.otp !== otp) {
      return Response.json({ error: "invalid-otp" }, { status: 400 });
    }

    // Enable and mark verified
    await adminAuth.updateUser(data.uid, { disabled: false, emailVerified: true });

    // Clean up
    await doc.ref.delete();

    // Generate custom token so client can sign in
    const customToken = await adminAuth.createCustomToken(data.uid);

    return Response.json({ ok: true, customToken });
  } catch (err) {
    console.error("verify-otp error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
