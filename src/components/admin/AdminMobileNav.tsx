"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { navItems } from "./AdminSidebar";

export function AdminMobileNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
  };

  return (
    <div className="sm:hidden bg-gray-900 border-b border-gray-800">
      {/* Top row — brand + sign out */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/banners/lnsbd.png" alt="logo" style={{ height: "32px", width: "auto", display: "block" }} />
          <span className="font-brand font-bold text-sm text-white tracking-wide">
            NexStar<span className="text-primary">B</span><span className="text-green-500">D</span>
            <span className="text-gray-500 font-normal text-xs ml-1">Admin</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {user && (
            <span className="text-gray-400 text-xs truncate max-w-[110px]">{user.email}</span>
          )}
          <button
            onClick={handleSignOut}
            className="text-xs font-semibold text-gray-400 hover:text-white bg-gray-800 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            🚪 Out
          </button>
        </div>
      </div>

      {/* Scrollable section tabs */}
      <div className="flex overflow-x-auto scrollbar-none px-2 py-2 gap-1.5">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                active
                  ? "bg-primary text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              <span className="text-sm leading-none">{item.icon}</span>
              {item.short}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
