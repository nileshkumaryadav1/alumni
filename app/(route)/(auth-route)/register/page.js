"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Key, KeyIcon, Lock, SquareRoundCorner, SquareRoundCornerIcon } from "lucide-react";
import { FaRegistered } from "react-icons/fa";
import { MdSystemSecurityUpdateWarning } from "react-icons/md";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    role: "student",
    name: "",
    email: "",
    phone: "",
    password: "",
    college: "",
    year: "",
    branch: "",
    batch: "",
    jobTitle: "",
    company: "",
    linkedin: "",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("student")) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!form.email && !form.phone) return alert("Enter email or phone.");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, phone: form.phone }),
      });
      const data = await res.json();
      if (res.ok) setStep(2);
      else alert(data.message || "Failed to send OTP.");
    } catch (err) {
      console.error(err);
      alert("Something went wrong sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return alert("Enter OTP.");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("student", JSON.stringify(data.student));
        router.push("/dashboard");
      } else {
        alert(data.message || "OTP verification failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 border border-[color:var(--border)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent placeholder:text-muted-foreground bg-background text-foreground";

  const buttonClasses =
    "w-full py-3 bg-accent text-background font-semibold rounded-lg shadow-md hover:bg-accent/90 transition";

  const selectClasses =
    "w-full px-4 py-3 border border-[color:var(--border)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-background text-foreground";

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-accent">
         <KeyIcon className="w-6 h-6 inline-block" /> Register 
        </h2>

        {/* Step 1: Form */}
        {step === 1 && (
          <form
            onSubmit={sendOtp}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-8 bg-card rounded-3xl shadow-lg border border-[color:var(--border)]"
          >
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className={inputClasses}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={inputClasses}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className={inputClasses}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className={inputClasses}
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className={selectClasses}
            >
              <option value="student">Student</option>
              <option value="alumni">Alumni</option>
            </select>

            {form.role === "student" && (
              <>
                <input
                  type="text"
                  name="college"
                  placeholder="College"
                  value={form.college}
                  onChange={handleChange}
                  className={inputClasses}
                />
                <input
                  type="text"
                  name="year"
                  placeholder="Year"
                  value={form.year}
                  onChange={handleChange}
                  className={inputClasses}
                />
                <input
                  type="text"
                  name="branch"
                  placeholder="Branch"
                  value={form.branch}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </>
            )}

            {form.role === "alumni" && (
              <>
                <input
                  type="text"
                  name="batch"
                  placeholder="Batch"
                  value={form.batch}
                  onChange={handleChange}
                  className={inputClasses}
                />
                <input
                  type="text"
                  name="jobTitle"
                  placeholder="Job Title"
                  value={form.jobTitle}
                  onChange={handleChange}
                  className={inputClasses}
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company"
                  value={form.company}
                  onChange={handleChange}
                  className={inputClasses}
                />
                <input
                  type="text"
                  name="linkedin"
                  placeholder="LinkedIn URL"
                  value={form.linkedin}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </>
            )}

            <button type="submit" disabled={loading} className={buttonClasses}>
              {loading ? "⏳ Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form
            onSubmit={verifyOtp}
            className="flex flex-col gap-4 w-full p-6 bg-card rounded-3xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-center mb-4 text-accent">
              Verify OTP
            </h2>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className={inputClasses}
            />
            <button type="submit" disabled={loading} className={buttonClasses}>
              {loading ? "⏳ Verifying..." : "Verify & Register"}
            </button>
          </form>
        )}

        <p className="text-center mt-6 text-sm text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Login
          </Link>
        </p>

        <p className="text-center mt-2 text-sm text-secondary">
          Forgot your password?{" "}
          <Link href="/reset-password" className="text-accent hover:underline">
            Reset here{" "}
          </Link>
        </p>
      </div>
    </section>
  );
}
