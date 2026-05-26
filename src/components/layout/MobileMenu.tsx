"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const t = useTranslations("nav");
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: "/", label: t("home") },
    { href: "/#upcoming-tournaments", label: t("tournaments") },
    { href: "/hall-of-fame", label: t("hallOfFame") },
    { href: "/rules", label: t("rules") },
    { href: "/#community", label: t("community") },
  ];

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/banners/lnsbd.png" alt="nextstarBD logo" style={{ height: "38px", width: "auto", display: "block" }} />
            <span className="font-display text-2xl text-foreground tracking-wide">nextstar<span className="text-primary">BD</span></span>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-2xl"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block px-4 py-3 rounded-xl text-base font-semibold text-foreground hover:bg-primary-light hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="px-6 py-5 border-t border-border space-y-3">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-1">
                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                  {(user.displayName?.[0] ?? user.email?.[0] ?? "?").toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{user.displayName ?? user.email}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={async () => { await signOut(); onClose(); }}
                className="block w-full text-center border border-border text-foreground font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="block w-full text-center bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
