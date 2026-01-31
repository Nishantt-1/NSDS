// src/layouts/DashboardLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../help/AuthContext";

export default function DashboardLayout() {
  const { role, user } = useAuth();

  const links = [
    { to: "/dashboard", label: "Home", roles: ["ADMIN", "ORGANIZER", "PARTICIPANT"] },
    { to: "/dashboard/events", label: "Events", roles: ["ADMIN", "ORGANIZER", "PARTICIPANT"] },
    { to: "/dashboard/manage", label: "Manage", roles: ["ADMIN", "ORGANIZER"] },
    { to: "/dashboard/admin", label: "Admin", roles: ["ADMIN"] },
  ].filter((l) => l.roles.includes(role));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold">
              NS
            </div>
            <span className="text-lg font-semibold tracking-tight">
              NSDS Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline text-slate-300">
              {user?.name} <span className="text-slate-500">({role})</span>
            </span>
            <button
              type="button"
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium hover:bg-slate-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content area with sidebar + main */}
      <div className="mx-auto flex max-w-6xl px-4 pt-4 pb-8 gap-4">
        {/* Sidebar nav */}
        <nav className="w-48 shrink-0 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-sm">
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Navigation
          </p>
          <div className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  [
                    "block rounded-lg px-3 py-2 transition-colors",
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-slate-200 hover:bg-slate-800 hover:text-white",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Main outlet */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
