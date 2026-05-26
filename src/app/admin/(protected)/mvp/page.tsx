import { MvpAdminPanel } from "@/components/admin/MvpAdminPanel";
import { serialize } from "@/lib/utils/serialize";
import type { MvpPlayer, Tournament } from "@/lib/types";

async function getData() {
  const { adminDb } = await import("@/lib/firebase/admin");
  const [mSnap, tSnap] = await Promise.all([
    adminDb.collection("mvpPlayers").orderBy("tournamentDate", "desc").get(),
    adminDb.collection("tournaments").orderBy("startsAt", "desc").limit(20).get(),
  ]);
  return serialize({
    mvpPlayers: mSnap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as MvpPlayer)),
    tournaments: tSnap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Tournament)),
  });
}

export default async function AdminMvpPage() {
  const { mvpPlayers, tournaments } = await getData();
  return <MvpAdminPanel mvpPlayers={mvpPlayers} tournaments={tournaments} />;
}
