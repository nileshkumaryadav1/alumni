"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  ArrowRight,
  Calendar,
  User,
  Briefcase,
} from "lucide-react";
import FloatingEventsPageButton from "@/components/custom/myself/FloatingEventsPageButton";

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentData, setStudentData] = useState({});
  const [events, setEvents] = useState([]);

  // ✅ Check login + fetch events
  useEffect(() => {
    if (typeof window !== "undefined") {
      const student = localStorage.getItem("student");
      if (student) {
        setIsLoggedIn(true);
        setStudentData(JSON.parse(student));
      }
    }
  }, []);

  useEffect(() => {
    fetch("/api/homepage")
      .then((res) => res.json())
      .then((data) => setEvents(data.events));
  });

  // --------------------------
  // ✅ Logged-in dashboard
  // --------------------------
  if (isLoggedIn) {
    return (
      <section className="min-h-screen bg-background text-foreground flex flex-col pt-12">
<h1 className="text-center font-bold text-2xl">Our System</h1>

        <div className="p-6 gap-6 space-y-6 md:flex">
          {/* Sidebar */}
          <aside className="w-72 flex-shrink-0 bg-card rounded-3xl p-6 shadow-xl flex flex-col gap-8">
            {/* Profile Section */}
            <div className="flex flex-col items-center gap-3 border-b border-gray-200 pb-6">
              <div className="w-20 h-20 bg-gradient-to-tr from-accent/30 to-accent/10 rounded-full flex items-center justify-center shadow-md">
                <User className="w-10 h-10 text-accent" />
              </div>
              <h2 className="font-bold text-lg text-foreground">
                {studentData.name}
              </h2>
              <p className="text-sm text-accent capitalize">
                {studentData.role}
              </p>
              {studentData.college && (
                <p className="text-xs text-muted-foreground">
                  {studentData.college}
                </p>
              )}
            </div>

            {/* Links Section */}
            <div className="flex flex-col gap-3">
              {studentData.role === "admin" && (
                <>
                  <Link
                    href="/admin/events"
                    className="dashboard-link px-4 py-2 rounded-xl hover:bg-accent/10 hover:shadow transition flex items-center gap-2"
                  >
                    📅 Manage Events
                  </Link>
                  <Link
                    href="/admin/users"
                    className="dashboard-link px-4 py-2 rounded-xl hover:bg-accent/10 hover:shadow transition flex items-center gap-2"
                  >
                    👥 Manage Users
                  </Link>
                </>
              )}
              {studentData.role === "student" && (
                <>
                  <Link
                    href="/dashboard/events"
                    className="dashboard-link px-4 py-2 rounded-xl hover:bg-accent/10 hover:shadow transition flex items-center gap-2"
                  >
                    🎟 My Enrollments
                  </Link>
                  <Link
                    href="/dashboard/mentors"
                    className="dashboard-link px-4 py-2 rounded-xl hover:bg-accent/10 hover:shadow transition flex items-center gap-2"
                  >
                    🧑‍🏫 Find Mentors
                  </Link>
                </>
              )}
              {studentData.role === "alumni" && (
                <>
                  <Link
                    href="/dashboard/network"
                    className="dashboard-link px-4 py-2 rounded-xl hover:bg-accent/10 hover:shadow transition flex items-center gap-2"
                  >
                    🌐 My Network
                  </Link>
                  <Link
                    href="/dashboard/mentorship"
                    className="dashboard-link px-4 py-2 rounded-xl hover:bg-accent/10 hover:shadow transition flex items-center gap-2"
                  >
                    🤝 Offer Mentorship
                  </Link>
                </>
              )}
            </div>

            {/* Footer / Greeting */}
            <div className="mt-auto text-sm text-secondary px-2 bg-gradient-to-r from-accent/5 to-accent/10 rounded-xl py-2 text-center shadow-inner">
              👋 Welcome back,{" "}
              <span className="font-semibold text-accent">
                {studentData.name?.split(" ")[0]}
              </span>
              ! Keep connecting and growing.
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

              {/* Events Feed */}
              {events.map((ev) => (
                <motion.div
                  key={ev.id}
                  className="bg-card p-5 rounded-2xl shadow-md hover:shadow-xl transition"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-6 h-6 text-accent" />
                    <h3 className="font-semibold">{ev.title}</h3>
                  </div>
                  <p className="text-sm text-secondary">📅 {ev.date}</p>
                </motion.div>
              ))}

              {/* Alumni Post Example */}
              <motion.div
                className="bg-card p-5 rounded-2xl shadow-md hover:shadow-xl transition"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Briefcase className="w-6 h-6 text-accent" />
                  <h3 className="font-semibold">Career Tips from Alumni</h3>
                </div>
                <p className="text-sm text-foreground">
                  “Networking opens doors! Don’t hesitate to reach out to alumni
                  working in your dream company.”
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
  // ✅ Landing Page (not logged in)
  // --------------------------
  return (
    <section className="relative flex min-h-screen py-16 flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-background via-background/80 to-background text-foreground">
      <FloatingEventsPageButton />

      {/* Logo */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-8"
      >
        <GraduationCap className="w-20 h-20 text-accent drop-shadow-lg" />
      </motion.div>

      {/* Title */}
      <motion.h1 className="text-4xl sm:text-6xl font-extrabold">
        Connect <span className="text-accent">Alumni</span> & Empower{" "}
        <span className="text-accent">Students</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p className="mt-4 text-lg sm:text-xl text-secondary max-w-2xl">
        Join a thriving community of learners and leaders. Build networks, find
        mentors, and shape opportunities together.
      </motion.p>

      {/* Metrics */}
      <div className="mt-10 grid grid-cols-3 gap-8 text-center">
        <div>
          <h2 className="text-3xl font-bold text-accent">5000+</h2>
          <p className="text-sm text-muted-foreground">Active Alumni</p>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-accent">100+</h2>
          <p className="text-sm text-muted-foreground">
            Mentors Offering Guidance
          </p>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-accent">50+</h2>
          <p className="text-sm text-muted-foreground">Annual Events</p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <Link href="/alumni" className="btn-primary">
          <Users className="w-5 h-5" /> Explore Alumni
        </Link>
        <Link href="/register" className="btn-outline">
          Get Started <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
