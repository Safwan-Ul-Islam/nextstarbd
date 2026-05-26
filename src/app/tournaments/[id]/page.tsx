import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TournamentDashboard } from "@/components/tournaments/TournamentDashboard";
import { SlotProgressBar } from "@/components/tournaments/SlotProgressBar";
import { CountdownTimer } from "@/components/tournaments/CountdownTimer";
import { serialize } from "@/lib/utils/serialize";
import { formatTournamentDate } from "@/lib/utils/formatDate";
import { resolveBannerUrl } from "@/lib/utils/bannerUrl";
import type { Tournament, TournamentStatus } from "@/lib/types";
import Link from "next/link";

const statusStyle: Record<TournamentStatus, { label: string; color: string }> = {
  upcoming:  { label: "Upcoming",  color: "bg-secondary text-white" },
  ongoing:   { label: "LIVE",      color: "bg-primary text-white" },
  completed: { label: "Completed", color: "bg-gray-500 text-white" },
  cancelled: { label: "Cancelled", color: "bg-amber-500 text-white" },
};

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();

  let tournament: Tournament | null = null;
  try {
    const { adminDb } = await import("@/lib/firebase/admin");
    const doc = await adminDb.collection("tournaments").doc(id).get();
    if (doc.exists) {
      tournament = serialize({ id: doc.id, ...doc.data() } as unknown as Tournament);
    }
  } catch {}

  if (!tournament) notFound();

  const s = statusStyle[tournament.status];
  const canRegister = tournament.isRegistrationOpen;

  return (
    <>
      <Navbar locale={locale} />
      <main className="min-h-screen bg-gray-50">

        {/* Banner header */}
        <div
          className="relative h-56 sm:h-72 overflow-hidden"
          style={{
            backgroundImage: `url(${resolveBannerUrl(tournament.bannerUrl, tournament.id)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#1f2937",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

          {/* Back link */}
          <div className="absolute top-4 left-4">
            <Link href="/" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium transition-colors">
              ← Home
            </Link>
          </div>

          {/* Status + name */}
          <div className="absolute bottom-5 left-5 right-5">
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-2 ${s.color}`}>
              {s.label === "LIVE" ? "🔴 LIVE NOW" : s.label}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-white tracking-wide leading-tight drop-shadow-lg">
              {tournament.name}
            </h1>
          </div>
        </div>

        {/* Info bar */}
        <div className="bg-white border-b border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-primary/8 text-primary border border-primary/20 text-xs font-bold px-3 py-1.5 rounded-full">
                🏆 {tournament.prizePool}
              </span>
              <span className="bg-gray-100 text-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
                ⚔️ {tournament.mode}
              </span>
              <span className="bg-gray-100 text-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
                📅 {formatTournamentDate(tournament.startsAt)}
              </span>
              {canRegister && (
                <Link
                  href={`/register/${id}`}
                  className="ml-auto bg-primary hover:bg-primary-dark text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors"
                >
                  Register Squad →
                </Link>
              )}
            </div>

            <div className="mt-3 max-w-sm">
              <SlotProgressBar
                filled={tournament.registeredCount}
                max={tournament.maxSlots}
                waitlisted={tournament.waitlistCount}
              />
            </div>

            {tournament.status === "upcoming" && (
              <div className="mt-3">
                <CountdownTimer targetDate={tournament.startsAt.toDate()} />
              </div>
            )}
          </div>
        </div>

        {/* Dashboard content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <TournamentDashboard tournament={tournament} />
        </div>
      </main>
      <Footer />
    </>
  );
}
