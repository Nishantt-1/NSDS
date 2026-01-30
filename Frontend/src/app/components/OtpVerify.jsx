import React, { useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function OtpVerify() {
  const navigate = useNavigate();
  const location = useLocation(); // access navigation state [web:339]
  const userId = location.state?.userId;
  const email = location.state?.email;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { otp: "" },
  });

  // If someone refreshes or directly opens /otp/verify, state might be missing.
  useEffect(() => {
    if (!userId) navigate("/"); // back to login
  }, [userId, navigate]);

  const onSubmit = async (data) => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/login/verify-otp",
        { userId, otp: data.otp },
        { withCredentials: true } // accept cookie set by backend [web:225]
      );

      navigate("/Profile"); // change to dashboard/protected route later
    } catch (err) {
      const msg = err?.response?.data?.message || "OTP verification failed";
      setError("otp", { type: "server", message: msg });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
        <h1 className="text-2xl font-semibold">Verify OTP</h1>

        <p className="mt-1 text-sm text-slate-300">
          Step 2: Enter the 6-digit OTP sent to{" "}
          <span className="text-slate-200">{email || "your email"}</span>.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-slate-200">
              OTP
            </label>
            <input
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              className={[
                "mt-1 w-full rounded-lg border bg-slate-950/40 px-3 py-2 text-slate-100 outline-none tracking-widest",
                "focus:ring-2 focus:ring-indigo-500/60",
                errors.otp ? "border-red-500" : "border-slate-800",
              ].join(" ")}
              {...register("otp", {
                required: "OTP is required",
                pattern: { value: /^\d{6}$/, message: "Enter a valid 6-digit OTP" },
              })}
            />
            {errors.otp && <p className="mt-1 text-sm text-red-400">{errors.otp.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {isSubmitting ? "Verifying..." : "Verify & sign in"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
          <Link to="/" className="text-indigo-400 hover:text-indigo-300 underline">
            Back to login
          </Link>

          {/* Optional: you can add a resend OTP endpoint later */}
          {/* <button type="button" className="text-indigo-400 hover:text-indigo-300 underline">
            Resend OTP
          </button> */}
        </div>
      </div>
    </div>
  );
}
