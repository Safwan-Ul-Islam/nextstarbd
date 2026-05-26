import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TournamentDashboard } from "@/components/tournaments/TournamentDashboard";
import { SlotProgressBar } from "@/components/tournaments/SlotProgressBar";
import { CountdownTimer } from "@/components/tournaments/CountdownTimer";
import { serialize } from "@/lib/utils/serialize";
import { formatDateOnly, formatTimeOnly } from "@/lib/utils/formatDate";
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

        {/* Entry strip */}
        {tournament.isFree ? (
          <div className="flex items-center justify-center gap-2 py-2.5 px-4 bg-yellow-400 text-yellow-900 font-bold text-sm uppercase tracking-widest">
            ✨ FREE ENTRY — No Registration Fee
          </div>
        ) : tournament.registrationFee ? (
          <div className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-800 text-white font-bold text-sm uppercase tracking-widest">
            Entry Fee: {tournament.registrationFee}
          </div>
        ) : null}

        {/* Banner header */}
        <div style={{ position: "relative", height: "260px", overflow: "hidden", backgroundColor: "#1f2937" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveBannerUrl(tournament.bannerUrl, tournament.id)}
            alt={tournament.name}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }} />

          {/* Back link */}
          <div style={{ position: "absolute", top: 16, left: 16 }}>
            <Link href="/" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium transition-colors">
              ← Home
            </Link>
          </div>

          {/* Status + name */}
          <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
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
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 space-y-4">

            {/* Prize + mode + actions row */}
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Prize Pool</p>
                <p className="font-display text-3xl sm:text-4xl text-primary tracking-wide leading-none">{tournament.prizePool}</p>
                {(tournament.firstPrize || tournament.secondPrize) && (
                  <div className="flex gap-2 mt-2">
                    {tournament.firstPrize && (
                      <span className="text-xs font-bold text-secondary bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-full">🥇 {tournament.firstPrize}</span>
                    )}
                    {tournament.secondPrize && (
                      <span className="text-xs font-bold text-gray-600 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full">🥈 {tournament.secondPrize}</span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="bg-secondary/10 text-secondary border border-secondary/20 text-xs font-bold px-3 py-1.5 rounded-full">⚔️ {tournament.mode}</span>
                <div className="blink bg-primary text-white rounded-2xl px-4 py-3 text-right shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-0.5">Starts</p>
                  <p className="font-display text-2xl sm:text-3xl tracking-wide leading-none">
                    {formatTimeOnly(tournament.startsAt)}
                  </p>
                  <p className="text-xs font-semibold opacity-80 mt-0.5">
                    {formatDateOnly(tournament.startsAt)}
                  </p>
                </div>
                {canRegister && (
                  <Link
                    href={`/register/${id}`}
                    className="bg-primary hover:bg-primary-dark text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors"
                  >
                    Register Squad →
                  </Link>
                )}
              </div>
            </div>

            <SlotProgressBar
              filled={tournament.registeredCount}
              max={tournament.maxSlots}
              waitlisted={tournament.waitlistCount}
            />

            <CountdownTimer
              targetDate={tournament.registrationDeadline.toDate()}
              label="Registration Closes In"
            />
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
