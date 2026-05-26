import { getTranslations, getLocale } from "next-intl/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedTournament } from "@/components/home/FeaturedTournament";
import { UpcomingTournaments } from "@/components/home/UpcomingTournaments";
import { PreviousHighlights } from "@/components/home/PreviousHighlights";
import { CommunityLinks } from "@/components/home/CommunityLinks";
import { serialize } from "@/lib/utils/serialize";
import type { Winner, MvpPlayer } from "@/lib/types";

async function getHomeData() {
  try {
    const { adminDb } = await import("@/lib/firebase/admin");

    const [winnersSnap, mvpSnap] = await Promise.all([
      adminDb.collection("winners").orderBy("tournamentDate", "desc").limit(12).get(),
      adminDb.collection("mvpPlayers").orderBy("tournamentDate", "desc").limit(8).get(),
    ]);

    return serialize({
      winners: winnersSnap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Winner)),
      mvpPlayers: mvpSnap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as MvpPlayer)),
    });
  } catch {
    return { winners: [], mvpPlayers: [] };
  }
}

export default async function HomePage() {
  const t = await getTranslations("hero");
  const locale = await getLocale();
  const { winners, mvpPlayers } = await getHomeData();

  return (
    <>
      <Navbar locale={locale} />
      <main>
        {/* Slim hero */}
        <HeroSection subtitle={t("subtitle")} />

        {/* Section 1 — Current tournament (big, registration CTA) */}
        <FeaturedTournament />

        {/* Section 2 — Other upcoming tournaments */}
        <UpcomingTournaments />

        {/* Section 3 — Previous champions + MVP carousel */}
        <PreviousHighlights winners={winners} mvpPlayers={mvpPlayers} />

        <CommunityLinks />
      </main>
      <Footer />
    </>
  );
}
