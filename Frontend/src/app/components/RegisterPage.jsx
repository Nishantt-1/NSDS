import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "PARTICIPANT",
      department: "",
      year: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          department: data.department || undefined,
          year: data.year ? Number(data.year) : undefined,
        },
        { withCredentials: true } // accept cookie from backend [web:225]
      );

      navigate("/"); // go to login
    } catch (err) {
      console.log("ERR_MESSAGE:", err.message);
  console.log("STATUS:", err?.response?.status);
  console.log("DATA:", err?.response?.data);
  console.log("URL:", err?.config?.url);
  setError("root", { type: "server", message: err?.response?.data?.message || err.message });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="mt-1 text-sm text-slate-300">Register with email and password.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-200">
              Name
            </label>
            <input
              id="name"
              autoComplete="name"
              className={[
                "mt-1 w-full rounded-lg border bg-slate-950/40 px-3 py-2 text-slate-100 outline-none",
                "focus:ring-2 focus:ring-indigo-500/60",
                errors.name ? "border-red-500" : "border-slate-800",
              ].join(" ")}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={[
                "mt-1 w-full rounded-lg border bg-slate-950/40 px-3 py-2 text-slate-100 outline-none",
                "focus:ring-2 focus:ring-indigo-500/60",
                errors.email ? "border-red-500" : "border-slate-800",
              ].join(" ")}
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className={[
                "mt-1 w-full rounded-lg border bg-slate-950/40 px-3 py-2 text-slate-100 outline-none",
                "focus:ring-2 focus:ring-indigo-500/60",
                errors.password ? "border-red-500" : "border-slate-800",
              ].join(" ")}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-200">
                Role
              </label>
              <select
                id="role"
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/60"
                {...register("role")}
              >
                <option value="PARTICIPANT">PARTICIPANT</option>
                <option value="ORGANIZER">ORGANIZER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-slate-200">
                Year
              </label>
              <input
                id="year"
                type="number"
                placeholder="2"
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/60"
                {...register("year")}
              />
            </div>
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-slate-200">
              Department
            </label>
            <input
              id="department"
              placeholder="CSE"
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/60"
              {...register("department")}
            />
          </div>

          {errors.root && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {errors.root.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {isSubmitting ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-300">
          Already have an account?{" "}
          <Link to="/" className="text-indigo-400 hover:text-indigo-300 underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
