"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("student")) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("student", JSON.stringify(data.student));
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="md:min-h-screen py-10 flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-6 p-8 rounded-2xl shadow-xl border border-[var(--border)] bg-[var(--card)] w-full max-w-md"
      >
        <motion.h2
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center mb-2 tracking-tight"
        >
          Student Login
          <div className="flex justify-center gap-2 m-2">
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
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <Mail className="absolute left-3 top-3.5 text-[var(--secondary)] h-5 w-5" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full pl-10 p-3 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <Lock className="absolute left-3 top-3.5 text-[var(--secondary)] h-5 w-5" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full pl-10 p-3 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            required
          />
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm text-center"
          >
            {error}
          </motion.p>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition flex justify-center items-center cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </motion.button>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 flex flex-col gap-2 text-center"
        >
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
      </motion.form>
    </main>
  );
}
