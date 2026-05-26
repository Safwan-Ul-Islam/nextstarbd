import { SponsorsAdminPanel } from "@/components/admin/SponsorsAdminPanel";
import { serialize } from "@/lib/utils/serialize";
import type { Sponsor } from "@/lib/types";

async function getData() {
  const { adminDb } = await import("@/lib/firebase/admin");
  const snap = await adminDb.collection("sponsors").orderBy("displayOrder", "asc").get();
  return serialize(snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Sponsor)));
}

export default async function AdminSponsorsPage() {
  const sponsors = await getData();
  return <SponsorsAdminPanel sponsors={sponsors} />;
}
