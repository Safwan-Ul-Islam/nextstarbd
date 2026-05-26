"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Tournament } from "@/lib/types";

export function useActiveTournaments() {
  const [ongoing, setOngoing] = useState<Tournament[]>([]);
  const [upcoming, setUpcoming] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let resolved = 0;
    const done = () => { if (++resolved === 2) setLoading(false); };

    const q1 = query(collection(db, "tournaments"), where("status", "==", "ongoing"), orderBy("startsAt", "asc"));
    const q2 = query(collection(db, "tournaments"), where("status", "==", "upcoming"), orderBy("startsAt", "asc"));

    const u1 = onSnapshot(q1, snap => { setOngoing(snap.docs.map(d => ({ id: d.id, ...d.data() } as Tournament))); done(); }, done);
    const u2 = onSnapshot(q2, snap => { setUpcoming(snap.docs.map(d => ({ id: d.id, ...d.data() } as Tournament))); done(); }, done);

    return () => { u1(); u2(); };
  }, []);

  // "active" = all ongoing; if none, all upcoming-with-registration-open
  const active = ongoing.length > 0
    ? ongoing
    : upcoming.filter(t => t.isRegistrationOpen);

  // "featured" kept for backwards compat (first active)
  const featured = active[0] ?? null;

  // "rest" = upcoming tournaments for the Upcoming grid
  const rest = upcoming;

  return { featured, active, rest, loading };
}
