"use client";

import type { Registration } from "@/lib/types";

const statusConfig = {
  approved: { label: "Approved", classes: "bg-secondary/10 text-secondary border-secondary/30" },
  pending:  { label: "Pending Approval", classes: "bg-amber-50 text-amber-700 border-amber-200" },
  rejected: { label: "Rejected", classes: "bg-red-50 text-red-700 border-red-200" },
};

export function MySquadCard({ registration: reg }: { registration: Registration }) {
  const badge = statusConfig[reg.approvalStatus];

  return (
    <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-display text-xl text-foreground tracking-wide leading-tight">{reg.squadName}</p>
          <span className={`inline-block mt-1.5 text-xs font-bold px-3 py-1 rounded-full border ${badge.classes}`}>
            {badge.label}
          </span>
        </div>
        {reg.slotNumber && !reg.isWaitlisted ? (
          <span className="shrink-0 text-xs font-bold bg-secondary text-white px-2.5 py-1.5 rounded-full">
            Slot #{reg.slotNumber}
          </span>
        ) : reg.isWaitlisted ? (
          <span className="shrink-0 text-xs font-bold bg-amber-400 text-white px-2.5 py-1.5 rounded-full">
            Waitlisted
          </span>
        ) : null}
      </div>

      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Leader</span>
          <span className="font-semibold text-foreground">{reg.leaderName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Leader UID</span>
          <span className="font-mono text-foreground">{reg.leaderUid}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">WhatsApp</span>
          <span className="text-foreground">{reg.whatsapp}</span>
        </div>
      </div>

      <div className="border-t border-border pt-3">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Other Players</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "P2", uid: reg.player2Uid },
            { label: "P3", uid: reg.player3Uid },
            { label: "P4", uid: reg.player4Uid },
          ].map(({ label, uid }) => (
            <div key={uid} className="bg-muted rounded-lg px-3 py-1.5 text-xs">
              <span className="font-semibold text-muted-foreground mr-1.5">{label}</span>
              <span className="font-mono text-foreground">{uid}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
