import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileCard from "./ProfileCard";

function fmt(dt) {
  if (!dt) return "-";
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return "-";
  }
}

function Section({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
      <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function EmptyState({ text }) {
  return <p className="text-sm text-slate-300">{text}</p>;
}

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [profile, setProfile] = useState(null);

  // Expected backend shape (example):
  // {
  //   user: { name, email, role, department, year, clubs: [{_id,name,category}] },
  //   participant: { clubs: [...], events: [{ _id, title, startTime, endTime, status }] },
  //   organizer: { clubs: [...], events: [...] },
  //   admin: { ongoingEvents: [...] }
  // }

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErrMsg("");

        const res = await axios.get("http://localhost:3000/api/users/me", {
          withCredentials: true,
        });

        if (mounted) setProfile(res.data);
      } catch (e) {
        if (mounted) setErrMsg(e?.response?.data?.message || "Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
        <p className="text-slate-300">Loading profile...</p>
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-red-300">{errMsg}</p>
        </div>
      </div>
    );
  }

  const user = profile?.user;
  const role = user?.role;

  const clubs =
    role === "PARTICIPANT"
      ? profile?.participant?.clubs ?? user?.clubs ?? []
      : role === "ORGANIZER"
      ? profile?.organizer?.clubs ?? user?.clubs ?? []
      : user?.clubs ?? [];

  const participantEvents = profile?.participant?.events ?? [];
  const organizerEvents = profile?.organizer?.events ?? [];
  const ongoingEvents = profile?.admin?.ongoingEvents ?? [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <ProfileCard user={{ ...user, clubs }} />

        {/* PARTICIPANT */}
        {role === "PARTICIPANT" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section title="My clubs">
              {clubs.length === 0 ? (
                <EmptyState text="You haven’t joined any clubs yet." />
              ) : (
                <div className="space-y-2">
                  {clubs.map((c) => (
                    <div
                      key={c._id} // keys are required when mapping lists in React [web:589]
                      className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2"
                    >
                      <p className="text-slate-100 font-medium">{c.name}</p>
                      <p className="text-xs text-slate-400">{c.category || "Club"}</p>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section title="Events I participated in">
              {participantEvents.length === 0 ? (
                <EmptyState text="No participation records yet." />
              ) : (
                <div className="space-y-2">
                  {participantEvents.map((ev) => (
                    <div
                      key={ev._id} // keys are required when mapping lists in React [web:589]
                      className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-slate-100 font-medium truncate">{ev.title}</p>
                        <span className="text-xs rounded-full border border-slate-700 px-2 py-0.5 text-slate-300">
                          {ev.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        {fmt(ev.startTime)} → {fmt(ev.endTime)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>
        )}

        {/* ORGANIZER */}
        {role === "ORGANIZER" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section title="My clubs">
              {clubs.length === 0 ? (
                <EmptyState text="No clubs assigned yet." />
              ) : (
                <div className="space-y-2">
                  {clubs.map((c) => (
                    <div
                      key={c._id} // keys are required when mapping lists in React [web:589]
                      className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2"
                    >
                      <p className="text-slate-100 font-medium">{c.name}</p>
                      <p className="text-xs text-slate-400">{c.category || "Club"}</p>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section title="Events I’m organizing">
              {organizerEvents.length === 0 ? (
                <EmptyState text="No events created yet." />
              ) : (
                <div className="space-y-2">
                  {organizerEvents.map((ev) => (
                    <div
                      key={ev._id} // keys are required when mapping lists in React [web:589]
                      className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-slate-100 font-medium truncate">{ev.title}</p>
                        <span className="text-xs rounded-full border border-slate-700 px-2 py-0.5 text-slate-300">
                          {ev.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        {fmt(ev.startTime)} → {fmt(ev.endTime)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>
        )}

        {/* ADMIN */}
        {role === "ADMIN" && (
          <Section title="Ongoing events">
            {ongoingEvents.length === 0 ? (
              <EmptyState text="No ongoing events right now." />
            ) : (
              <div className="space-y-2">
                {ongoingEvents.map((ev) => (
                  <div
                    key={ev._id} // keys are required when mapping lists in React [web:589]
                    className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-slate-100 font-medium truncate">{ev.title}</p>
                      <span className="text-xs rounded-full border border-slate-700 px-2 py-0.5 text-slate-300">
                        {ev.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {fmt(ev.startTime)} → {fmt(ev.endTime)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}
      </div>
    </div>
  );
}
