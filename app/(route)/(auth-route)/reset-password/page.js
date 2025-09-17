"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, KeyRound, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Request OTP
  const handleGetOTP = async () => {
    if (!email) return setMessage("❌ Please enter your registered email.");
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, type: "reset" }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setStep(2);
      setMessage("✅ OTP sent! Check your inbox.");
    } else {
      setMessage(data.message || "❌ Failed to send OTP.");
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword)
      return setMessage("❌ Please fill in all fields.");

    if (newPassword !== confirmPassword)
      return setMessage("❌ Passwords do not match.");

    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage("✅ Password reset successful! Redirecting...");
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setMessage(data.message || "❌ Error resetting password.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-background text-foreground">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mt-16 p-8 m-4 rounded-2xl shadow-xl border border-border bg-background"
      >
        {/* Title */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold mb-6 text-center text-foreground flex items-center justify-center gap-2"
        >
          <KeyRound className="w-7 h-7 text-accent" />
          Reset Password
        </motion.h1>

        {/* Step Indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span
              className={`px-3 py-1 rounded-full ${
                step === 1
                  ? "bg-accent text-background"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              Step 1
            </span>
            <span>→</span>
            <span
              className={`px-3 py-1 rounded-full ${
                step === 2
                  ? "bg-accent text-background"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              Step 2
            </span>
          </div>
        </div>

        {/* Message Banner */}
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.startsWith("✅") ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <KeyRound className="w-4 h-4" />
            )}
            {message}
          </motion.p>
        )}

        {/* Step 1: Email input */}
        {step === 1 && (
          <>
            <div className="relative mb-4">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
              />
            </div>
            <button
              onClick={handleGetOTP}
              disabled={loading}
              className="w-full p-3 bg-accent text-background font-semibold rounded-lg hover:opacity-90 transition"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" />
                  Sending OTP...
                </span>
              ) : (
                "Get OTP"
              )}
            </button>

            {/* Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 flex flex-col gap-2 text-center"
            >
              <div className="flex justify-between m-2">
                <Link
                  href="/alumni-login"
                  className="text-[var(--secondary)] hover:underline text-sm active:text-[var(--accent)]  border p-2 rounded-full border-border"
                >
                  Alumni Login
                </Link>
                <Link
                  href="/admin/login"
                  className="text-[var(--secondary)] hover:underline text-sm active:text-[var(--accent)] border p-2 rounded-full border-border"
                >
                  Admin Login
                </Link>
              </div>
              <Link
                href="/register"
                className="text-[var(--secondary)] hover:underline text-sm active:text-[var(--accent)]  border p-2 rounded-full border-border"
              >
                Don&apos;t have an account? Register here.
              </Link>
              <Link
                href="/reset-password"
                className="text-[var(--secondary)] hover:underline text-sm active:text-[var(--accent)]  border p-2 rounded-full border-border"
              >
                Forgot Password?
              </Link>
            </motion.div>
          </>
        )}

        {/* Step 2: OTP + password fields */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
            />
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full p-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" />
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </>
        )}
      </motion.div>
    </main>
  );
}
