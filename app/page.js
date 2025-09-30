"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  Building,
  ArrowRight,
  Network,
  Calendar,
  User,
} from "lucide-react";
import FloatingEventsPageButton from "@/components/custom/myself/FloatingEventsPageButton";

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentData, setStudentData] = useState({});

  // Check localStorage for student
  useEffect(() => {
    if (typeof window !== "undefined") {
      const student = localStorage.getItem("student");
      if (student) {
        setIsLoggedIn(true);
        setStudentData(JSON.parse(student));
      }
    }
  }, []);

  // Logged-in dashboard
  if (isLoggedIn) {
    return (
      <section className="min-h-screen bg-background text-foreground flex flex-col pt-12">
        <div className="flex flex-1 p-6 gap-6 max-xl:flex-col">
          {/* Sidebar */}
          <aside className="w-72 flex-shrink-0 bg-card rounded-2xl p-5 shadow-md flex flex-col gap-6">
            <div className="flex flex-col items-center gap-3 border-b pb-4">
              <User className="w-16 h-16 text-accent" />
              <h2 className="font-bold text-lg">{studentData.name}</h2>
              <p className="text-sm text-secondary capitalize">{studentData.role}</p>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              {studentData.role === "admin" && (
                <>
                  <Link
                    href="/admin/events"
                    className="text-accent hover:bg-accent/10 px-3 py-2 rounded-lg transition"
                  >
                    Manage Events
                  </Link>
                  <Link
                    href="/admin/users"
                    className="text-accent hover:bg-accent/10 px-3 py-2 rounded-lg transition"
                  >
                    Manage Users
                  </Link>
                </>
              )}

              {studentData.role === "student" && (
                <>
                  <Link
                    href="/dashboard/events"
                    className="text-accent hover:bg-accent/10 px-3 py-2 rounded-lg transition"
                  >
                    My Enrollments
                  </Link>
                  <Link
                    href="/dashboard/mentors"
                    className="text-accent hover:bg-accent/10 px-3 py-2 rounded-lg transition"
                  >
                    Find Mentors
                  </Link>
                </>
              )}

              {studentData.role === "alumni" && (
                <>
                  <Link
                    href="/dashboard/network"
                    className="text-accent hover:bg-accent/10 px-3 py-2 rounded-lg transition"
                  >
                    My Network
                  </Link>
                  <Link
                    href="/dashboard/mentorship"
                    className="text-accent hover:bg-accent/10 px-3 py-2 rounded-lg transition"
                  >
                    Offer Mentorship
                  </Link>
                </>
              )}
            </div>

            <div className="mt-auto text-sm text-secondary px-2">
              Welcome back! Explore your dashboard and stay connected.
            </div>
          </aside>

          {/* Feed / Main Content */}
          <main className="flex-1 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-4"
            >
              <h2 className="text-2xl font-bold">Your Feed</h2>

              {/* Example feed card */}
              <motion.div
                className="bg-card p-5 rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <User className="w-8 h-8 text-accent" />
                  <div>
                    <h3 className="font-semibold">{studentData.name}</h3>
                    <p className="text-sm text-secondary">{studentData.role}</p>
                  </div>
                </div>
                <p className="text-sm text-foreground">
                  Welcome to your personalized dashboard! Here you can see updates, upcoming events, and connect with your peers.
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-accent">
                  <Calendar className="w-5 h-5" />
                  Upcoming Event: Hackathon 2025
                </div>
              </motion.div>

              {/* More feed cards can go here */}
            </motion.div>
          </main>
        </div>
      </section>
    );
  }

  // Not logged in → landing page
  return (
    <section className="relative flex min-h-screen py-16 flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-background via-background/80 to-background text-foreground">
      <FloatingEventsPageButton />

      {/* Logo/Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-8 flex items-center justify-center"
      >
        <GraduationCap className="w-20 h-20 text-accent drop-shadow-lg" />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-6xl font-extrabold tracking-tight"
      >
        Alumni & Student <span className="text-accent">Relations</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-4 text-lg sm:text-xl text-secondary max-w-2xl"
      >
        A centralized platform to connect alumni, empower students, and strengthen the bond with your college community.
      </motion.p>

      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full"
      >
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card p-6 shadow-md hover:shadow-xl transition">
          <Users className="w-10 h-10 text-accent" />
          <h3 className="text-lg font-semibold">Alumni Network</h3>
          <p className="text-sm text-muted-foreground">
            Discover and connect with alumni across batches and industries.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card p-6 shadow-md hover:shadow-xl transition">
          <Building className="w-10 h-10 text-accent" />
          <h3 className="text-lg font-semibold">College Connect</h3>
          <p className="text-sm text-muted-foreground">
            Stay updated with campus events and contribute to initiatives.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card p-6 shadow-md hover:shadow-xl transition">
          <Network className="w-10 h-10 text-accent" />
          <h3 className="text-lg font-semibold">Student Mentorship</h3>
          <p className="text-sm text-muted-foreground">
            Guide students in career, internships, and networking opportunities.
          </p>
        </div>
      </motion.div>

      {/* Call to Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-12 flex flex-wrap justify-center gap-4"
      >
        <Link
          href="/alumni"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-lg font-semibold text-background shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
        >
          <Users className="w-5 h-5" />
          Explore Alumni
        </Link>

        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-accent px-6 py-3 text-lg font-semibold text-accent transition-transform hover:scale-105 hover:bg-accent hover:text-background"
        >
          Get Started
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </section>
  );
}
