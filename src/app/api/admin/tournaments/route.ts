import { type NextRequest } from "next/server";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { verifyAdmin } from "@/lib/server/verifyAdmin";

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin();
    const body = await request.json();
    const { name, description, mode, prizePool, firstPrize, secondPrize, isFree, registrationFee, startsAt, registrationDeadline } = body;

    if (!name || !mode || !prizePool || !startsAt || !registrationDeadline) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { adminDb } = await import("@/lib/firebase/admin");

    // Count existing tournaments to determine which banner to use (cycles 1–5)
    const countSnap = await adminDb.collection("tournaments").count().get();
    const bannerIndex = (countSnap.data().count % 5) + 1;
    const bannerUrl = `/banners/ff${bannerIndex}.png`;

    await adminDb.collection("tournaments").add({
      name,
      description: description || "",
      mode,
      prizePool,
      maxSlots: 12,
      startsAt: Timestamp.fromDate(new Date(startsAt)),
      registrationDeadline: Timestamp.fromDate(new Date(registrationDeadline)),
      status: "upcoming",
      isRegistrationOpen: true,
      roomId: null,
      roomPassword: null,
      bannerUrl,
      isFree: isFree === true,
      registrationFee: isFree ? null : (registrationFee || null),
      firstPrize: firstPrize || null,
      secondPrize: secondPrize || null,
      registeredCount: 0,
      waitlistCount: 0,
      allUids: [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return Response.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "error";
    if (msg === "Unauthorized") return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "Forbidden") return Response.json({ error: "Forbidden" }, { status: 403 });
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
