"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <section className="flex min-h-screen py-12 flex-col items-center justify-center text-center px-6">
      {/* Warning Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-6"
      >
        <AlertTriangle className="w-20 h-20 text-accent animate-pulse" />
      </motion.div>

      {/* 404 Title */}
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-9xl font-bold text-accent drop-shadow-lg"
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-4 text-2xl text-foreground/80"
      >
        Oops! Page not found
      </motion.p>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-2 text-lg text-secondary max-w-md"
      >
        You just hit a route that doesn&apos;t exist. It might have been moved or deleted.
      </motion.p>

      {/* Home Button */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-8"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl border-2 border-accent bg-accent px-6 py-3 text-lg font-semibold text-background shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
        >
          <Home className="w-5 h-5" />
          Go Home
        </Link>
      </motion.div>
    </section>
  );
}
