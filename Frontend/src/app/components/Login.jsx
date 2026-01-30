import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email: data.email, password: data.password },
        { withCredentials: true } // safe to keep on; cookie will be set after OTP verify [web:225]
      );

      // backend sends: { step: "OTP_REQUIRED", userId, message }
      // if (res.data?.step === "OTP_REQUIRED") {
      //   navigate("/otp/verify", {
      //     state: { userId: res.data.userId, email: data.email },
      //   }); // pass state to next route [web:338]
      //   return;
      // }

      // In case you later allow normal login too:
      navigate("/profile");
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      setError("root", { type: "server", message: msg });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-slate-300">
          Step 1: enter email + password. We’ll send you an OTP.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
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
              autoComplete="current-password"
              className={[
                "mt-1 w-full rounded-lg border bg-slate-950/40 px-3 py-2 text-slate-100 outline-none",
                "focus:ring-2 focus:ring-indigo-500/60",
                errors.password ? "border-red-500" : "border-slate-800",
              ].join(" ")}
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
            )}
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
            {isSubmitting ? "Sending OTP..." : "Continue"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-300">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
