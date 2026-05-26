import Link from "next/link";
import { WinnerCard } from "@/components/hall-of-fame/WinnerCard";
import type { Winner } from "@/lib/types";

export function HallOfFamePreview({ winners }: { winners: Winner[] }) {
  if (winners.length === 0) return null;

  return (
    <section className="py-16 bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-4xl sm:text-5xl text-foreground tracking-wide mb-2">
            Hall of Fame
          </h2>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto mb-3" />
          <p className="text-muted-foreground">Champions of Bangladesh Free Fire Community</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {winners.slice(0, 3).map((w) => (
            <WinnerCard key={w.id} winner={w} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/hall-of-fame"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            View All Winners →
          </Link>
        </div>
      </div>
    </section>
  );
}
