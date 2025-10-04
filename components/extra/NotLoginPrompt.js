"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, UserCheck } from "lucide-react";

export default function NotLoginPromptCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-card border border-border rounded-3xl shadow-md p-6 flex flex-col items-center text-center gap-4 max-w-md mx-auto"
    >
      <h3 className="text-lg font-semibold text-foreground">
        You are not logged in.
      </h3>

      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-accent/10 text-accent shadow-inner">
        <UserCheck className="w-7 h-7" />
      </div>

      <h3 className="text-lg font-semibold text-foreground">
        Unlock the Full Experience
      </h3>

      <p className="text-sm text-muted-foreground leading-relaxed">
        Login to register for events, connect with alumni, and explore
        mentorship opportunities curated by the administration to help you
        discover your ideal roadmap to success.
      </p>

      <Link
        href="/login"
        className="px-6 py-2.5 mt-2 border border-accent text-accent font-medium rounded-full hover:bg-accent hover:text-background transition-all duration-300 flex items-center gap-2"
      >
        Login Now <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}
