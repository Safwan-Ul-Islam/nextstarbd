import { MvpCard } from "@/components/mvp/MvpCard";
import { Button } from "@/components/ui/Button";
import type { MvpPlayer } from "@/lib/types";

export function MvpShowcase({ players }: { players: MvpPlayer[] }) {
  if (players.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-4xl sm:text-5xl text-foreground tracking-wide mb-2">
            MVP Players
          </h2>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto mb-3" />
          <p className="text-muted-foreground">Our most outstanding performers</p>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide justify-start sm:justify-center flex-nowrap">
          {players.slice(0, 6).map((mvp) => (
            <div key={mvp.id} className="snap-start shrink-0">
              <MvpCard mvp={mvp} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
