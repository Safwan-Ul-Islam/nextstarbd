import { type NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tournamentId = searchParams.get("tournamentId");
  if (!tournamentId) {
    return Response.json({ error: "Missing tournamentId" }, { status: 400 });
  }

  try {
    const { adminDb } = await import("@/lib/firebase/admin");
    const doc = await adminDb.collection("tournaments").doc(tournamentId).get();
    if (!doc.exists) return Response.json({ error: "Tournament not found" }, { status: 404 });
    const data = doc.data()!;
    return Response.json({
      name: data.name,
      allUids: data.allUids || [],
      registeredCount: data.registeredCount || 0,
      maxSlots: data.maxSlots || 12,
      isRegistrationOpen: data.isRegistrationOpen,
      status: data.status,
    });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { tournamentId, userId, squadName, leaderName, leaderUid, whatsapp, player2Uid, player3Uid, player4Uid } = body;

  if (!userId?.trim()) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!tournamentId || !squadName?.trim() || !leaderName?.trim() || !leaderUid?.trim() || !whatsapp?.trim() || !player2Uid?.trim() || !player3Uid?.trim() || !player4Uid?.trim()) {
    return Response.json({ error: "All fields are required" }, { status: 400 });
  }

  const newUids = [leaderUid.trim(), player2Uid.trim(), player3Uid.trim(), player4Uid.trim()];

  // Check for duplicate UIDs within the squad
  const uniqueUids = new Set(newUids);
  if (uniqueUids.size !== newUids.length) {
    return Response.json({ error: "Duplicate UIDs within the squad are not allowed" }, { status: 400 });
  }

  try {
    const { adminDb } = await import("@/lib/firebase/admin");
    const tournamentRef = adminDb.collection("tournaments").doc(tournamentId);

    const result = await adminDb.runTransaction(async (tx) => {
      const tournamentDoc = await tx.get(tournamentRef);
      if (!tournamentDoc.exists) throw new Error("TOURNAMENT_NOT_FOUND");

      const data = tournamentDoc.data()!;
      if (!data.isRegistrationOpen) throw new Error("REGISTRATION_CLOSED");
      if (data.status !== "upcoming") throw new Error("REGISTRATION_CLOSED");

      const existingUids: string[] = data.allUids || [];
      const duplicate = newUids.find((uid) => existingUids.includes(uid));
      if (duplicate) throw new Error(`DUPLICATE_UID:${duplicate}`);

      const registeredCount = data.registeredCount || 0;
      const maxSlots = data.maxSlots || 12;
      const isWaitlisted = registeredCount >= maxSlots;
      const slotNumber = isWaitlisted ? null : registeredCount + 1;

      const regRef = adminDb.collection("registrations").doc();
      tx.set(regRef, {
        tournamentId,
        userId: userId.trim(),
        squadName: squadName.trim(),
        leaderName: leaderName.trim(),
        leaderUid: leaderUid.trim(),
        whatsapp: whatsapp.trim(),
        player2Uid: player2Uid.trim(),
        player3Uid: player3Uid.trim(),
        player4Uid: player4Uid.trim(),
        allUids: newUids,
        slotNumber,
        isWaitlisted,
        approvalStatus: "pending",
        registeredAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      tx.update(tournamentRef, {
        allUids: FieldValue.arrayUnion(...newUids),
        registeredCount: FieldValue.increment(1),
        waitlistCount: isWaitlisted ? FieldValue.increment(1) : data.waitlistCount || 0,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return { registrationId: regRef.id, isWaitlisted, slotNumber };
    });

    return Response.json({ ok: true, ...result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "SERVER_ERROR";
    if (msg === "TOURNAMENT_NOT_FOUND") return Response.json({ error: "Tournament not found" }, { status: 404 });
    if (msg === "REGISTRATION_CLOSED") return Response.json({ error: "Registration is closed" }, { status: 409 });
    if (msg.startsWith("DUPLICATE_UID")) return Response.json({ error: "A player UID is already registered in this tournament" }, { status: 409 });
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
