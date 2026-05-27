"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import type { MvpPlayer, Tournament } from "@/lib/types";
import { formatShortDate } from "@/lib/utils/formatDate";

export function MvpAdminPanel({
  mvpPlayers,
  tournaments,
}: {
  mvpPlayers: MvpPlayer[];
  tournaments: Tournament[];
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    tournamentId: "",
    playerName: "",
    uid: "",
    kills: "",
    damage: "",
    achievement: "Most Kills",
    photoUrl: "",
    tournamentDate: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [k]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const tournament = tournaments.find((t) => t.id === form.tournamentId);
    try {
      const res = await fetch("/api/admin/mvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tournamentName: tournament?.name || "" }),
      });
      if (!res.ok) throw new Error();
      showToast("MVP added!", "success");
      setForm({ tournamentId: "", playerName: "", uid: "", kills: "", damage: "", achievement: "Most Kills", photoUrl: "", tournamentDate: "" });
      router.refresh();
    } catch {
      showToast("Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/admin/mvp", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-foreground tracking-wide">MVP Players</h1>

      <div className="bg-white rounded-2xl border border-border p-6">
        <h2 className="font-semibold mb-4">Add MVP Player</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Player IGN *</label>
            <input required value={form.playerName} onChange={set("playerName")} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" placeholder="Player IGN" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Free Fire UID *</label>
            <input required value={form.uid} onChange={set("uid")} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" placeholder="123456789" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Kills *</label>
            <input required type="number" value={form.kills} onChange={set("kills")} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" placeholder="15" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Damage (optional)</label>
            <input type="number" value={form.damage} onChange={set("damage")} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" placeholder="3500" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Achievement</label>
            <select value={form.achievement} onChange={set("achievement")} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary">
              <option>Most Kills</option>
              <option>Booyah MVP</option>
              <option>Highest Damage</option>
              <option>Best Support</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Tournament</label>
            <select value={form.tournamentId} onChange={set("tournamentId")} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary">
              <option value="">Select...</option>
              {tournaments.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Date</label>
            <input type="date" value={form.tournamentDate} onChange={set("tournamentDate")} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Photo URL (optional)</label>
            <input value={form.photoUrl} onChange={set("photoUrl")} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" placeholder="https://..." />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" loading={loading}>Add MVP</Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border"><h2 className="font-semibold">All MVPs ({mvpPlayers.length})</h2></div>
        {mvpPlayers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">No MVP players added yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {mvpPlayers.map((m) => (
              <div key={m.id} className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{m.playerName} <span className="text-muted-foreground font-normal text-sm">({m.uid})</span></p>
                  <p className="text-xs text-muted-foreground truncate">{m.kills} kills · {m.achievement} · {m.tournamentName} · {formatShortDate(m.tournamentDate)}</p>
                </div>
                <button onClick={() => handleDelete(m.id)} className="text-xs text-primary hover:underline shrink-0">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
