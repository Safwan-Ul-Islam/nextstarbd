"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { MvpPlayer, Tournament, Winner } from "@/lib/types";
import { formatDateOnly, formatTimeOnly } from "@/lib/utils/formatDate";
import { resolveBannerUrl } from "@/lib/utils/bannerUrl";

/* ── Slide types ─────────────────────────────────────────────── */
type Slide =
  | { type: "banner" }
  | { type: "champion"; champion: Winner; runnerUp: Winner | null; tournamentName: string }
  | { type: "leaderboard"; player: MvpPlayer }
  | { type: "upcoming"; tournament: Tournament };

/* ── Banner image slide ──────────────────────────────────────── */
function BannerSlide() {
  return (
    <div className="relative h-52 sm:h-72 overflow-hidden bg-black">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/banners/bgbn.png"
        alt="NextStarBD"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}

/* ── Champion slide — shows champion + runner-up together ────── */
function ChampionSlide({ champion, runnerUp, tournamentName }: {
  champion: Winner;
  runnerUp: Winner | null;
  tournamentName: string;
}) {
  return (
    <div className="relative h-52 sm:h-72 overflow-hidden flex flex-col">
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/banners/bgtp.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />
      {/* Dim overlay */}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.88)" }} />

      {/* Tournament name header */}
      <div className="relative flex items-center gap-2 px-4 sm:px-6 pt-2.5 pb-2 border-b border-white/10 shrink-0">
        <span className="text-yellow-400 text-xs leading-none">🏆</span>
        <span className="text-white/60 text-[10px] sm:text-xs font-bold uppercase tracking-widest truncate">{tournamentName}</span>
        <span className="text-white/25 text-[10px] ml-auto shrink-0">Champions</span>
      </div>

      {/* Side-by-side halves */}
      <div className="relative flex flex-1 min-h-0">

        {/* ── Champion (left) ── */}
        <div
          className="flex-1 flex flex-col justify-center px-3 sm:px-6 py-2 sm:py-4 border-r border-white/10 overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(255,215,0,0.12) 0%, transparent 70%)" }}
        >
          <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-yellow-400 mb-1">🥇 Champion</span>
          <p className="text-white font-bold text-base sm:text-2xl leading-tight line-clamp-1">{champion.squadName}</p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {champion.players.slice(0, 4).map((p, i) => (
              <span key={i} className="text-white/70 text-[8px] sm:text-[10px] font-mono bg-black/30 border border-yellow-500/25 px-1.5 py-0.5 rounded-full leading-none">
                {p}
              </span>
            ))}
          </div>
          {champion.prize && (
            <span className="text-yellow-400 text-[9px] sm:text-xs font-bold mt-2 leading-none">{champion.prize}</span>
          )}
        </div>

        {/* ── Runner-up (right) ── */}
        {runnerUp ? (
          <div
            className="flex-1 flex flex-col justify-center px-3 sm:px-6 py-2 sm:py-4 overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(192,192,192,0.10) 0%, transparent 70%)" }}
          >
            <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-gray-300 mb-1">🥈 Runner-Up</span>
            <p className="text-white font-bold text-base sm:text-2xl leading-tight line-clamp-1">{runnerUp.squadName}</p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {runnerUp.players.slice(0, 4).map((p, i) => (
                <span key={i} className="text-white/70 text-[8px] sm:text-[10px] font-mono bg-black/30 border border-white/15 px-1.5 py-0.5 rounded-full leading-none">
                  {p}
                </span>
              ))}
            </div>
            {runnerUp.prize && (
              <span className="text-gray-300 text-[9px] sm:text-xs font-bold mt-2 leading-none">{runnerUp.prize}</span>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-white/20 text-xs">No runner-up recorded</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Leaderboard slide ───────────────────────────────────────── */
function LeaderboardSlide({ player }: { player: MvpPlayer }) {
  return (
    <div
      className="relative h-52 sm:h-72 flex items-center overflow-hidden"
    >
      {/* Background image — dimmed but colours preserved */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/banners/mvpbg.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.45)" }} />

      <div className="relative w-full px-5 sm:px-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-primary text-[10px] sm:text-xs font-black uppercase tracking-widest">Top Kills</span>
          <span className="text-white/30 text-[10px] mx-1">·</span>
          <span className="text-white/70 text-[10px] sm:text-xs font-semibold truncate">{player.tournamentName}</span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-primary/30 border-2 border-primary flex items-center justify-center text-2xl sm:text-4xl shadow-lg shadow-primary/20">
            💀
          </div>

          <div className="min-w-0">
            <p className="text-white font-black text-xl sm:text-3xl leading-tight truncate drop-shadow">{player.playerName}</p>
            <p className="text-white/55 text-[10px] sm:text-xs font-mono mt-0.5">UID: {player.uid}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-primary font-black text-4xl sm:text-5xl leading-none drop-shadow-lg">{player.kills}</span>
              <span className="text-white/70 text-xs sm:text-sm font-bold uppercase tracking-wide">kills</span>
              {player.damage && (
                <span className="text-white/45 text-xs hidden sm:inline">{player.damage.toLocaleString()} dmg</span>
              )}
            </div>
          </div>

          {player.achievement && (
            <div className="hidden sm:block ml-auto shrink-0 bg-yellow-500/15 border border-yellow-400/50 rounded-xl px-4 py-2 text-center shadow shadow-yellow-500/10">
              <p className="text-yellow-300 text-xs font-black">{player.achievement}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Upcoming tournament slide ───────────────────────────────── */
function UpcomingSlide({ tournament }: { tournament: Tournament }) {
  return (
    <div className="relative h-52 sm:h-72 overflow-hidden" style={{ backgroundColor: "#1f2937" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolveBannerUrl(tournament.bannerUrl, tournament.id)}
        alt={tournament.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 55%, transparent 100%)" }}
      />

      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
        <span className="inline-block bg-secondary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-2">
          🎮 Upcoming
        </span>
        <h3 className="font-display text-white text-xl sm:text-3xl leading-tight mb-2 line-clamp-1">
          {tournament.name}
        </h3>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-primary font-bold text-sm sm:text-base">{tournament.prizePool}</span>
            <span className="text-white/40 text-xs hidden sm:inline">·</span>
            <span className="text-white/60 text-xs sm:text-sm">{formatTimeOnly(tournament.startsAt)} · {formatDateOnly(tournament.startsAt)}</span>
          </div>
          <Link
            href={`/tournaments/${tournament.id}`}
            className="shrink-0 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors border border-white/20"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Main carousel ───────────────────────────────────────────── */
export function HeroCarousel({
  winners,
  mvpPlayers,
  upcomingTournaments,
}: {
  winners: Winner[];
  mvpPlayers: MvpPlayer[];
  upcomingTournaments: Tournament[];
}) {
  // Group winners by tournament so champion + runner-up appear on the same slide
  const tournamentMap = new Map<string, { champion?: Winner; runnerUp?: Winner; tournamentName: string }>();
  for (const w of winners) {
    if (!tournamentMap.has(w.tournamentId)) {
      tournamentMap.set(w.tournamentId, { tournamentName: w.tournamentName });
    }
    const entry = tournamentMap.get(w.tournamentId)!;
    if (w.position === 1) entry.champion = w;
    if (w.position === 2) entry.runnerUp = w;
  }
  const championSlides: Slide[] = Array.from(tournamentMap.values())
    .filter((e) => e.champion)
    .slice(0, 3)
    .map((e) => ({
      type: "champion" as const,
      champion: e.champion!,
      runnerUp: e.runnerUp ?? null,
      tournamentName: e.tournamentName,
    }));

  const slides: Slide[] = [
    { type: "banner" },
    ...championSlides,
    ...mvpPlayers.slice(0, 4).map((p) => ({ type: "leaderboard" as const, player: p })),
    ...upcomingTournaments.slice(0, 3).map((t) => ({ type: "upcoming" as const, tournament: t })),
  ];

  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [next]);

  return (
    <div className="relative overflow-hidden rounded-2xl mx-3 my-3 sm:mx-6 sm:my-4 shadow-md">
      {/* Slide track */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="w-full shrink-0">
            {slide.type === "banner"      && <BannerSlide />}
            {slide.type === "champion"    && <ChampionSlide champion={slide.champion} runnerUp={slide.runnerUp} tournamentName={slide.tournamentName} />}
            {slide.type === "leaderboard" && <LeaderboardSlide player={slide.player} />}
            {slide.type === "upcoming"    && <UpcomingSlide tournament={slide.tournament} />}
          </div>
        ))}
      </div>

      {/* Prev / Next arrows — desktop only */}
      <button
        onClick={prev}
        className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/70 text-white rounded-full items-center justify-center transition-colors z-10"
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        onClick={() => next()}
        className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/70 text-white rounded-full items-center justify-center transition-colors z-10"
        aria-label="Next"
      >
        ›
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "bg-white w-5" : "bg-white/40 w-1.5"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
