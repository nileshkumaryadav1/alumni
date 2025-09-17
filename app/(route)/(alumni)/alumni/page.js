"use client";

import { motion } from "framer-motion";
import { Users, Search, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function AlumniPage() {
  return (
    <section className="flex min-h-screen py-12 flex-col items-center justify-center text-center px-6 bg-background text-foreground">
      {/* Icon */}
      <motion.div
        initial={{ rotate: -45, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <Users className="w-20 h-20 text-accent" />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-6xl font-bold"
      >
        Alumni Network
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-4 text-lg sm:text-xl text-secondary max-w-2xl"
      >
        Discover, connect, and collaborate with fellow alumni.  
        Search profiles, explore achievements, and grow together.
      </motion.p>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-8 flex flex-wrap justify-center gap-4"
      >
        <Link
          href="/alumni"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-lg font-semibold text-background shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
        >
          <Search className="w-5 h-5" />
          Find Alumni
        </Link>

        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-accent px-6 py-3 text-lg font-semibold text-accent transition-transform hover:scale-105 hover:bg-accent hover:text-background"
        >
          <PlusCircle className="w-5 h-5" />
          Add Profile
        </Link>
      </motion.div>
    </section>
  );
}
