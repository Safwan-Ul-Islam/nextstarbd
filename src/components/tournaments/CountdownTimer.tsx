"use client";

import { useState, useEffect } from "react";
import { useCountdown } from "@/lib/hooks/useCountdown";

function Segment({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-primary text-white font-display text-2xl sm:text-3xl w-12 sm:w-14 h-12 sm:h-14 rounded-xl flex items-center justify-center">
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer({
  targetDate,
  label = "Starts In",
}: {
  targetDate: Date;
  label?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const countdown = useCountdown(targetDate);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-20 bg-muted rounded-xl animate-pulse" />
    );
  }

  if (countdown.isExpired) {
    return (
      <div className="flex items-center gap-2 justify-center py-2">
        <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
        <span className="font-display text-xl text-primary tracking-wide">
          LIVE NOW
        </span>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 text-center">
        {label}
      </p>
      <div className="flex items-end gap-2 justify-center">
        {countdown.days > 0 && (
          <Segment value={countdown.days} label="Days" />
        )}
        <Segment value={countdown.hours} label="Hrs" />
        <Segment value={countdown.minutes} label="Min" />
        <Segment value={countdown.seconds} label="Sec" />
      </div>
    </div>
  );
}
