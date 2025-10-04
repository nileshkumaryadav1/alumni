"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ComingSoon({ title }) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center py-10 px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-card shadow-xl rounded-3xl p-10 max-w-lg w-full text-center border border-border"
      >
        {/* Icon / Header */}
        <div className="flex justify-center mb-6">
          <ArrowLeft className="w-10 h-10 text-accent animate-bounce" />{" "}
          <span className="text-2xl md:text-3xl text-accent font-bold">
            {title}
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-foreground mb-4">
          🚧 Coming Soon!
        </h1>

        <p className="text-sm text-muted-foreground mb-6">
          This feature or page is under development. Stay tuned — exciting
          things are on the way!
        </p>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-accent text-accent font-semibold hover:bg-accent hover:text-background transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </button>
      </motion.div>
    </div>
  );
}
