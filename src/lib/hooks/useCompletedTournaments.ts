"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Tournament } from "@/lib/types";

export function useCompletedTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "tournaments"),
      where("status", "==", "completed")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as Tournament))
          .sort((a, b) => {
            const aTs = (a.startsAt as unknown as { seconds: number }).seconds ?? 0;
            const bTs = (b.startsAt as unknown as { seconds: number }).seconds ?? 0;
            return bTs - aTs;
          })
          .slice(0, 20);
        setTournaments(docs);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  return { tournaments, loading };
}
