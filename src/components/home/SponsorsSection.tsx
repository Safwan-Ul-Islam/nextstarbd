import Image from "next/image";
import type { Sponsor } from "@/lib/types";

export function SponsorsSection({ sponsors }: { sponsors: Sponsor[] }) {
  const active = sponsors.filter((s) => s.isActive);
  if (active.length === 0) return null;

  return (
    <section className="py-12 bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
          Our Sponsors &amp; Partners
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {active
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.websiteUrl || "#"}
                target={sponsor.websiteUrl ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="relative h-12 w-28 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100"
              >
                <Image
                  src={sponsor.logoUrl}
                  alt={sponsor.name}
                  fill
                  className="object-contain"
                />
              </a>
            ))}
        </div>
      </div>
    </section>
  );
}
