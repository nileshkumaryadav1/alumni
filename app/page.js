"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  Building,
  ArrowRight,
  Network,
} from "lucide-react";
import FloatingEventsPageButton from "@/components/custom/myself/FloatingEventsPageButton";

export default function HomePage() {
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
        A centralized platform to connect alumni, empower students, and
        strengthen the bond with your college community.
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
        animate={{ opacity: 1, y: 0 }}
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
