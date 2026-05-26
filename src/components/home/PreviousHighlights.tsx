"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Winner, MvpPlayer } from "@/lib/types";
import { formatShortDate } from "@/lib/utils/formatDate";

const positionStyle: Record<number, { label: string; bar: string }> = {
  1: { label: "🥇 Champion",  bar: "bg-primary" },
  2: { label: "🥈 Runner-Up", bar: "bg-gray-400" },
  3: { label: "🥉 3rd Place", bar: "bg-secondary" },
};

function ChampionCard({ winner }: { winner: Winner }) {
  const s = positionStyle[winner.position] ?? positionStyle[3];
  return (
    <div className="snap-start shrink-0 w-60 bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      <div className={`h-1.5 ${s.bar}`} />
      {winner.photoUrl ? (
        <div className="relative h-32 bg-gray-100">
          <Image src={winner.photoUrl} alt={winner.squadName} fill className="object-cover" />
        </div>
      ) : (
        <div className="h-20 bg-gray-50 flex items-center justify-center text-3xl">🏆</div>
      )}
      <div className="p-4">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{s.label}</span>
        <h3 className="font-display text-lg text-foreground tracking-wide mt-0.5 mb-1">{winner.squadName}</h3>
        <p className="text-xs text-muted-foreground mb-2">{winner.tournamentName} · {formatShortDate(winner.tournamentDate)}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {winner.players.slice(0, 3).map((p) => (
            <span key={p} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{p}</span>
          ))}
          {winner.players.length > 3 && (
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-muted-foreground">+{winner.players.length - 3}</span>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2">
          <span className="text-xs text-muted-foreground">Prize</span>
          <span className="font-display text-base text-secondary">{winner.prize}</span>
        </div>
      </div>
    </div>
  );
}

function MvpCard({ mvp }: { mvp: MvpPlayer }) {
  return (
    <div className="snap-start shrink-0 w-52 bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-1.5 bg-secondary" />
      <div className="p-4 text-center">
        <div className="relative w-14 h-14 mx-auto mb-3">
          {mvp.photoUrl ? (
            <Image src={mvp.photoUrl} alt={mvp.playerName} fill className="object-cover rounded-full" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center text-white font-display text-xl">
              {mvp.playerName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 bg-secondary text-white text-xs font-bold px-1.5 py-0.5 rounded-full">MVP</div>
        </div>
        <h3 className="font-display text-base text-foreground tracking-wide">{mvp.playerName}</h3>
        <p className="text-xs text-muted-foreground mb-3">{mvp.achievement}</p>
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="text-center">
            <div className="font-display text-xl text-primary">{mvp.kills}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Kills</div>
          </div>
          {mvp.damage && (
            <div className="text-center">
              <div className="font-display text-xl text-secondary">{mvp.damage}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">DMG</div>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground border-t border-border pt-2">
          {mvp.tournamentName} · {formatShortDate(mvp.tournamentDate)}
        </p>
      </div>
    </div>
  );
}

type Tab = "champions" | "mvp";

export function PreviousHighlights({ winners, mvpPlayers }: { winners: Winner[]; mvpPlayers: MvpPlayer[] }) {
  const [tab, setTab] = useState<Tab>("champions");

  if (winners.length === 0 && mvpPlayers.length === 0) return null;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "champions", label: "Previous Champions", count: winners.length },
    { key: "mvp",       label: "MVP Players",        count: mvpPlayers.length },
  ];

  return (
    <section className="py-12 bg-white border-t border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header + tabs */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h2 className="font-display text-3xl text-foreground tracking-wide">Hall of Fame</h2>
            <div className="w-10 h-1 bg-secondary rounded-full mt-1" />
          </div>
          <Link href="/hall-of-fame" className="text-sm font-semibold text-secondary hover:underline">
            View All →
          </Link>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-5 border-b border-border">
          {tabs.map((t) => t.count > 0 && (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`pb-2.5 px-1 text-sm font-semibold transition-colors border-b-2 ${
                tab === t.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
              <span className="ml-1.5 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">{t.count}</span>
            </button>
          ))}
        </div>

        {/* Carousel */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide -mx-1 px-1">
          {tab === "champions" && winners.map((w) => <ChampionCard key={w.id} winner={w} />)}
          {tab === "mvp"       && mvpPlayers.map((m) => <MvpCard key={m.id} mvp={m} />)}
        </div>
      </div>
    </section>
  );
}
