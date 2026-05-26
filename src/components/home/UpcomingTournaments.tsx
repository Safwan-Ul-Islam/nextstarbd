"use client";

import Link from "next/link";
import { useActiveTournaments } from "@/lib/hooks/useActiveTournaments";
import { SlotProgressBar } from "@/components/tournaments/SlotProgressBar";
import { formatDateOnly, formatTimeOnly } from "@/lib/utils/formatDate";
import { resolveBannerUrl } from "@/lib/utils/bannerUrl";

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
          {upcoming.map((t) => {
            const canRegister = t.isRegistrationOpen;
            const isFull = t.registeredCount >= t.maxSlots;

            return (
              <div key={t.id} className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">

                {/* Entry strip */}
                {t.isFree ? (
                  <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-yellow-400 text-yellow-900 font-bold text-xs uppercase tracking-widest">
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

                  {/* Prize pool — big */}
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
                  <div className="flex items-start gap-2">
                    <span className="flex-1 self-start bg-secondary/10 text-secondary border border-secondary/20 text-xs font-bold px-3 py-1.5 rounded-full">
                      ⚔️ {t.mode}
                    </span>
                    {/* Start time box — right corner, blinking */}
                    <div className="shrink-0 blink bg-primary text-white rounded-xl px-3 py-2 text-right shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-widest opacity-80 leading-none mb-0.5">Starts</p>
                      <p className="font-display text-lg tracking-wide leading-none">{formatTimeOnly(t.startsAt)}</p>
                      <p className="text-xs font-semibold opacity-80 mt-0.5">{formatDateOnly(t.startsAt)}</p>
                    </div>
                  </div>

                  {/* Slots — compact */}
                  <SlotProgressBar filled={t.registeredCount} max={t.maxSlots} waitlisted={t.waitlistCount} />

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    {canRegister ? (
                      <Link
                        href={`/register/${t.id}`}
                        className={`flex-1 text-center text-sm font-bold py-2.5 rounded-xl transition-colors ${
                          isFull ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-primary hover:bg-primary-dark text-white"
                        }`}
                      >
                        {isFull ? "Join Waitlist" : "Register"}
                      </Link>
                    ) : (
                      <span className="flex-1 text-center text-xs text-muted-foreground py-2.5">Registration Closed</span>
                    )}
                    <Link
                      href={`/tournaments/${t.id}`}
                      className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-foreground text-sm font-semibold py-2.5 rounded-xl transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
