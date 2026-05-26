import { WinnersAdminPanel } from "@/components/admin/WinnersAdminPanel";
import { serialize } from "@/lib/utils/serialize";
import type { Winner, Tournament } from "@/lib/types";

async function getData() {
  const { adminDb } = await import("@/lib/firebase/admin");
  const [wSnap, tSnap] = await Promise.all([
    adminDb.collection("winners").orderBy("tournamentDate", "desc").get(),
    adminDb.collection("tournaments").where("status", "==", "completed").get(),
  ]);
  return serialize({
    winners: wSnap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Winner)),
    tournaments: tSnap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Tournament)),
  });
}

export default async function AdminWinnersPage() {
  const { winners, tournaments } = await getData();
  return <WinnersAdminPanel winners={winners} tournaments={tournaments} />;
}
