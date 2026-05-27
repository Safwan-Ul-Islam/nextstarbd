import Link from "next/link";
import type { Tournament } from "@/lib/types";
import { formatShortDate } from "@/lib/utils/formatDate";
import { CreateTournamentForm } from "@/components/admin/CreateTournamentForm";

async function getTournaments(): Promise<Tournament[]> {
  const { adminDb } = await import("@/lib/firebase/admin");
  const snap = await adminDb
    .collection("tournaments")
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Tournament));
}

export default async function AdminTournamentsPage() {
  const tournaments = await getTournaments();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-foreground tracking-wide">
          Tournaments
        </h1>
      </div>

      {/* Create form */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h2 className="font-semibold text-lg mb-4">Create Tournament</h2>
        <CreateTournamentForm />
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-lg">All Tournaments</h2>
        </div>
        {tournaments.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No tournaments yet. Create one above.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {tournaments.map((t) => (
              <div
                key={t.id}
                className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-muted/50"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold truncate flex-1 min-w-0">{t.name}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        t.status === "upcoming"
                          ? "bg-blue-100 text-blue-700"
                          : t.status === "ongoing"
                          ? "bg-primary-light text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {t.status}
                    </span>
                    <Link
                      href={`/admin/tournaments/${t.id}`}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      Manage →
                    </Link>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatShortDate(t.startsAt)} · {t.mode} · {t.registeredCount}/{t.maxSlots} squads
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
