"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MobileMenu } from "./MobileMenu";
import { LanguageToggle } from "./LanguageToggle";
import { useAuth } from "@/context/AuthContext";

export function Navbar({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const links = [
    { href: "/#upcoming-tournaments", label: t("tournaments") },
    { href: "/hall-of-fame", label: t("hallOfFame") },
    { href: "/rules", label: t("rules") },
    { href: "/#community", label: t("community") },
  ];

  return (
    <>
      {/* Bangladesh flag stripe */}
      <div className="h-1 bg-gradient-to-r from-secondary via-primary to-secondary" />

      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/banners/lnsbd.png" alt="nextstarBD logo" style={{ height: "42px", width: "auto", display: "block" }} />
              <span className="font-display text-2xl text-foreground tracking-wide group-hover:text-primary transition-colors">
                nextstar<span className="text-primary">BD</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <LanguageToggle currentLocale={locale} />

              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {(user.displayName?.[0] ?? user.email?.[0] ?? "?").toUpperCase()}
                  </div>
                  <button
                    onClick={signOut}
                    className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
                >
                  Login
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Open menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
