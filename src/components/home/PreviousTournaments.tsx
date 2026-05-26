"use client";

import Link from "next/link";
import { useCompletedTournaments } from "@/lib/hooks/useCompletedTournaments";
import { resolveBannerUrl } from "@/lib/utils/bannerUrl";
import { formatDateOnly } from "@/lib/utils/formatDate";

export function PreviousTournaments() {
  const { tournaments, loading } = useCompletedTournaments();

  if (loading) return null;
  if (tournaments.length === 0) return null;

  return (
    <section className="py-10 bg-white border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl text-foreground tracking-wide">Previous Tournaments</h2>
            <div className="w-8 h-1 bg-primary rounded-full mt-1" />
          </div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {tournaments.length} completed
          </span>
        </div>

        {/* Horizontal scroll on mobile, wrap grid on desktop */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide sm:grid sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {tournaments.map((t) => (
            <Link
              key={t.id}
              href={`/tournaments/${t.id}`}
              className="group flex-shrink-0 w-44 sm:w-auto bg-gray-50 border border-border rounded-xl overflow-hidden hover:shadow-md hover:border-primary/30 transition-all"
            >
              {/* Small banner */}
              <div style={{ position: "relative", height: "68px", overflow: "hidden", backgroundColor: "#1f2937", flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveBannerUrl(t.bannerUrl, t.id)}
                  alt={t.name}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)" }} />

                {/* Completed badge */}
                <div style={{ position: "absolute", top: 6, right: 6 }}>
                  <span style={{ fontSize: "10px" }} className="bg-gray-700/80 text-white font-bold px-1.5 py-0.5 rounded-full">
                    ✓ Done
                  </span>
                </div>

                {/* Free/fee badge */}
                {t.isFree && (
                  <div style={{ position: "absolute", top: 6, left: 6 }}>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "linear-gradient(90deg,#BF8E00,#FFD700,#BF8E00)", color: "#3B2500" }}>
                      FREE
                    </span>
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="p-2 space-y-1">
                <p className="font-display text-xs text-foreground tracking-wide leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {t.name}
                </p>

                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-primary leading-none">{t.prizePool}</span>
                  <span style={{ fontSize: "10px" }} className="font-semibold text-secondary bg-secondary/10 px-1.5 py-0.5 rounded-full">{t.mode}</span>
                </div>

                <p style={{ fontSize: "10px" }} className="text-muted-foreground">{formatDateOnly(t.startsAt)}</p>

                <div className="pt-0.5">
                  <span style={{ fontSize: "10px" }} className="block text-center font-bold text-primary bg-primary/8 border border-primary/20 rounded-lg py-1 group-hover:bg-primary group-hover:text-white transition-colors">
                    View Results →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
