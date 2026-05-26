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
      <div className="flex items-center gap-3">
        <Button href="/admin/tournaments" variant="ghost" size="sm">← Back</Button>
        <h1 className="font-display text-3xl text-foreground tracking-wide">{tournament.name}</h1>
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
            {confirmed.map((reg) => {
              const s = statusConfig[reg.approvalStatus || "pending"];
              return (
                <div key={reg.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Squad header */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {reg.slotNumber && (
                          <span className="w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {reg.slotNumber}
                          </span>
                        )}
                        <span className="font-bold text-foreground">{reg.squadName}</span>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.color}`}>
                          {s.icon} {s.label}
                        </span>
                      </div>

                      {/* Leader */}
                      <div className="text-sm mb-1">
                        <span className="text-muted-foreground">Leader: </span>
                        <span className="font-medium">{reg.leaderName}</span>
                        <span className="text-muted-foreground ml-2 text-xs">UID: {reg.leaderUid}</span>
                      </div>

                      {/* UIDs */}
                      <div className="flex flex-wrap gap-1.5 mb-1">
                        {[reg.player2Uid, reg.player3Uid, reg.player4Uid].map((uid, i) => (
                          <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-muted-foreground">
                            P{i + 2}: {uid}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs text-muted-foreground">📱 {reg.whatsapp}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-1.5 shrink-0">
                      {reg.approvalStatus !== "approved" && (
                        <button
                          onClick={() => setApproval(reg.id, "approved")}
                          disabled={loading === reg.id}
                          className="text-xs font-bold bg-secondary hover:bg-secondary-dark text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          Approve
                        </button>
                      )}
                      {reg.approvalStatus !== "rejected" && (
                        <button
                          onClick={() => setApproval(reg.id, "rejected")}
                          disabled={loading === reg.id}
                          className="text-xs font-bold bg-gray-100 hover:bg-primary hover:text-white text-foreground px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                      )}
                      {reg.approvalStatus !== "pending" && (
                        <button
                          onClick={() => setApproval(reg.id, "pending")}
                          disabled={loading === reg.id}
                          className="text-xs text-muted-foreground hover:text-foreground px-3 py-1 transition-colors disabled:opacity-50"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
            {waitlisted.map((reg, i) => {
              const s = statusConfig[reg.approvalStatus || "pending"];
              return (
                <div key={reg.id} className="px-5 py-4 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="w-6 h-6 rounded-full bg-amber-400 text-white text-xs font-bold flex items-center justify-center">
                        W{i + 1}
                      </span>
                      <span className="font-bold">{reg.squadName}</span>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.color}`}>
                        {s.icon} {s.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {reg.leaderName} · 📱 {reg.whatsapp}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {reg.approvalStatus !== "approved" && (
                      <button onClick={() => setApproval(reg.id, "approved")} disabled={loading === reg.id}
                        className="text-xs font-bold bg-secondary hover:bg-secondary-dark text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                        Approve
                      </button>
                    )}
                    {reg.approvalStatus !== "rejected" && (
                      <button onClick={() => setApproval(reg.id, "rejected")} disabled={loading === reg.id}
                        className="text-xs font-bold bg-gray-100 hover:bg-primary hover:text-white text-foreground px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
