import { type NextRequest } from "next/server";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { cookies } from "next/headers";
import { jwtVerify, createRemoteJWKSet } from "jose";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

async function verifyAdmin(request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get("__session")?.value;
  if (!session) throw new Error("Unauthorized");
  await jwtVerify(session, JWKS, {
    audience: PROJECT_ID,
    issuer: `https://securetoken.google.com/${PROJECT_ID}`,
  });
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request);
    const body = await request.json();
    const { name, description, mode, prizePool, startsAt, registrationDeadline } = body;

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
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
