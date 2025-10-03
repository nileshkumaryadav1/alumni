"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { MdEventAvailable } from "react-icons/md";
import EventCard from "@/components/fest/EventCard";
import LoadingSkeleton from "@/components/custom/myself/LoadingSkeleton";

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "A-Z", value: "az" },
  { label: "Z-A", value: "za" },
];

export default function EventListPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/homepage");
        const data = await res.json();

        if (res.ok && data.events) {
          setEvents(data.events);
        } else {
          console.error("Failed to fetch events:", data?.error);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events
    .filter(
      ({ title, category: eventCategory }) =>
        (category === "All" || eventCategory === category) &&
        title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "az":
          return a.title.localeCompare(b.title);
        case "za":
          return b.title.localeCompare(a.title);
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "newest":
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

  const uniqueCategories = ["All", ...new Set(events.map((e) => e.category))];

  return (
    <main className="min-h-screen px-6 md:px-20 md:py-10 py-6 bg-[var(--background)] text-[var(--foreground)]">
      {/* Title with Motion */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center md:mb-6 mb-2"
      >
        <div className="flex justify-center md:mb-4 mb-2">
          <MdEventAvailable className="w-10 h-10 md:w-16 md:h-16 text-accent" />
          <h1 className="text-3xl md:text-5xl font-bold md:my-2">
            <span className="text-accent">Events</span>
          </h1>
        </div>

        <p className="mt-1 text-lg text-secondary max-w-2xl mx-auto">
          Stay updated with the latest activities, workshops, and fests
          happening around.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto md:space-y-6 space-y-4">
        {/* Filter Bar with Motion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-[color:var(--border)] shadow-lg flex flex-col md:flex-row items-center gap-4"
        >
          {/* Search */}
          <div className="relative w-full md:w-1/3">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--secondary)]" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border border-[color:var(--border)] placeholder-[color:var(--secondary)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Sorting & Filters */}
          <div className="flex gap-4 w-full md:w-auto">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/10 border border-[color:var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat} className="text-black">
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/10 border border-[color:var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {sortOptions.map(({ label, value }) => (
                <option key={value} value={value} className="text-black">
                  {label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/*  */}
        <div className="text-[var(--highlight)] text-xl md:text-2xl font-semibold mb-4 text-center">
          Total Events: ({filteredEvents.length})
        </div>

        {/* Event Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </div>
        ) : filteredEvents.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[var(--foreground)]"
          >
            No events found.
          </motion.p>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredEvents.map((event) => (
              <motion.div
                key={event.slug}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
