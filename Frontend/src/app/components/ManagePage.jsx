// src/app/components/ManagePage.jsx
import { useAuth } from "../help/AuthContext";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";

export default function ManagePage() {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { 
      title: "", 
      description: "", 
      status: "DRAFT", 
      location: "", 
      startTime: "", 
      endTime: "", 
      budget: "",
      collaboratingClubs: "",
      resources: "" 
    },
  });
 
  const handleAddEvent = async (data) => {
    try {
      setSubmitting(true);
      const res = await axios.post(
        "http://localhost:3000/api/service/addEve",
        { ...data },
        { withCredentials: true }
      );
      
      // Success - close modal and reset form
      setShowCreateModal(false);
      reset();
      alert("Event created successfully!");
    } catch (err) {
      // Handle API/server errors
      const msg = err?.response?.data?.message || "Failed to create event";
      setError("root", { type: "server", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">Manage</h2>
            <p className="mt-1 text-sm text-slate-300">
              Control panel for <span className="font-medium text-slate-100">{user?.role}</span> users.
            </p>
          </div>
          <div className="text-right text-sm text-slate-300">
            <p>{user?.name}</p>
            <p className="text-slate-500">Role: {user?.role}</p>
          </div>
        </header>

        {/* Management cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Create Event - Now Opens Modal */}
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-600/80 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-slate-100">Create Event</h3>
                <p className="mt-1 text-sm text-slate-300">
                  Start a new event for your club or organization.
                </p>
                <button
                  type="button"
                  className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                  onClick={() => setShowCreateModal(true)}
                >
                  New Event
                </button>
              </div>
            </div>
          </section>

          {/* Keep other cards the same */}
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-600/80 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-slate-100">My Events</h3>
                <p className="mt-1 text-sm text-slate-300">View events you created and track registrations.</p>
                <button className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500 transition-all duration-200 transform hover:scale-[1.02] shadow-lg">
                  View Events
                </button>
              </div>
            </div>
          </section>

          {/* ... rest of your cards stay the same ... */}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-slate-100">Create New Event</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(handleAddEvent)} className="p-6 space-y-6">
              {errors.root && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {errors.root.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Event Title *</label>
                  <input
                    {...register("title", { required: "Event title is required" })}
                    className={[
                      "w-full rounded-lg border bg-slate-950/60 px-4 py-3 text-slate-100 focus:ring-2 focus:ring-indigo-500/60 outline-none transition-all",
                      errors.title ? "border-red-500" : "border-slate-800 hover:border-slate-700"
                    ].join(" ")}
                    placeholder="e.g. Tech Hackathon 2026"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Location *</label>
                  <input
                    {...register("location", { required: "Location is required" })}
                    className={[
                      "w-full rounded-lg border bg-slate-950/60 px-4 py-3 text-slate-100 focus:ring-2 focus:ring-indigo-500/60 outline-none transition-all",
                      errors.location ? "border-red-500" : "border-slate-800 hover:border-slate-700"
                    ].join(" ")}
                    placeholder="e.g. Main Auditorium"
                  />
                  {errors.location && <p className="mt-1 text-sm text-red-400">{errors.location.message}</p>}
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    {...register("startTime", { required: "Start time is required" })}
                    className={[
                      "w-full rounded-lg border bg-slate-950/60 px-4 py-3 text-slate-100 focus:ring-2 focus:ring-indigo-500/60 outline-none transition-all",
                      errors.startTime ? "border-red-500" : "border-slate-800 hover:border-slate-700"
                    ].join(" ")}
                  />
                  {errors.startTime && <p className="mt-1 text-sm text-red-400">{errors.startTime.message}</p>}
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">End Date & Time *</label>
                  <input
                    type="datetime-local"
                    {...register("endTime", { required: "End time is required" })}
                    className={[
                      "w-full rounded-lg border bg-slate-950/60 px-4 py-3 text-slate-100 focus:ring-2 focus:ring-indigo-500/60 outline-none transition-all",
                      errors.endTime ? "border-red-500" : "border-slate-800 hover:border-slate-700"
                    ].join(" ")}
                  />
                  {errors.endTime && <p className="mt-1 text-sm text-red-400">{errors.endTime.message}</p>}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Description</label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className={[
                    "w-full rounded-lg border bg-slate-950/60 px-4 py-3 text-slate-100 focus:ring-2 focus:ring-indigo-500/60 outline-none transition-all resize-vertical",
                    errors.description ? "border-red-500" : "border-slate-800 hover:border-slate-700"
                  ].join(" ")}
                  placeholder="Describe your event..."
                />
              </div>

              {/* Other fields (budget, clubs, resources) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Budget</label>
                  <input
                    type="number"
                    {...register("budget")}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3 text-slate-100 focus:ring-2 focus:ring-indigo-500/60 outline-none"
                    placeholder="₹5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Collaborating Clubs</label>
                  <input
                    {...register("collaboratingClubs")}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3 text-slate-100 focus:ring-2 focus:ring-indigo-500/60 outline-none"
                    placeholder="Club1, Club2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Resources Needed</label>
                  <input
                    {...register("resources")}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3 text-slate-100 focus:ring-2 focus:ring-indigo-500/60 outline-none"
                    placeholder="Projector, Mic"
                  />
                </div>
              </div>

              {/* Status */}
             
              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    "Create Event"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    reset();
                  }}
                  className="px-6 py-3 border border-slate-700 hover:bg-slate-800 text-slate-200 font-medium rounded-xl transition-all"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
