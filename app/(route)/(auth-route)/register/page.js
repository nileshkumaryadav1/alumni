"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyIcon, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";

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
    if (!form.email && !form.phone)
      return toast.error("Enter email or phone before sending OTP.");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, phone: form.phone }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2);
        toast.success("OTP sent successfully! 📩");
      } else toast.error(data.message || "Failed to send OTP.");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return toast.error("Please enter your OTP.");

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
        toast.success("Registration successful! 🎉");
        router.push("/dashboard");
      } else {
        toast.error(data.message || "OTP verification failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 border border-[color:var(--border)] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/70 focus:border-accent bg-background text-foreground placeholder:text-muted-foreground transition";

  const buttonClasses =
    "w-full py-3 bg-accent text-background font-semibold rounded-xl shadow-md hover:bg-accent/90 transition active:scale-[0.98] disabled:opacity-60";

  const selectClasses =
    "w-full px-4 py-3 border border-[color:var(--border)] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/70 focus:border-accent bg-background text-foreground";

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-muted px-4 py-10">
      <div className="w-full max-w-3xl bg-card border border-border shadow-lg rounded-3xl p-8 md:p-10">
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <KeyIcon className="w-8 h-8" /> Create Account
        </h2>

        {/* Step 1 */}
        {step === 1 && (
          <form
            onSubmit={sendOtp}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
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
              <option value="student">🎓 Student</option>
              <option value="alumni">💼 Alumni</option>
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

            <div className="col-span-1 sm:col-span-2">
              <button type="submit" disabled={loading} className={buttonClasses}>
                {loading ? "⏳ Sending OTP..." : "Send OTP"}
              </button>
            </div>
          </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <form
            onSubmit={verifyOtp}
            className="flex flex-col gap-5 max-w-md mx-auto text-center"
          >
            <h3 className="text-2xl font-semibold text-accent mb-2">
              Verify OTP
            </h3>
            <p className="text-muted-foreground text-sm">
              Enter the 6-digit code sent to your email or phone.
            </p>
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
            <button
              type="button"
              onClick={sendOtp}
              disabled={loading}
              className="py-2 text-accent font-medium hover:underline"
            >
              {loading ? "⏳ Processing..." : "Resend OTP"}
            </button>
          </form>
        )}

        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Login
            </Link>
          </p>
          <p className="text-sm text-secondary">
            Forgot your password?{" "}
            <Link href="/reset-password" className="text-accent hover:underline">
              Reset here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
