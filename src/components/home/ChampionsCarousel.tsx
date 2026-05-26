import Image from "next/image";
import Link from "next/link";
import type { Winner } from "@/lib/types";
import { formatShortDate } from "@/lib/utils/formatDate";

const positionStyle = {
  1: { label: "🥇 Champion", accent: "bg-primary", text: "text-white" },
  2: { label: "🥈 Runner-Up", accent: "bg-gray-400", text: "text-white" },
  3: { label: "🥉 3rd Place", accent: "bg-secondary", text: "text-white" },
};

export function ChampionsCarousel({ winners }: { winners: Winner[] }) {
  if (winners.length === 0) return null;

  return (
    <section className="py-12 bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-3xl text-foreground tracking-wide">
              Previous Champions
            </h2>
            <div className="w-12 h-1 bg-secondary rounded-full mt-1" />
          </div>
          <Link
            href="/hall-of-fame"
            className="text-sm font-semibold text-secondary hover:underline"
          >
            Full Hall of Fame →
          </Link>
        </div>

        {/* Carousel */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide -mx-1 px-1">
          {winners.map((w) => {
            const style = positionStyle[w.position];
            return (
              <div
                key={w.id}
                className="snap-start shrink-0 w-64 bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Position bar */}
                <div className={`${style.accent} px-4 py-2 ${style.text}`}>
                  <span className="text-xs font-bold uppercase tracking-wider">{style.label}</span>
                </div>

                {/* Photo */}
                {w.photoUrl ? (
                  <div className="relative h-36 bg-gray-100">
                    <Image src={w.photoUrl} alt={w.squadName} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="h-20 bg-gray-50 flex items-center justify-center">
                    <span className="text-3xl">🏆</span>
                  </div>
                )}

                <div className="p-4">
                  <h3 className="font-display text-xl text-foreground tracking-wide mb-0.5">
                    {w.squadName}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {w.tournamentName} · {formatShortDate(w.tournamentDate)}
                  </p>

                  {/* Players */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {w.players.slice(0, 3).map((p) => (
                      <span key={p} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                        {p}
                      </span>
                    ))}
                    {w.players.length > 3 && (
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full font-medium text-muted-foreground">
                        +{w.players.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-2">
                    <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Prize</span>
                    <span className="font-display text-lg text-secondary">{w.prize}</span>
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
