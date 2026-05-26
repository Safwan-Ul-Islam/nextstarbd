"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";

export function CreateTournamentForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isFree, setIsFree] = useState(true);
  const [form, setForm] = useState({
    name: "",
    description: "",
    mode: "Squad (BR)",
    prizePool: "",
    firstPrize: "",
    secondPrize: "",
    registrationFee: "",
    startsAt: "",
    registrationDeadline: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [k]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, isFree }),
      });
      if (!res.ok) throw new Error("Failed");
      showToast("Tournament created!", "success");
      setIsFree(true);
      setForm({ name: "", description: "", mode: "Squad (BR)", prizePool: "", firstPrize: "", secondPrize: "", registrationFee: "", startsAt: "", registrationDeadline: "" });
      router.refresh();
    } catch {
      showToast("Failed to create tournament", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className="block text-sm font-semibold mb-1">Tournament Name *</label>
        <input
          required
          value={form.name}
          onChange={set("name")}
          className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
          placeholder="BD Free Fire Clash #1"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="block text-sm font-semibold mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={set("description")}
          rows={2}
          className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
          placeholder="Tournament description..."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Mode *</label>
        <select
          required
          value={form.mode}
          onChange={set("mode")}
          className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
        >
          <option>Squad (BR)</option>
          <option>Duo</option>
          <option>Solo</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Total Prize Pool *</label>
        <input
          required
          value={form.prizePool}
          onChange={set("prizePool")}
          className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
          placeholder="৳5,000"
        />
      </div>

      {/* Free / Paid toggle */}
      <div className="sm:col-span-2">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            onClick={() => setIsFree(v => !v)}
            className={`relative w-11 h-6 rounded-full transition-colors ${isFree ? "bg-yellow-400" : "bg-gray-300"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isFree ? "translate-x-5" : "translate-x-0"}`} />
          </div>
          <span className="font-semibold text-sm">
            {isFree ? "✨ Free Entry (no registration fee)" : "Paid Entry"}
          </span>
        </label>
      </div>

      {/* Registration fee — shown only when paid */}
      {!isFree && (
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold mb-1">Registration Fee *</label>
          <input
            required
            value={form.registrationFee}
            onChange={set("registrationFee")}
            className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
            placeholder="৳50"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold mb-1">1st Prize</label>
        <input
          value={form.firstPrize}
          onChange={set("firstPrize")}
          className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
          placeholder="৳3,000"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">2nd Prize</label>
        <input
          value={form.secondPrize}
          onChange={set("secondPrize")}
          className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
          placeholder="৳1,500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Start Date & Time *</label>
        <input
          required
          type="datetime-local"
          value={form.startsAt}
          onChange={set("startsAt")}
          className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Registration Deadline *</label>
        <input
          required
          type="datetime-local"
          value={form.registrationDeadline}
          onChange={set("registrationDeadline")}
          className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
        />
      </div>

      <div className="sm:col-span-2">
        <Button type="submit" loading={loading}>
          Create Tournament
        </Button>
      </div>
    </form>
  );
}
