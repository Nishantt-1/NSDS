import React from "react";

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

export default function ProfileCard({
  user = {
    name: "Anonymous",
    email: "unknown@example.com",
    role: "PARTICIPANT",
    department: "",
    year: "",
  },
  onEdit,
}) {
  const badge =
    user.role === "ADMIN"
      ? "bg-red-500/10 text-red-300 border-red-500/30"
      : user.role === "ORGANIZER"
      ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
      : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-800 flex items-center justify-center text-slate-100 font-semibold">
          {initials(user.name)}
        </div>

        {/* Main */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-100 truncate">
              {user.name}
            </h2>

            <span className={`text-xs border px-2 py-0.5 rounded-full ${badge}`}>
              {user.role}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-300 truncate">{user.email}</p>

          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2">
              <p className="text-xs text-slate-400">Department</p>
              <p className="text-slate-200">{user.department || "-"}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2">
              <p className="text-xs text-slate-400">Year</p>
              <p className="text-slate-200">{user.year || "-"}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-200 hover:border-indigo-500/40 hover:text-indigo-200"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
