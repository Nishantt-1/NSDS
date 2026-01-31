// src/app/components/AdminPage.jsx
import { useAuth } from "../help/AuthContext";

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">Admin Panel</h2>
            <p className="mt-1 text-sm text-slate-300">
              Only <span className="font-medium text-slate-100">ADMIN</span> users can access this area.
            </p>
          </div>
          <div className="text-right text-sm text-slate-300">
            <p>{user?.email}</p>
            <p className="text-slate-500">Role: {user?.role}</p>
          </div>
        </header>

        {/* Grid of admin modules */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Users */}
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
              Users
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              View and manage all registered users in the system.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <button
                type="button"
                className="w-full rounded-lg bg-indigo-600 px-3 py-2 font-medium hover:bg-indigo-500 transition-colors text-left"
              >
                View all users
              </button>
              <button
                type="button"
                className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 hover:bg-slate-900 transition-colors text-left"
              >
                Pending approvals
              </button>
            </div>
          </section>

          {/* Clubs */}
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
              Clubs
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Oversee all clubs, their leads, and membership requests.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <button
                type="button"
                className="w-full rounded-lg bg-indigo-600 px-3 py-2 font-medium hover:bg-indigo-500 transition-colors text-left"
              >
                View all clubs
              </button>
              <button
                type="button"
                className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 hover:bg-slate-900 transition-colors text-left"
              >
                Club creation requests
              </button>
            </div>
          </section>

          {/* System */}
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
              System settings
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              High-level configuration and monitoring for the platform.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <button
                type="button"
                className="w-full rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 hover:bg-slate-900 transition-colors text-left"
              >
                Platform configuration
              </button>
              <button
                type="button"
                className="w-full rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 hover:bg-slate-900 transition-colors text-left"
              >
                Audit & logs
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
