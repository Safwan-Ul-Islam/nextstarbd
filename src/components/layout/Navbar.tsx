"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#upcoming-tournaments", label: "Tournaments" },
  { href: "/results", label: "Results" },
  { href: "/rules", label: "Rules" },
];

// locale prop kept so callers don't need to change
export function Navbar({ locale: _locale }: { locale: string }) {
  const { user, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      {/* Bangladesh flag stripe */}
      <div className="h-1 bg-gradient-to-r from-secondary via-primary to-secondary" />

      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-border">
        <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 sm:h-16 gap-1 sm:gap-4">

            {/* Logo — small icon + name on mobile, full size on desktop */}
            <Link href="/" className="flex items-center shrink-0 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/banners/lnsbd.png"
                alt="NexStarBD"
                className="w-auto"
                style={{
                  height: "clamp(38px, 6vw, 68px)",
                  display: "block",
                  transform: "translateY(-3px) translateX(3px)",
                }}
              />
              <span className="font-brand font-bold text-xs sm:text-2xl text-foreground tracking-wide group-hover:text-primary transition-colors">
                NexStar<span className="text-primary">B</span><span className="text-green-700">D</span>
              </span>
            </Link>

            {/* Nav links — always visible */}
            <div className="flex items-center flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[12px] sm:text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Profile / Login */}
            <div className="shrink-0 relative" ref={profileRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setProfileOpen((v) => !v)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold hover:bg-primary-dark transition-colors shadow-sm"
                    aria-label="Profile"
                  >
                    {(user.displayName?.[0] ?? user.email?.[0] ?? "?").toUpperCase()}
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-11 w-56 bg-white border border-border rounded-2xl shadow-xl py-1.5 z-50">
                      {/* User info */}
                      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {(user.displayName?.[0] ?? user.email?.[0] ?? "?").toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          {user.displayName && (
                            <p className="text-sm font-semibold text-foreground truncate">{user.displayName}</p>
                          )}
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      {/* Sign out */}
                      <button
                        onClick={async () => { setProfileOpen(false); await signOut(); }}
                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors rounded-b-2xl"
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center bg-primary hover:bg-primary-dark text-white font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm transition-colors"
                >
                  Login
                </Link>
              )}
            </div>

          </div>
        </nav>
      </header>
    </>
  );
}
