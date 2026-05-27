"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/admin/tournaments", label: "Tournaments", short: "Tourn.", icon: "🏆" },
  { href: "/admin/announcements", label: "Announcements", short: "Announce", icon: "📢" },
  { href: "/admin/winners", label: "Winners", short: "Winners", icon: "🥇" },
  { href: "/admin/mvp", label: "MVP Players", short: "MVP", icon: "⭐" },
  { href: "/admin/sponsors", label: "Sponsors", short: "Sponsors", icon: "🤝" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
  };

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <aside className="hidden sm:flex w-56 shrink-0 bg-gray-900 text-white min-h-screen flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/banners/lnsbd.png" alt="nextstarBD logo" style={{ height: "68px", width: "auto", display: "block", transform: "translateY(-6px) translateX(6px)" }} />
            <span className="font-brand font-bold text-xl tracking-wide">
              NextStar<span className="text-primary">B</span><span className="text-green-700">D</span>
            </span>
          </Link>
          <p className="text-xs text-gray-500 mt-1 pl-9">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-gray-800">
          {user && (
            <p className="text-xs text-gray-500 px-3 mb-2 truncate">{user.email}</p>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors w-full"
          >
            <span>🚪</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile bottom tab bar ────────────────────────────── */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 flex items-stretch safe-area-inset-bottom">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors ${
                active ? "text-white bg-gray-800" : "text-gray-500"
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span className="text-[9px] font-semibold leading-none mt-0.5">{item.short}</span>
            </Link>
          );
        })}
        <button
          onClick={handleSignOut}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-gray-500 transition-colors"
        >
          <span className="text-base leading-none">🚪</span>
          <span className="text-[9px] font-semibold leading-none mt-0.5">Out</span>
        </button>
      </nav>
    </>
  );
}
