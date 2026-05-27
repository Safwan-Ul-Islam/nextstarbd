import { getLocale } from "next-intl/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { FeaturedTournament } from "@/components/home/FeaturedTournament";
import { UpcomingTournaments } from "@/components/home/UpcomingTournaments";
import { PreviousTournaments } from "@/components/home/PreviousTournaments";
import { PreviousHighlights } from "@/components/home/PreviousHighlights";
import { CommunityLinks } from "@/components/home/CommunityLinks";
import { serialize } from "@/lib/utils/serialize";
import type { Winner, MvpPlayer, Tournament } from "@/lib/types";

async function getHomeData() {
  try {
    const { adminDb } = await import("@/lib/firebase/admin");

    const [winnersSnap, mvpSnap, upcomingSnap] = await Promise.all([
      adminDb.collection("winners").orderBy("tournamentDate", "desc").limit(12).get(),
      adminDb.collection("mvpPlayers").orderBy("tournamentDate", "desc").limit(4).get(),
      adminDb.collection("tournaments").where("status", "==", "upcoming").orderBy("startsAt", "asc").limit(3).get(),
    ]);

    return serialize({
      winners: winnersSnap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Winner)),
      mvpPlayers: mvpSnap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as MvpPlayer)),
      upcomingTournaments: upcomingSnap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Tournament)),
    });
  } catch {
    return { winners: [], mvpPlayers: [], upcomingTournaments: [] };
  }
}

export default async function HomePage() {
  const locale = await getLocale();
  const { winners, mvpPlayers, upcomingTournaments } = await getHomeData();

  return (
    <>
      <Navbar locale={locale} />
      <main>
        {/* Hero carousel — leaderboards, upcoming tournaments, ad */}
        <HeroCarousel winners={winners} mvpPlayers={mvpPlayers} upcomingTournaments={upcomingTournaments} />

        {/* Section 1 — Current tournament (big, registration CTA) */}
        <FeaturedTournament />

        {/* Section 2 — Other upcoming tournaments */}
        <UpcomingTournaments />

        {/* Section 3 — Completed tournaments (small result cards) */}
        <PreviousTournaments />

        {/* Section 4 — Previous champions + MVP carousel */}
        <PreviousHighlights winners={winners} mvpPlayers={mvpPlayers} />

        <CommunityLinks />
      </main>
      <Footer />
    </>
  );
}
