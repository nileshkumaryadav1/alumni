"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Pencil,
  User,
  Menu,
  X,
  Home,
  Mail,
  Handshake,
} from "lucide-react";
import { useEffect } from "react";
import { FaMoneyBill } from "react-icons/fa";

const adminLinks = [
  { name: "Dashboard", href: "/admin", icon: User },
  { name: "New Event", href: "/admin/homepage", icon: Pencil },
  { name: "Manage Events", href: "/admin/events", icon: LayoutDashboard },
  { name: "Alumni/Students", href: "/admin/users", icon: Users },
  { name: "Mentorship", href: "/admin/mentorship", icon: Handshake },
  { name: "Fundraisers", href: "/admin/fundraisers", icon: FaMoneyBill },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Bulk Mail", href: "/admin/bulk-mail", icon: Mail },
];

export default function AdminSidebar({
  adminUser,
  handleLogout,
  closeSidebar,
  sidebarOpen,
}) {
  const pathname = usePathname();

  // ✅ Close sidebar when route changes (mobile)
  useEffect(() => {
    closeSidebar();
  }, [pathname]);

  return (
    <aside className="min-h-screen flex flex-col bg-[var(--card)]/60 backdrop-blur-xl border-r border-[var(--border)]">
      {/* Header / Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[var(--accent)]" />
          <h2 className="text-lg font-bold">Administration</h2>
        </div>

        {/* Mobile toggle button */}
        <button
          className="md:hidden p-1 rounded-lg hover:bg-[var(--accent)]/10 transition"
          onClick={closeSidebar}
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        {adminLinks.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                  : "text-[var(--foreground)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-2 mb-2">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[color:var(--foreground)] hover:text-white bg-[color:var(--background)] hover:bg-[var(--accent)] backdrop-blur-lg border border-[color:var(--border)] transition-all duration-200 active:scale-95 w-full sm:w-auto"
        >
          <Home className="w-4 h-4" />
          <span className="">Go to User Side</span>
        </Link>
      </div>

      {/* Footer / Profile */}
      <div className="px-4 py-4 border-t border-[var(--border)]">
        {adminUser && (
          <div className="mb-3">
            <p className="text-sm font-semibold">{adminUser.name}</p>
            <p className="text-xs text-[var(--accent)] capitalize">
              {adminUser.role}
            </p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-500 rounded-xl hover:bg-red-500/10 transition cursor-pointer border border-red-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
