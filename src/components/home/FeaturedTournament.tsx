"use client";

import Link from "next/link";
import { useActiveTournaments } from "@/lib/hooks/useActiveTournaments";
import { CountdownTimer } from "@/components/tournaments/CountdownTimer";
import { SlotProgressBar } from "@/components/tournaments/SlotProgressBar";
import { Spinner } from "@/components/ui/Spinner";
import { formatTournamentDate } from "@/lib/utils/formatDate";
import { resolveBannerUrl } from "@/lib/utils/bannerUrl";
import type { Tournament } from "@/lib/types";

function ActiveTournamentCard({ tournament }: { tournament: Tournament }) {
  const isOngoing = tournament.status === "ongoing";
  const isFull = tournament.registeredCount >= tournament.maxSlots;
  const canRegister = tournament.isRegistrationOpen;

  return (
    <div className="rounded-3xl border-2 border-border overflow-hidden shadow-sm">
      {/* Banner */}
      <div
        className="relative h-52 sm:h-72 overflow-hidden"
        style={{
          backgroundImage: `url(${resolveBannerUrl(tournament.bannerUrl, tournament.id)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#1f2937",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Status pill */}
        <div className="absolute top-4 left-4">
          {isOngoing ? (
            <span className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE NOW
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-secondary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
              Registration Open
            </span>
          )}
        </div>

        {/* Name on banner */}
        <div className="absolute bottom-5 left-5 right-5">
          <h2 className="font-display text-3xl sm:text-5xl text-white tracking-wide leading-tight drop-shadow-lg">
            {tournament.name}
          </h2>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white p-5 sm:p-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="bg-primary/8 text-primary border border-primary/20 text-xs font-bold px-3 py-1.5 rounded-full">
                🏆 {tournament.prizePool}
              </span>
              <span className="bg-gray-100 text-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
                ⚔️ {tournament.mode}
              </span>
              <span className="bg-gray-100 text-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
                📅 {formatTournamentDate(tournament.startsAt)}
              </span>
            </div>
            <SlotProgressBar
              filled={tournament.registeredCount}
              max={tournament.maxSlots}
              waitlisted={tournament.waitlistCount}
            />
          </div>

          {/* Right */}
          <div className="flex flex-col justify-between gap-4">
            <CountdownTimer targetDate={tournament.startsAt.toDate()} />
            <div className="flex gap-3">
              {canRegister && (
                <Link
                  href={`/register/${tournament.id}`}
                  className={`flex-1 text-center font-bold px-5 py-3 rounded-xl text-sm transition-colors ${
                    isFull
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : "bg-primary hover:bg-primary-dark text-white"
                  }`}
                >
                  {isFull ? "Join Waitlist" : "Register Squad →"}
                </Link>
              )}
              <Link
                href={`/tournaments/${tournament.id}`}
                className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-foreground font-semibold px-5 py-3 rounded-xl text-sm transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturedTournament() {
  const { active, loading } = useActiveTournaments();

  if (loading) {
    return (
      <section className="py-20 bg-white border-t border-border flex justify-center">
        <Spinner size="lg" />
      </section>
    );
  }

  if (active.length === 0) {
    return (
      <section className="py-20 bg-white border-t border-border text-center">
        <p className="text-5xl mb-4">🎮</p>
        <p className="text-lg font-semibold text-foreground">No active tournament right now</p>
        <p className="text-muted-foreground text-sm mt-1">Check back soon for the next one!</p>
      </section>
    );
  }

  const hasOngoing = active[0].status === "ongoing";

  return (
    <section className="py-12 bg-white border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Label */}
        <div className="flex items-center gap-2 mb-5">
          <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${hasOngoing ? "bg-primary" : "bg-secondary"}`} />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {hasOngoing ? "Live Tournaments" : "Registration Open"}
          </span>
        </div>

        {/* All active tournaments — same card, stacked */}
        <div className="space-y-6">
          {active.map((t) => (
            <ActiveTournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
