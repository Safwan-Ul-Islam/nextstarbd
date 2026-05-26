"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface TournamentState {
  name: string;
  allUids: string[];
  registeredCount: number;
  maxSlots: number;
  isRegistrationOpen: boolean;
  status: string;
}

const inputClass = "w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white";
const labelClass = "block text-sm font-semibold text-foreground mb-1.5";
const errorClass = "text-primary text-xs mt-1";

export function RegistrationForm({ tournamentId }: { tournamentId: string }) {
  const router = useRouter();
  const [ts, setTs] = useState<TournamentState | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [squadName, setSquadName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderUid, setLeaderUid] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [player2Uid, setPlayer2Uid] = useState("");
  const [player3Uid, setPlayer3Uid] = useState("");
  const [player4Uid, setPlayer4Uid] = useState("");

  useEffect(() => {
    fetch(`/api/register?tournamentId=${tournamentId}`)
      .then((r) => r.json())
      .then((data) => { setTs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [tournamentId]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!squadName.trim()) e.squadName = "Required";
    if (!leaderName.trim()) e.leaderName = "Required";
    if (!leaderUid.trim()) e.leaderUid = "Required";
    if (!whatsapp.trim()) e.whatsapp = "Required";
    if (!player2Uid.trim()) e.player2Uid = "Required";
    if (!player3Uid.trim()) e.player3Uid = "Required";
    if (!player4Uid.trim()) e.player4Uid = "Required";

    const uids = [leaderUid.trim(), player2Uid.trim(), player3Uid.trim(), player4Uid.trim()].filter(Boolean);
    const existing = ts?.allUids || [];
    uids.forEach((uid, i) => {
      if (existing.includes(uid)) {
        const key = i === 0 ? "leaderUid" : `player${i + 1}Uid`;
        e[key] = "This UID is already registered";
      }
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tournamentId, squadName, leaderName, leaderUid, whatsapp, player2Uid, player3Uid, player4Uid }),
      });

      const data = await res.json();
      if (!res.ok) { setFormError(data.error || "Something went wrong"); return; }

      router.push(`/my-registration/${data.registrationId}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!ts?.isRegistrationOpen || ts?.status !== "upcoming") {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">🔒</p>
        <p className="font-semibold text-foreground">Registration is currently closed.</p>
        <p className="text-muted-foreground text-sm mt-1">Check back later for upcoming tournaments.</p>
      </div>
    );
  }

  const isFull = (ts.registeredCount || 0) >= (ts.maxSlots || 12);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Waitlist notice */}
      {isFull && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 font-medium">
          ⚠️ All 12 slots are full. You will be added to the <strong>waiting list</strong>.
        </div>
      )}

      {formError && (
        <div className="bg-primary-light border border-primary rounded-xl px-4 py-3 text-primary text-sm font-medium">
          {formError}
        </div>
      )}

      {/* Squad Name */}
      <div>
        <label className={labelClass}>Squad Name *</label>
        <input type="text" value={squadName} onChange={(e) => setSquadName(e.target.value)}
          className={inputClass} placeholder="e.g. Fire Dragons" />
        {errors.squadName && <p className={errorClass}>{errors.squadName}</p>}
      </div>

      {/* Divider */}
      <div className="border-t border-border pt-1">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">Squad Leader</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Leader Name *</label>
            <input type="text" value={leaderName} onChange={(e) => setLeaderName(e.target.value)}
              className={inputClass} placeholder="In-game name" />
            {errors.leaderName && <p className={errorClass}>{errors.leaderName}</p>}
          </div>
          <div>
            <label className={labelClass}>Leader UID *</label>
            <input type="text" inputMode="numeric" value={leaderUid} onChange={(e) => setLeaderUid(e.target.value)}
              className={inputClass} placeholder="Free Fire UID" />
            {errors.leaderUid && <p className={errorClass}>{errors.leaderUid}</p>}
          </div>
        </div>
      </div>

      {/* WhatsApp */}
      <div>
        <label className={labelClass}>WhatsApp Number *</label>
        <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
          className={inputClass} placeholder="+880 1XXX-XXXXXX" />
        {errors.whatsapp && <p className={errorClass}>{errors.whatsapp}</p>}
      </div>

      {/* Other Players */}
      <div className="border-t border-border pt-1">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Other Players (UIDs)</p>
        <div className="space-y-3">
          {[
            { label: "Player 2 UID *", value: player2Uid, set: setPlayer2Uid, key: "player2Uid" },
            { label: "Player 3 UID *", value: player3Uid, set: setPlayer3Uid, key: "player3Uid" },
            { label: "Player 4 UID *", value: player4Uid, set: setPlayer4Uid, key: "player4Uid" },
          ].map(({ label, value, set, key }) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input type="text" inputMode="numeric" value={value} onChange={(e) => set(e.target.value)}
                className={inputClass} placeholder="Free Fire UID" />
              {errors[key] && <p className={errorClass}>{errors[key]}</p>}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-colors ${
          submitting ? "opacity-60 cursor-not-allowed" : ""
        } ${isFull ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-primary hover:bg-primary-dark text-white"}`}
      >
        {submitting ? "Submitting…" : isFull ? "Join Waiting List" : "Register Squad"}
      </button>
    </form>
  );
}
