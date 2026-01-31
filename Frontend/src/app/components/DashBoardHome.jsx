// src/pages/DashboardHome.jsx
import { useAuth } from "../help/AuthContext";

export default function DashboardHome() {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 px-4 py-6">
      {/* Top section */}
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">
              Welcome, <span className="text-indigo-400">{user?.name}</span>
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              You are logged in as{" "}
              <span className="font-medium text-slate-100">{user?.role}</span>. 
              Use the shortcuts below to jump into your common actions.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 transition-colors"
            >
              Go to Events
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800 transition-colors"
            >
              View Profile
            </button>
          </div>
        </header>

        {/* Grid of cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Common card */}
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
              Quick stats
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Overview of your activity on the platform.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-3">
                <p className="text-xs text-slate-400">Events</p>
                <p className="mt-1 text-lg font-semibold">—</p>
              </div>
              <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-3">
                <p className="text-xs text-slate-400">Clubs</p>
                <p className="mt-1 text-lg font-semibold">—</p>
              </div>
              <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-3">
                <p className="text-xs text-slate-400">Notifications</p>
                <p className="mt-1 text-lg font-semibold">—</p>
              </div>
            </div>
          </section>

          {/* Participant view */}
          {user?.role === "PARTICIPANT" && (
            <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
                Participant shortcuts
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Discover events and manage your club requests.
              </p>
              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500 transition-colors text-left"
                >
                  Browse events
                </button>
                <button
                  type="button"
                  className="w-full rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 text-sm hover:bg-slate-900 transition-colors text-left"
                >
                  My registrations
                </button>
                <button
                  type="button"
                  className="w-full rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 text-sm hover:bg-slate-900 transition-colors text-left"
                >
                  Request to join a club
                </button>
              </div>
            </section>
          )}

          {/* Organizer view */}
          {user?.role === "ORGANIZER" && (
            <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
                Organizer panel
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Create and manage events, and handle club join requests.
              </p>
              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500 transition-colors text-left"
                >
                  Create new event
                </button>
                <button
                  type="button"
                  className="w-full rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 text-sm hover:bg-slate-900 transition-colors text-left"
                >
                  Manage my events
                </button>
                <button
                  type="button"
                  className="w-full rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 text-sm hover:bg-slate-900 transition-colors text-left"
                >
                  Club join requests
                </button>
              </div>
            </section>
          )}

          {/* Admin view */}
          {user?.role === "ADMIN" && (
            <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
                Admin tools
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                High-level controls for users, clubs and events.
              </p>
              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500 transition-colors text-left"
                >
                  User management
                </button>
                <button
                  type="button"
                  className="w-full rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 text-sm hover:bg-slate-900 transition-colors text-left"
                >
                  Clubs & approvals
                </button>
                <button
                  type="button"
                  className="w-full rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 text-sm hover:bg-slate-900 transition-colors text-left"
                >
                  System overview
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
