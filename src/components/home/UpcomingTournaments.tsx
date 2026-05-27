"use client";

import Link from "next/link";
import { useActiveTournaments } from "@/lib/hooks/useActiveTournaments";
import { useMyRegistration } from "@/lib/hooks/useMyRegistration";
import { SlotProgressBar } from "@/components/tournaments/SlotProgressBar";
import { formatDateOnly, formatTimeOnly } from "@/lib/utils/formatDate";
import { resolveBannerUrl } from "@/lib/utils/bannerUrl";

function CardAction({ tournamentId }: { tournamentId: string }) {
  const { myReg, loading } = useMyRegistration(tournamentId);

  if (loading) {
    return <div className="block w-full h-10 rounded-xl bg-gray-100 animate-pulse" />;
  }

  if (myReg) {
    return (
      <Link
        href={`/my-registration/${myReg.id}`}
        className="block w-full text-center bg-primary/10 hover:bg-primary/20 text-primary text-sm font-semibold py-2.5 rounded-xl transition-colors"
      >
        📢 Announcements
      </Link>
    );
  }

  return (
    <Link
      href={`/tournaments/${tournamentId}`}
      className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-foreground text-sm font-semibold py-2.5 rounded-xl transition-colors"
    >
      View Details
    </Link>
  );
}

export function UpcomingTournaments() {
  const { rest: upcoming, loading } = useActiveTournaments();

  if (loading || upcoming.length === 0) return null;

  return (
    <section id="upcoming-tournaments" className="py-12 bg-gray-50 border-t border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-3xl text-foreground tracking-wide">Upcoming Tournaments</h2>
            <div className="w-10 h-1 bg-primary rounded-full mt-1" />
          </div>
          <Link href="/tournaments" className="text-sm font-semibold text-primary hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {upcoming.map((t) => (
            <div key={t.id} className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">

              {/* Entry strip */}
              {t.isFree ? (
                <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 font-bold text-xs uppercase tracking-widest" style={{ background: "linear-gradient(90deg,#BF8E00,#FFD700,#BF8E00)", color: "#3B2500" }}>
                  ✨ FREE ENTRY
                </div>
              ) : t.registrationFee ? (
                <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-gray-800 text-white font-bold text-xs uppercase tracking-widest">
                  Entry Fee: {t.registrationFee}
                </div>
              ) : null}

              {/* Banner */}
              <div style={{ position: "relative", height: "120px", overflow: "hidden", backgroundColor: "#1f2937", flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveBannerUrl(t.bannerUrl, t.id)}
                  alt={t.name}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />
                <div style={{ position: "absolute", bottom: 10, left: 12, right: 12 }}>
                  <h3 className="font-display text-lg text-white tracking-wide leading-tight line-clamp-1 drop-shadow">
                    {t.name}
                  </h3>
                </div>
              </div>

              <div className="p-4 flex flex-col gap-3 flex-1">

                {/* Prize pool */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Prize Pool</p>
                  <p className="font-display text-3xl text-primary tracking-wide leading-none">{t.prizePool}</p>
                  {(t.firstPrize || t.secondPrize) && (
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      {t.firstPrize && (
                        <span className="text-xs font-bold text-secondary bg-secondary/10 border border-secondary/20 px-2.5 py-0.5 rounded-full">🥇 {t.firstPrize}</span>
                      )}
                      {t.secondPrize && (
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-0.5 rounded-full">🥈 {t.secondPrize}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Mode + Start time */}
                <div className="flex items-center gap-2">
                  <span className="shrink-0 bg-secondary/10 text-secondary border border-secondary/20 text-xs font-bold px-2.5 py-1.5 rounded-full">
                    ⚔️ {t.mode}
                  </span>
                  <div className="flex-1" />
                  <div className="shrink-0 blink bg-primary text-white rounded-xl px-2.5 py-1.5 text-right shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-widest opacity-80 leading-none mb-0.5">Starts</p>
                    <p className="font-display text-base tracking-wide leading-none">{formatTimeOnly(t.startsAt)}</p>
                    <p className="text-[10px] font-semibold opacity-80 mt-0.5">{formatDateOnly(t.startsAt)}</p>
                  </div>
                </div>

                {/* Slots */}
                <SlotProgressBar filled={t.registeredCount} max={t.maxSlots} waitlisted={t.waitlistCount} />

                {/* Action — swaps to Announcements if registered */}
                <div className="mt-auto">
                  <CardAction tournamentId={t.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
