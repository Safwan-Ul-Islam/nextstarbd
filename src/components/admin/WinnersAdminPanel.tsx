"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import type { Winner, Tournament } from "@/lib/types";
import { formatShortDate } from "@/lib/utils/formatDate";

export function WinnersAdminPanel({
  winners,
  tournaments,
}: {
  winners: Winner[];
  tournaments: Tournament[];
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    tournamentId: "",
    squadName: "",
    players: "",
    prize: "",
    position: "1",
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
      const res = await fetch("/api/admin/winners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          position: Number(form.position),
          tournamentName: tournament?.name || "",
          players: form.players.split(",").map((p) => p.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error();
      showToast("Winner added!", "success");
      setForm({ tournamentId: "", squadName: "", players: "", prize: "", position: "1", photoUrl: "", tournamentDate: "" });
      router.refresh();
    } catch {
      showToast("Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/admin/winners", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-foreground tracking-wide">Hall of Fame — Winners</h1>

      <div className="bg-white rounded-2xl border border-border p-6">
        <h2 className="font-semibold mb-4">Add Winner</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Tournament</label>
            <select value={form.tournamentId} onChange={set("tournamentId")} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary">
              <option value="">Select tournament...</option>
              {tournaments.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Position *</label>
            <select required value={form.position} onChange={set("position")} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary">
              <option value="1">🥇 1st — Champion</option>
              <option value="2">🥈 2nd — Runner-Up</option>
              <option value="3">🥉 3rd — Third Place</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Squad Name *</label>
            <input required value={form.squadName} onChange={set("squadName")} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" placeholder="Fire Dragons" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Prize Pool *</label>
            <input required value={form.prize} onChange={set("prize")} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" placeholder="৳5,000" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold mb-1">Player IGNs (comma-separated) *</label>
            <input required value={form.players} onChange={set("players")} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" placeholder="Player1, Player2, Player3, Player4" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Tournament Date</label>
            <input type="date" value={form.tournamentDate} onChange={set("tournamentDate")} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Photo URL (optional)</label>
            <input value={form.photoUrl} onChange={set("photoUrl")} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" placeholder="https://..." />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" loading={loading}>Add Winner</Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border"><h2 className="font-semibold">All Winners ({winners.length})</h2></div>
        {winners.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">No winners added yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {winners.map((w) => (
              <div key={w.id} className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{w.squadName} <span className="text-muted-foreground font-normal">— {w.position === 1 ? "🥇" : w.position === 2 ? "🥈" : "🥉"}</span></p>
                  <p className="text-xs text-muted-foreground truncate">{w.tournamentName} · {formatShortDate(w.tournamentDate)} · {w.prize}</p>
                </div>
                <button onClick={() => handleDelete(w.id)} className="text-xs text-primary hover:underline shrink-0 font-medium">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
