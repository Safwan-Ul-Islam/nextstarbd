import { type NextRequest } from "next/server";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { verifyAdmin } from "@/lib/server/verifyAdmin";

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin();
    const body = await request.json();
    const { tournamentId, tournamentName, squadName, players, prize, position, photoUrl, tournamentDate } = body;

    if (!tournamentId || !squadName || !position) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const { adminDb } = await import("@/lib/firebase/admin");
    await adminDb.collection("winners").add({
      tournamentId,
      tournamentName: tournamentName || "",
      squadName,
      players: players || [],
      prize: prize || "",
      position,
      photoUrl: photoUrl || null,
      tournamentDate: tournamentDate ? Timestamp.fromDate(new Date(tournamentDate)) : FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    });

    return Response.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "error";
    if (msg === "Unauthorized") return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "Forbidden") return Response.json({ error: "Forbidden" }, { status: 403 });
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await verifyAdmin();
    const { id } = await request.json();
    const { adminDb } = await import("@/lib/firebase/admin");
    await adminDb.collection("winners").doc(id).delete();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
