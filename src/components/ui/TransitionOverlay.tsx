"use client";

import { useAuth } from "@/context/AuthContext";

export function TransitionOverlay() {
  const { transitioning, transitionMessage } = useAuth();
  if (!transitioning) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      <div className="flex items-center gap-0 mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/banners/lnsbd.png" alt="NexStarBD" style={{ height: "72px", width: "auto", transform: "translateY(-6px) translateX(6px)" }} />
        <span className="font-brand font-bold text-3xl tracking-wide">
          NexStar<span className="text-primary">B</span><span className="text-secondary">D</span>
        </span>
      </div>
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
      {transitionMessage && (
        <p className="text-muted-foreground text-sm font-medium">{transitionMessage}</p>
      )}
    </div>
  );
}
