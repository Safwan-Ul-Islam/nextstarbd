"use client";

import Link from "next/link";
import { useActiveTournaments } from "@/lib/hooks/useActiveTournaments";
import { SlotProgressBar } from "@/components/tournaments/SlotProgressBar";
import { formatTournamentDate } from "@/lib/utils/formatDate";
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcoming.map((t) => {
            const canRegister = t.isRegistrationOpen;
            const isFull = t.registeredCount >= t.maxSlots;

            return (
              <div key={t.id} className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                {/* Banner */}
                <div
                  className="relative h-28 shrink-0"
                  style={{
                    backgroundImage: `url(${resolveBannerUrl(t.bannerUrl, t.id)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: "#1f2937",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between gap-2">
                    <h3 className="font-display text-base text-white tracking-wide leading-tight line-clamp-2 flex-1 drop-shadow">
                      {t.name}
                    </h3>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="bg-primary/8 text-primary text-xs font-bold px-2.5 py-1 rounded-full">🏆 {t.prizePool}</span>
                    <span className="bg-gray-100 text-foreground text-xs font-semibold px-2.5 py-1 rounded-full">{t.mode}</span>
                  </div>

                  <p className="text-xs text-muted-foreground">📅 {formatTournamentDate(t.startsAt)}</p>

                  <SlotProgressBar filled={t.registeredCount} max={t.maxSlots} waitlisted={t.waitlistCount} />

                  <div className="flex gap-2 pt-1 mt-auto">
                    {canRegister ? (
                      <Link href={`/register/${t.id}`}
                        className={`flex-1 text-center text-xs font-bold py-2 rounded-lg transition-colors ${
                          isFull ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-primary hover:bg-primary-dark text-white"
                        }`}>
                        {isFull ? "Join Waitlist" : "Register"}
                      </Link>
                    ) : (
                      <span className="flex-1 text-center text-xs text-muted-foreground py-2">Registration Closed</span>
                    )}
                    <Link href={`/tournaments/${t.id}`}
                      className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-foreground text-xs font-semibold py-2 rounded-lg transition-colors">
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
