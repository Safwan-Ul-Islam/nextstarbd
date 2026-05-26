"use client";

import Link from "next/link";
import { useActiveTournaments } from "@/lib/hooks/useActiveTournaments";
import { CountdownTimer } from "@/components/tournaments/CountdownTimer";
import { SlotProgressBar } from "@/components/tournaments/SlotProgressBar";
import { Spinner } from "@/components/ui/Spinner";
import { formatDateOnly, formatTimeOnly } from "@/lib/utils/formatDate";
import { resolveBannerUrl } from "@/lib/utils/bannerUrl";
import type { Tournament } from "@/lib/types";

function ActiveTournamentCard({ tournament }: { tournament: Tournament }) {
  const isOngoing = tournament.status === "ongoing";
  const isFull = tournament.registeredCount >= tournament.maxSlots;
  const canRegister = tournament.isRegistrationOpen;

  return (
    <div className="rounded-3xl border-2 border-border overflow-hidden shadow-sm bg-white">
      {/* Entry strip — above banner */}
      {tournament.isFree ? (
        <div className="flex items-center justify-center gap-2 py-2 px-4 bg-yellow-400 text-yellow-900 font-bold text-xs uppercase tracking-widest">
          ✨ FREE ENTRY — No Registration Fee
        </div>
      ) : tournament.registrationFee ? (
        <div className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-800 text-white font-bold text-xs uppercase tracking-widest">
          Entry Fee: {tournament.registrationFee}
        </div>
      ) : null}

      {/* Banner */}
      <div style={{ position: "relative", height: "160px", overflow: "hidden", backgroundColor: "#1f2937" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolveBannerUrl(tournament.bannerUrl, tournament.id)}
          alt={tournament.name}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)" }} />

        <div style={{ position: "absolute", top: 16, left: 16 }}>
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

        <div style={{ position: "absolute", bottom: 16, left: 20, right: 20 }}>
          <h2 className="font-display text-2xl sm:text-4xl text-white tracking-wide leading-tight drop-shadow-lg">
            {tournament.name}
          </h2>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">

        {/* Prize pool (left) + Start time (right) */}
        <div className="flex items-start gap-3">
          {/* Prize pool */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Prize Pool</p>
            <p className="font-display text-3xl text-primary tracking-wide leading-none">
              {tournament.prizePool}
            </p>
            {(tournament.firstPrize || tournament.secondPrize) && (
              <div className="flex gap-2 mt-1.5 flex-wrap">
                {tournament.firstPrize && (
                  <span className="text-xs font-bold text-secondary bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-full">
                    🥇 {tournament.firstPrize}
                  </span>
                )}
                {tournament.secondPrize && (
                  <span className="text-xs font-bold text-gray-600 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full">
                    🥈 {tournament.secondPrize}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Start time — big highlighted box, right corner */}
          <div className="shrink-0 blink bg-primary text-white rounded-xl px-3 py-2.5 text-right shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-0.5">Starts</p>
            <p className="font-display text-2xl tracking-wide leading-none">
              {formatTimeOnly(tournament.startsAt)}
            </p>
            <p className="text-xs font-semibold opacity-80 mt-0.5">
              {formatDateOnly(tournament.startsAt)}
            </p>
          </div>
        </div>

        {/* Mode chip */}
        <span className="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary border border-secondary/20 text-xs font-bold px-3 py-1.5 rounded-full">
          ⚔️ {tournament.mode}
        </span>

        {/* Slots */}
        <SlotProgressBar
          filled={tournament.registeredCount}
          max={tournament.maxSlots}
          waitlisted={tournament.waitlistCount}
        />

        {/* Registration deadline countdown */}
        <CountdownTimer
          targetDate={tournament.registrationDeadline.toDate()}
          label="Registration Closes In"
        />

        {/* Actions */}
        <div className="flex gap-2">
          {canRegister && (
            <Link
              href={`/register/${tournament.id}`}
              className={`flex-1 text-center font-bold px-4 py-3 rounded-xl text-sm transition-colors ${
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
            className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-foreground font-semibold px-4 py-3 rounded-xl text-sm transition-colors"
          >
            View Details
          </Link>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-2 mb-6">
          <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${hasOngoing ? "bg-primary" : "bg-secondary"}`} />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {hasOngoing ? "Live Tournaments" : "Registration Open"}
          </span>
        </div>

        {/* Grid — always side by side when multiple */}
        <div className={`grid gap-4 ${active.length === 1 ? "max-w-2xl mx-auto" : "grid-cols-2"}`}>
          {active.map((t) => (
            <ActiveTournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
