"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap,
  Mail,
  Phone,
  Lock,
  User,
  BookOpen,
  Building,
  Briefcase,
  CheckCircle,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    role: "student", // default role
    name: "",
    email: "",
    college: "",
    year: "",
    branch: "",
    phone: "",
    password: "",
    company: "",
    jobTitle: "",
    batch: "",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("student")) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, phone: form.phone }),
      });
      const data = res.ok ? await res.json() : {};
      if (res.ok) {
        setStep(2);
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
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
        alert(data.message || "OTP verification failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ name, type, placeholder, icon: Icon }) => (
    <div className="relative">
      <Icon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={form[name]}
        onChange={handleChange}
        required
        className="w-full p-3 pl-10 rounded-lg bg-transparent border border-[var(--border)] placeholder:text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-accent focus:outline-none"
      />
    </div>
  );

  return (
    <main className="min-h-screen pt-12 flex flex-col items-center justify-center px-4 bg-background text-foreground">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-6"
      >
        <GraduationCap className="w-16 h-16 text-accent" />
      </motion.div>

      {step === 1 && (
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={sendOtp}
          className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-card border border-border rounded-2xl shadow-md"
        >
          <h2 className="lg:col-span-2 text-2xl font-bold text-center">🎓 Registration</h2>

          {/* Role Selector */}
          <div className="lg:col-span-2 flex justify-center gap-4">
            {["student", "alumni"].map((role) => (
              <motion.button
                key={role}
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setForm({ ...form, role })}
                className={`px-6 py-2 rounded-full border transition ${
                  form.role === role
                    ? "bg-accent text-white border-accent"
                    : "bg-transparent border-border text-secondary hover:bg-accent/10"
                }`}
              >
                {role === "student" ? "🎓 Student" : "👔 Alumni"}
              </motion.button>
            ))}
          </div>

          {/* Left column – Common */}
          <div className="space-y-4">
            <InputField name="name" type="text" placeholder="Full Name" icon={User} />
            <InputField name="email" type="email" placeholder="Email Address" icon={Mail} />
            <InputField name="phone" type="tel" placeholder="Phone Number" icon={Phone} />
            <InputField name="password" type="password" placeholder="Password" icon={Lock} />
          </div>

          {/* Right column – Role-specific */}
          <div className="space-y-4">
            {form.role === "student" ? (
              <>
                <InputField name="college" type="text" placeholder="College Name" icon={Building} />
                <InputField name="year" type="text" placeholder="Year (e.g. 2nd Year)" icon={BookOpen} />
                <InputField name="branch" type="text" placeholder="Branch (e.g. CSE)" icon={BookOpen} />
              </>
            ) : (
              <>
                <InputField name="company" type="text" placeholder="Company Name" icon={Building} />
                <InputField name="jobTitle" type="text" placeholder="Job Title" icon={Briefcase} />
                <InputField name="batch" type="text" placeholder="Batch (e.g. 2018)" icon={GraduationCap} />
              </>
            )}
          </div>

          <div className="lg:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-accent text-white font-semibold hover:opacity-90 transition flex justify-center items-center"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        </motion.form>
      )}

      {step === 2 && (
        <motion.form
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onSubmit={verifyOtp}
          className="w-full max-w-md p-6 space-y-4 bg-card border border-border rounded-2xl shadow-md"
        >
          <h2 className="text-xl font-bold text-center">🔐 Verify OTP</h2>
          <p className="text-sm text-center text-gray-500">
            Enter the OTP sent to <b>{form.email || form.phone}</b>
          </p>
          <div className="relative">
            <CheckCircle className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full p-3 pl-10 rounded-lg bg-transparent border border-border placeholder:text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            {loading ? "Verifying..." : "Verify & Register"}
          </button>
        </motion.form>
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 flex flex-col items-center gap-2 text-sm"
      >
        <Link href="/login" className="text-secondary hover:underline active:text-accent">
          Already registered? Login here →
        </Link>
        <Link href="/reset-password" className="text-secondary hover:underline active:text-accent">
          Forgot password?
        </Link>
      </motion.div>
    </main>
  );
}
