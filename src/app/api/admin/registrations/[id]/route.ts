import { type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify, createRemoteJWKSet } from "jose";
import { FieldValue } from "firebase-admin/firestore";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

async function verifyAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("__session")?.value;
  if (!session) throw new Error("Unauthorized");
  await jwtVerify(session, JWKS, {
    audience: PROJECT_ID,
    issuer: `https://securetoken.google.com/${PROJECT_ID}`,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAdmin();
    const { id } = await params;
    const { approvalStatus } = await request.json();

    if (!["approved", "rejected", "pending"].includes(approvalStatus)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const { adminDb } = await import("@/lib/firebase/admin");
    await adminDb.collection("registrations").doc(id).update({
      approvalStatus,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return Response.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "error";
    if (msg === "Unauthorized") return Response.json({ error: "Unauthorized" }, { status: 401 });
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
