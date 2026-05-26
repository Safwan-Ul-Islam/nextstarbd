import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CountdownTimer } from "./CountdownTimer";
import { SlotProgressBar } from "./SlotProgressBar";
import type { Tournament, TournamentStatus } from "@/lib/types";
import { formatTournamentDate } from "@/lib/utils/formatDate";
import { resolveBannerUrl } from "@/lib/utils/bannerUrl";

const statusBadge: Record<
  TournamentStatus,
  { label: string; variant: "info" | "danger" | "neutral" | "warning" }
> = {
  upcoming:  { label: "Upcoming",  variant: "info" },
  ongoing:   { label: "LIVE",      variant: "danger" },
  completed: { label: "Completed", variant: "neutral" },
  cancelled: { label: "Cancelled", variant: "warning" },
};

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  const s = statusBadge[tournament.status];
  const isFull = tournament.registeredCount >= tournament.maxSlots;
  const canRegister = tournament.isRegistrationOpen;

  return (
    <div className="rounded-2xl border border-border overflow-hidden bg-white hover:shadow-md transition-shadow flex flex-col">
      {/* Banner — clean, no negative margins */}
      <div
        className="relative h-36 w-full shrink-0 overflow-hidden"
        style={{
          backgroundImage: `url(${resolveBannerUrl(tournament.bannerUrl, tournament.id)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#1f2937",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <h3 className="font-display text-lg text-white tracking-wide leading-tight line-clamp-2 flex-1">
            {tournament.name}
          </h3>
          <Badge variant={s.variant} className="shrink-0">
            {s.label === "LIVE" && (
              <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse mr-1" />
            )}
            {s.label}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Info grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold block">Prize</span>
            <span className="font-bold text-secondary">{tournament.prizePool}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold block">Mode</span>
            <span className="font-semibold">{tournament.mode}</span>
          </div>
          <div className="col-span-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold block">Date</span>
            <span className="font-semibold text-xs">{formatTournamentDate(tournament.startsAt)}</span>
          </div>
        </div>

        {/* Slots */}
        <SlotProgressBar
          filled={tournament.registeredCount}
          max={tournament.maxSlots}
          waitlisted={tournament.waitlistCount}
        />

        {/* Countdown */}
        {tournament.status === "upcoming" && (
          <CountdownTimer targetDate={tournament.startsAt.toDate()} />
        )}

        {/* Actions — pushed to bottom */}
        <div className="flex gap-2 mt-auto pt-1">
          {canRegister ? (
            <Button href={`/register/${tournament.id}`} variant={isFull ? "outline" : "primary"} size="sm" className="flex-1">
              {isFull ? "Join Waitlist" : "Register Squad"}
            </Button>
          ) : (
            <span className="flex-1 text-center text-xs text-muted-foreground py-2 font-medium">
              {tournament.status === "completed" ? "Tournament Ended"
                : tournament.status === "cancelled" ? "Cancelled"
                : "Registration Closed"}
            </span>
          )}
          <Button href={`/tournaments/${tournament.id}`} variant="ghost" size="sm">
            Details
          </Button>
        </div>
      </div>
    </div>
  );
}
