"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  ArrowRight,
  Calendar,
  User,
  Briefcase,
  Network,
  Handshake,
} from "lucide-react";
import FloatingEventsPageButton from "@/components/custom/myself/FloatingEventsPageButton";
import StudentCard from "@/components/custom/myself/StudentCard";
import ConnectButton from "@/components/network/ConnectButton";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentData, setStudentData] = useState({});
  const [events, setEvents] = useState([]);

  // ✅ Check login status
  useEffect(() => {
    if (typeof window !== "undefined") {
      const student = localStorage.getItem("student");
      if (student) {
        setIsLoggedIn(true);
        setStudentData(JSON.parse(student));
      }
    }
  }, []);

  // ✅ Fetch homepage events
  useEffect(() => {
    fetch("/api/homepage")
      .then((res) => res.json())
      .then((data) => setEvents(data.events || []))
      .catch(() => setEvents([]));
  }, []);

  const alumnis = [
    {
      name: "Anjali Gupta",
      batch: "2018",
      company: "Google",
      jobTitle: "Software Engineer",
    },
    {
      name: "Rohit Mehta",
      batch: "2019",
      company: "Amazon",
      jobTitle: "Product Manager",
    },
    {
      name: "Sneha Patel",
      batch: "2020",
      company: "TCS",
      jobTitle: "System Analyst",
    },
  ];

  // --------------------------
  // ✅ Logged-in dashboard view
  // --------------------------
  if (isLoggedIn) {
    return (
      <section className="min-h-screen bg-background text-foreground flex flex-col pt-12">
        <h1 className="text-center font-bold text-2xl">Your Dashboard</h1>

        <div className="p-6 gap-6 space-y-6 md:flex">
          {/* Sidebar */}
          <aside className="w-72 flex-shrink-0 bg-card rounded-3xl p-6 shadow-xl flex flex-col gap-8">
            <div className="flex flex-col items-center gap-3 border-b border-border pb-6">
              <div className="w-20 h-20 bg-gradient-to-tr from-accent/30 to-accent/10 rounded-full flex items-center justify-center shadow-md">
                <User className="w-10 h-10 text-accent" />
              </div>
              <h2 className="font-bold text-lg">{studentData.name}</h2>
              <p className="text-sm text-accent capitalize">
                {studentData.role}
              </p>
              {studentData.college && (
                <p className="text-xs text-muted-foreground">
                  {studentData.college}
                </p>
              )}
            </div>

            {/* Navigation */}
            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard/network"
                className="dashboard-link px-4 py-2 rounded-xl hover:bg-accent/10 flex items-center gap-2 transition"
              >
                🌐 My Network
              </Link>
              <Link
                href="/events/registered"
                className="dashboard-link px-4 py-2 rounded-xl hover:bg-accent/10 flex items-center gap-2 transition"
              >
                🎟 My Enrollments
              </Link>
              {studentData.role === "student" ? (
                <Link
                  href="/dashboard/mentorship"
                  className="dashboard-link px-4 py-2 rounded-xl hover:bg-accent/10 flex items-center gap-2 transition"
                >
                  🧑‍🏫 Find Mentors
                </Link>
              ) : (
                <Link
                  href="/dashboard/mentorship"
                  className="dashboard-link px-4 py-2 rounded-xl hover:bg-accent/10 flex items-center gap-2 transition"
                >
                  🤝 Offer Mentorship
                </Link>
              )}
            </div>

            <div className="mt-auto text-sm text-secondary text-center bg-gradient-to-r from-accent/5 to-accent/10 rounded-xl py-2 shadow-inner">
              👋 Welcome back,{" "}
              <span className="font-semibold text-accent">
                {studentData.name?.split(" ")[0]}
              </span>
              !
            </div>
          </aside>

          {/* Main Feed */}
          <main className="flex-1 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-4"
            >
              <h2 className="text-2xl font-bold">Latest Updates</h2>

              {/* Events */}
              {events.length > 0 ? (
                events.map((ev) => (
                  <motion.div
                    key={ev.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-card p-5 rounded-2xl shadow-md border border-border transition"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-6 h-6 text-accent" />
                      <h3 className="font-semibold">{ev.title}</h3>
                    </div>
                    <p className="text-sm text-secondary">📅 {ev.date}</p>
                  </motion.div>
                ))
              ) : (
                <p className="text-secondary text-sm">No recent events.</p>
              )}

              {/* Alumni Highlight */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-card p-5 rounded-2xl shadow-md border border-border transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Briefcase className="w-6 h-6 text-accent" />
                  <h3 className="font-semibold">Career Tip from Alumni</h3>
                </div>
                <p className="text-sm">
                  “Networking opens doors! Reach out to alumni in your dream
                  companies.”
                </p>
                <p className="text-xs text-secondary mt-2">
                  — Anjali Gupta, Batch 2018, Google
                </p>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </section>
    );
  }

  // --------------------------
  // ✅ Public Landing Page
  // --------------------------
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-background via-background/80 to-background text-foreground flex flex-col items-center justify-center text-center px-6">
      <FloatingEventsPageButton />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <GraduationCap className="w-20 h-20 text-accent mx-auto mb-6" />
        <h1 className="text-4xl sm:text-6xl font-extrabold">
          Connect <span className="text-accent">Alumni</span> & Empower{" "}
          <span className="text-accent">Students</span>
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-secondary max-w-2xl mx-auto">
          Join a thriving network of students, mentors, and professionals
          shaping the future together.
        </p>
      </motion.div>

      {/* Metrics */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div>
          <h2 className="text-3xl font-bold text-accent">10,000+</h2>
          <p className="text-sm text-muted-foreground">Students Registered</p>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-accent">3,000+</h2>
          <p className="text-sm text-muted-foreground">Active Alumni</p>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-accent">150+</h2>
          <p className="text-sm text-muted-foreground">Colleges Connected</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-6xl">
        {[
          {
            icon: <Network className="w-10 h-10 text-accent mx-auto mb-4" />,
            title: "Networking",
            desc: "Connect with alumni, mentors, and peers to expand your professional network.",
          },
          {
            icon: <Calendar className="w-10 h-10 text-accent mx-auto mb-4" />,
            title: "Events & Opportunities",
            desc: "Explore and participate in workshops, seminars, and hackathons.",
          },
          {
            icon: <Handshake className="w-10 h-10 text-accent mx-auto mb-4" />,
            title: "Mentorship",
            desc: "Get or provide mentorship for career guidance and personal growth.",
          },
        ].map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-card p-6 rounded-3xl shadow-lg border border-border hover:shadow-xl transition"
          >
            {f.icon}
            <h3 className="font-bold text-lg mb-2">{f.title}</h3>
            <p className="text-sm text-secondary">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Top Alumni */}
      <div className="mt-16 max-w-6xl w-full">
        <h2 className="text-2xl font-bold mb-6">🌟 Featured Alumni</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {alumnis.map((al, i) => (
            <div key={i}>
              <StudentCard student={al} />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 flex flex-wrap justify-center gap-4">
        <Link
          href="/alumni"
          className="px-6 py-3 bg-accent text-white rounded-full font-semibold shadow-md hover:bg-accent/90 transition flex items-center gap-2"
        >
          <Users className="w-5 h-5" /> Explore Alumni
        </Link>
        <Link
          href="/register"
          className="px-6 py-3 border border-accent text-accent rounded-full font-semibold hover:bg-accent/10 transition flex items-center gap-2"
        >
          Get Started <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
