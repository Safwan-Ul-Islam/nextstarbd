import { type NextRequest } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, otp, newPassword } = body;

  if (!email || !otp || !newPassword) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return Response.json({ error: "weak-password" }, { status: 400 });
  }

  try {
    const doc = await adminDb.collection("pendingVerifications").doc(email).get();
    if (!doc.exists) return Response.json({ error: "invalid-otp" }, { status: 400 });

    const data = doc.data()!;

    if (data.type !== "password_reset") {
      return Response.json({ error: "invalid-otp" }, { status: 400 });
    }
    if (Date.now() > data.expiresAt) {
      await doc.ref.delete();
      return Response.json({ error: "otp-expired" }, { status: 400 });
    }
    if (data.otp !== otp) {
      return Response.json({ error: "invalid-otp" }, { status: 400 });
    }

    // Update password and clean up
    await adminAuth.updateUser(data.uid, { password: newPassword });
    await doc.ref.delete();

    // Sign user in with custom token
    const customToken = await adminAuth.createCustomToken(data.uid);
    return Response.json({ ok: true, customToken });
  } catch (err) {
    console.error("reset-password error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
