"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="md:min-h-screen flex items-center justify-center px-4 sm:px-8 lg:px-16 py-12 sm:py-16 bg-[color:var(--background)]">
      <div
        className="max-w-4xl w-full text-center space-y-6 sm:space-y-8 p-6 sm:p-10 
                   rounded-3xl bg-white/10 backdrop-blur-xl 
                   border border-white/20 shadow-lg"
      >
        {/* Title */}
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold 
                       text-[color:var(--accent)] drop-shadow-md"
        >
          About Our Alumni Network
        </h1>

        {/* Directory Section */}
        <div className="pt-2 sm:pt-4">
          <Link
            href="/directory"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 
                       rounded-xl bg-[color:var(--accent)]/15 
                       text-[color:var(--accent)] font-semibold text-sm sm:text-base 
                       border border-[color:var(--accent)]/40 
                       hover:bg-[color:var(--accent)] hover:text-white 
                       shadow-md transition-all duration-300"
          >
            👥 Explore Directory
          </Link>
        </div>

        {/* Description */}
        <div className="space-y-5 text-[color:var(--secondary)]">
          <p className="text-base sm:text-lg leading-relaxed text-justify">
            Our Alumni Management System is a vibrant platform that bridges{" "}
            <span className="font-semibold">graduates, students, and faculty</span>,
            creating lasting professional and personal connections.
          </p>

          <p className="text-base sm:text-lg leading-relaxed text-justify">
            Alumni can showcase their journeys, connect with peers, and guide the
            next generation of students. From networking to mentorship, this
            community is built to foster collaboration and growth.
          </p>

          <p className="text-sm sm:text-base text-[color:var(--highlight)] italic">
            🌟 Celebrating the legacy, empowering the future.
          </p>
        </div>
      </div>
    </section>
  );
}
