"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/admin/tournaments", label: "Tournaments", icon: "🏆" },
  { href: "/admin/announcements", label: "Announcements", icon: "📢" },
  { href: "/admin/winners", label: "Winners", icon: "🥇" },
  { href: "/admin/mvp", label: "MVP Players", icon: "⭐" },
  { href: "/admin/sponsors", label: "Sponsors", icon: "🤝" },
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
    <aside className="w-56 shrink-0 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/banners/lnsbd.png" alt="nextstarBD logo" style={{ height: "38px", width: "auto", display: "block" }} />
          <span className="font-display text-xl tracking-wide">
            nextstar<span className="text-primary">BD</span>
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
  );
}
