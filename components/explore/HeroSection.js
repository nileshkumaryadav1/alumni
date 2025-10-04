import { Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection({ student }) {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-background to-background blur-2xl" />
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10"
      >
        <Users className="w-16 h-16 text-accent mx-auto mb-4" />
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight">
          {student ? `Welcome, ${student.name}!` : "Your Alumni Network Hub"}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          {student
            ? "Stay connected with peers, mentors, and events that empower your career."
            : "Join a network that connects students, alumni, and opportunities together."}
        </p>

        {!student && (
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3 rounded-full bg-accent text-background font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              Join the Network
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 rounded-full border border-accent text-accent font-semibold hover:bg-accent hover:text-background transition-all"
            >
              Login
            </Link>
          </div>
        )}
      </motion.div>
    </section>
  );
}
