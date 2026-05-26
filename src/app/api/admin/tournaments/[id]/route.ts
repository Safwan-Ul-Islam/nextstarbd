import { type NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { verifyAdmin } from "@/lib/server/verifyAdmin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAdmin();
    const { id } = await params;
    const body = await request.json();
    const { adminDb } = await import("@/lib/firebase/admin");

    const allowed = [
      "status",
      "isRegistrationOpen",
      "roomId",
      "roomPassword",
      "name",
      "description",
      "prizePool",
      "bannerUrl",
    ];

    const update: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };
    for (const key of allowed) {
      if (key in body) update[key] = body[key];
    }

    await adminDb.collection("tournaments").doc(id).update(update);
    return Response.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "error";
    if (msg === "Unauthorized") return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "Forbidden") return Response.json({ error: "Forbidden" }, { status: 403 });
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAdmin();
    const { id } = await params;
    const { adminDb } = await import("@/lib/firebase/admin");
    await adminDb.collection("tournaments").doc(id).delete();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
