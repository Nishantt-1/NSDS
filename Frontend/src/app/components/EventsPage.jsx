// src/app/components/EventsPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../help/AuthContext";

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
  (async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/services/events", {
        withCredentials: true,
      });
      
      // ✅ Safe array extraction - works with API objects
      const eventsArray = Array.isArray(data) 
        ? data 
        : data.events || data.data || data.results || [];
        
      setEvents(eventsArray);
    } catch (e) {
      // fallback demo data (already an array ✅)
      setEvents([
        { _id: "1", title: "Tech Hackathon 2026", status: "UPCOMING", startTime: "2026-02-15", creator: { name: "Tech Club" }, location: "Main Auditorium" },
        { _id: "2", title: "Cultural Night", status: "ONGOING", startTime: "2026-01-31", creator: { name: "Cultural Club" }, location: "Main Hall" },
      ]);
    } finally {
      setLoading(false);
    }
  })();
}, []);


  const filteredEvents = events.filter((event) => 
    statusFilter === "all" || event.status === statusFilter
  );

  const getStatusColor = (status) => {
    const colors = {
      UPCOMING: "bg-emerald-600/80 border-emerald-500/50 text-emerald-100",
      ONGOING: "bg-orange-500/80 border-orange-400/50 text-orange-100",
      COMPLETED: "bg-slate-600/80 border-slate-500/50 text-slate-100",
    };
    return colors[status] || "bg-slate-600/80 border-slate-500/50 text-slate-100";
  };

  const getStatusLabel = (status) => {
    const labels = {
      UPCOMING: "Upcoming",
      ONGOING: "Live Now",
      COMPLETED: "Completed",
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <p className="mt-2 text-sm text-slate-400">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">
              Events <span className="text-slate-400">({filteredEvents.length})</span>
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Browse upcoming, ongoing, and past events across all clubs.
            </p>
          </div>

          {user?.role === "ORGANIZER" && (
            <button
              type="button"
              className="ml-auto rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white hover:bg-indigo-500 transition-all shadow-lg"
            >
              Create Event
            </button>
          )}
        </header>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <button
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
            onClick={() => setStatusFilter("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === "UPCOMING"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-emerald-300 hover:bg-emerald-950/50 hover:text-emerald-200"
            }`}
            onClick={() => setStatusFilter("UPCOMING")}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === "ONGOING"
                ? "bg-orange-500 text-white shadow-md"
                : "text-orange-300 hover:bg-orange-950/50 hover:text-orange-200"
            }`}
            onClick={() => setStatusFilter("ONGOING")}
          >
            Live Now
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === "COMPLETED"
                ? "bg-slate-600 text-white shadow-md"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
            onClick={() => setStatusFilter("COMPLETED")}
          >
            Completed
          </button>
        </div>

        {/* Events list */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-900/60 border-2 border-dashed border-slate-700 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-2">
              No events found
            </h3>
            <p className="text-slate-400">
              {statusFilter === "all" ? "No events available yet." : `No ${getStatusLabel(statusFilter)} events.`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <article
                key={event._id}
                className="group rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                    {getStatusLabel(event.status)}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse hidden md:block" />
                </div>

                <h3 className="text-lg font-semibold text-slate-100 mb-2 leading-tight group-hover:text-white transition-colors">
                  {event.title}
                </h3>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center text-slate-300">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{event.startTime}</span>
                  </div>
                  <div className="flex items-center text-slate-300">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center text-xs text-slate-400 mb-4">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6.5-2.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0zM12.5 10a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" />
                  </svg>
                  Organized by {event.creator?.name || "Club"}
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-all shadow-sm"
                  >
                    {user?.role === "PARTICIPANT" ? "Register" : "View"}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-950/60 text-sm hover:bg-slate-900 transition-colors"
                  >
                    Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
