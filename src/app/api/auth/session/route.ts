import { type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  const { token } = await request.json();
  if (!token) {
    return Response.json({ error: "No token" }, { status: 400 });
  }

  try {
    const { adminAuth, adminDb } = await import("@/lib/firebase/admin");
    const decoded = await adminAuth.verifyIdToken(token);

    const cookieStore = await cookies();
    cookieStore.set("__session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    // Upsert user profile document
    const userRef = adminDb.collection("users").doc(decoded.uid);
    const userDoc = await userRef.get();
    const now = FieldValue.serverTimestamp();

    if (!userDoc.exists) {
      await userRef.set({
        uid: decoded.uid,
        displayName: decoded.name ?? null,
        email: decoded.email ?? null,
        photoURL: decoded.picture ?? null,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      await userRef.update({
        displayName: decoded.name ?? null,
        email: decoded.email ?? null,
        photoURL: decoded.picture ?? null,
        updatedAt: now,
      });
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("__session");
  return Response.json({ ok: true });
}
