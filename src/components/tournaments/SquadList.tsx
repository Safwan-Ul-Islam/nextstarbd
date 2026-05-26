"use client";

import { useRegistrations } from "@/lib/hooks/useRegistrations";
import { Spinner } from "@/components/ui/Spinner";
import { useTranslations } from "next-intl";

export function SquadList({ tournamentId }: { tournamentId: string }) {
  const t = useTranslations("dashboard");
  const { registrations, loading } = useRegistrations(tournamentId);

  const confirmed = registrations.filter((r) => !r.isWaitlisted);
  const waitlisted = registrations.filter((r) => r.isWaitlisted);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-3xl mb-2">👥</p>
        <p className="text-muted-foreground">{t("noSquads")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Confirmed squads */}
      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
          {t("squads")} ({confirmed.length}/12)
        </h4>
        <div className="space-y-2">
          {confirmed.map((reg) => (
            <div key={reg.id} className="flex items-start gap-3 bg-secondary-light border border-secondary/20 rounded-xl px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-secondary text-white font-display text-lg flex items-center justify-center shrink-0">
                {reg.slotNumber}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{reg.squadName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Leader: <span className="font-medium">{reg.leaderName}</span>
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {[reg.leaderUid, reg.player2Uid, reg.player3Uid, reg.player4Uid].map((uid, i) => (
                    <span key={uid} className="text-xs text-muted-foreground bg-white px-2 py-0.5 rounded-full">
                      {i === 0 ? "Leader" : `P${i + 1}`}: {uid}
                    </span>
                  ))}
                </div>
              </div>
              {/* Approval badge */}
              <div className="shrink-0">
                {reg.approvalStatus === "approved" && (
                  <span className="text-xs font-bold text-secondary bg-secondary-light border border-secondary/30 px-2 py-1 rounded-full">✅</span>
                )}
                {reg.approvalStatus === "pending" && (
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">⏳</span>
                )}
                {reg.approvalStatus === "rejected" && (
                  <span className="text-xs font-bold text-primary bg-primary-light border border-primary/30 px-2 py-1 rounded-full">❌</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Waitlisted squads */}
      {waitlisted.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
            {t("waitlist")} ({waitlisted.length})
          </h4>
          <div className="space-y-2">
            {waitlisted.map((reg, i) => (
              <div key={reg.id} className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  W{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{reg.squadName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{reg.leaderName} · 📱 {reg.whatsapp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
