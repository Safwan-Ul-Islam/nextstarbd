"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import type { Tournament, Registration, ApprovalStatus } from "@/lib/types";

const statusConfig: Record<ApprovalStatus, { label: string; color: string; icon: string }> = {
  pending:  { label: "Pending Approval", color: "text-amber-600 bg-amber-50 border-amber-200",  icon: "⏳" },
  approved: { label: "Approved",         color: "text-secondary bg-secondary-light border-secondary", icon: "✅" },
  rejected: { label: "Rejected",         color: "text-primary bg-primary-light border-primary",  icon: "❌" },
};

function RegistrationCard({
  reg,
  loading,
  onApprove,
  waitIndex,
}: {
  reg: Registration;
  loading: string | null;
  onApprove: (id: string, status: ApprovalStatus) => void;
  waitIndex: number | null;
}) {
  const cfg = statusConfig[reg.approvalStatus];
  const slotLabel = waitIndex !== null ? `W${waitIndex}` : reg.slotNumber ? `#${reg.slotNumber}` : "—";

  const registeredAt = reg.registeredAt
    ? new Date(
        typeof (reg.registeredAt as { seconds?: number }).seconds === "number"
          ? (reg.registeredAt as { seconds: number }).seconds * 1000
          : reg.registeredAt as unknown as number
      ).toLocaleString("en-BD", { dateStyle: "medium", timeStyle: "short" })
    : null;

  return (
    <div className="p-5 space-y-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display text-lg text-foreground">{reg.squadName}</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Slot {slotLabel}</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.color}`}>{cfg.icon} {cfg.label}</span>
        </div>
        {registeredAt && (
          <span className="text-xs text-muted-foreground shrink-0">{registeredAt}</span>
        )}
      </div>

      {/* Player info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div className="flex justify-between gap-2 border-b border-border pb-1">
          <span className="text-muted-foreground shrink-0">Leader Name</span>
          <span className="font-semibold text-right">{reg.leaderName}</span>
        </div>
        <div className="flex justify-between gap-2 border-b border-border pb-1">
          <span className="text-muted-foreground shrink-0">Leader UID</span>
          <span className="font-mono text-right break-all">{reg.leaderUid}</span>
        </div>
        <div className="flex justify-between gap-2 border-b border-border pb-1">
          <span className="text-muted-foreground shrink-0">WhatsApp</span>
          <span className="font-semibold text-right">{reg.whatsapp}</span>
        </div>
        <div className="flex justify-between gap-2 border-b border-border pb-1">
          <span className="text-muted-foreground shrink-0">bKash</span>
          <span className="font-semibold text-right">{reg.bkash || <span className="text-muted-foreground italic">not provided</span>}</span>
        </div>
        <div className="flex justify-between gap-2 border-b border-border pb-1">
          <span className="text-muted-foreground shrink-0">Player 2 UID</span>
          <span className="font-mono text-right break-all">{reg.player2Uid}</span>
        </div>
        <div className="flex justify-between gap-2 border-b border-border pb-1">
          <span className="text-muted-foreground shrink-0">Player 3 UID</span>
          <span className="font-mono text-right break-all">{reg.player3Uid}</span>
        </div>
        <div className="flex justify-between gap-2 border-b border-border pb-1">
          <span className="text-muted-foreground shrink-0">Player 4 UID</span>
          <span className="font-mono text-right break-all">{reg.player4Uid}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap">
        {reg.approvalStatus !== "approved" && (
          <button
            disabled={loading === reg.id}
            onClick={() => onApprove(reg.id, "approved")}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-secondary text-white hover:bg-secondary/80 disabled:opacity-50 transition-colors"
          >
            {loading === reg.id ? "…" : "✓ Approve"}
          </button>
        )}
        {reg.approvalStatus !== "rejected" && (
          <button
            disabled={loading === reg.id}
            onClick={() => onApprove(reg.id, "rejected")}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/80 disabled:opacity-50 transition-colors"
          >
            {loading === reg.id ? "…" : "✗ Reject"}
          </button>
        )}
        {reg.approvalStatus !== "pending" && (
          <button
            disabled={loading === reg.id}
            onClick={() => onApprove(reg.id, "pending")}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            {loading === reg.id ? "…" : "↺ Reset"}
          </button>
        )}
      </div>
    </div>
  );
}

export function ManageTournamentPanel({
  tournament,
  registrations,
}: {
  tournament: Tournament;
  registrations: Registration[];
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [roomId, setRoomId] = useState(tournament.roomId || "");
  const [roomPassword, setRoomPassword] = useState(tournament.roomPassword || "");

  const patch = async (body: Record<string, unknown>, key: string) => {
    setLoading(key);
    try {
      const res = await fetch(`/api/admin/tournaments/${tournament.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      showToast("Updated!", "success");
      router.refresh();
    } catch {
      showToast("Update failed", "error");
    } finally {
      setLoading(null);
    }
  };

  const setApproval = async (regId: string, approvalStatus: ApprovalStatus) => {
    setLoading(regId);
    try {
      const res = await fetch(`/api/admin/registrations/${regId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalStatus }),
      });
      if (!res.ok) throw new Error();
      showToast(approvalStatus === "approved" ? "Squad approved!" : approvalStatus === "rejected" ? "Squad rejected" : "Status updated", "success");
      router.refresh();
    } catch {
      showToast("Failed to update", "error");
    } finally {
      setLoading(null);
    }
  };

  const confirmed = registrations.filter((r) => !r.isWaitlisted);
  const waitlisted = registrations.filter((r) => r.isWaitlisted);
  const approved = registrations.filter((r) => r.approvalStatus === "approved").length;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <Button href="/admin/tournaments" variant="ghost" size="sm" className="shrink-0 mt-1">← Back</Button>
        <h1 className="font-display text-xl sm:text-3xl text-foreground tracking-wide leading-tight">{tournament.name}</h1>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Registered", value: `${tournament.registeredCount}/${tournament.maxSlots}`, color: "text-foreground" },
          { label: "Approved", value: approved, color: "text-secondary" },
          { label: "Waitlisted", value: tournament.waitlistCount, color: "text-amber-600" },
          { label: "Pending", value: registrations.filter(r => r.approvalStatus === "pending").length, color: "text-primary" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-border p-4 text-center">
            <div className={`font-display text-2xl ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-border p-5">
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Registration</h3>
          <p className="font-bold text-lg mb-3">
            {tournament.isRegistrationOpen ? <span className="text-secondary">Open ✓</span> : <span className="text-primary">Closed</span>}
          </p>
          <Button size="sm" variant={tournament.isRegistrationOpen ? "outline" : "secondary"}
            loading={loading === "reg"}
            onClick={() => patch({ isRegistrationOpen: !tournament.isRegistrationOpen }, "reg")}>
            {tournament.isRegistrationOpen ? "Close Registration" : "Open Registration"}
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5">
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Status</h3>
          <p className="font-bold text-lg mb-3 capitalize">{tournament.status}</p>
          <select className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            value={tournament.status}
            onChange={(e) => patch({ status: e.target.value }, "status")}>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing (LIVE)</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5">
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Room Info</h3>
          <div className="space-y-2 mb-3">
            <input value={roomId} onChange={(e) => setRoomId(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              placeholder="Room ID" />
            <input value={roomPassword} onChange={(e) => setRoomPassword(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              placeholder="Room Password" />
          </div>
          <Button size="sm" loading={loading === "room"}
            onClick={() => patch({ roomId: roomId || null, roomPassword: roomPassword || null }, "room")}>
            Save Room Info
          </Button>
        </div>
      </div>

      {/* Registrations */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">Squad Applications ({confirmed.length})</h2>
          <span className="text-xs text-muted-foreground">{approved} approved</span>
        </div>

        {confirmed.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">No registrations yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {confirmed.map((reg) => <RegistrationCard key={reg.id} reg={reg} loading={loading} onApprove={(id, s) => setApproval(id, s)} waitIndex={null} />)}
          </div>
        )}
      </div>

      {/* Waitlist */}
      {waitlisted.length > 0 && (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold">Waiting List ({waitlisted.length})</h2>
          </div>
          <div className="divide-y divide-border">
            {waitlisted.map((reg, i) => <RegistrationCard key={reg.id} reg={reg} loading={loading} onApprove={(id, s) => setApproval(id, s)} waitIndex={i + 1} />)}
          </div>
        </div>
      )}
    </div>
  );
}
