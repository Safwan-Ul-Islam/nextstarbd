interface SlotProgressBarProps {
  filled: number;
  max: number;
  waitlisted?: number;
}

export function SlotProgressBar({ filled, max, waitlisted = 0 }: SlotProgressBarProps) {
  const confirmedPct = Math.min((filled / max) * 100, 100);
  const isFull = filled >= max;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-muted-foreground">Slots</span>
        <span className="text-xs font-bold text-foreground">
          {filled}/{max}
          {waitlisted > 0 && <span className="text-amber-600 ml-1">+{waitlisted}</span>}
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isFull ? "bg-primary" : "bg-secondary"}`}
          style={{ width: `${confirmedPct}%` }}
        />
      </div>
    </div>
  );
}
