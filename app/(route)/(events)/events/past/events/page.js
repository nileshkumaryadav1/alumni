"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import EventCard from "@/components/fest/EventCard";
import LoadingState from "@/components/custom/myself/LoadingState";

export default function PastEvents() {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest"); // newest | oldest
  const [loading, setLoading] = useState(true);

  // Fetch events
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetch("/api/homepage")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        setEvents(Array.isArray(data?.events) ? data.events : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        if (mounted) {
          setEvents([]);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Helper: safe parse date
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [y, m, d] = dateStr.split("-");
      return new Date(Number(y), Number(m) - 1, Number(d));
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  // Calculate past events
  useEffect(() => {
    if (events.length > 0) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const filtered = events.filter((ev) => {
        const eventDate = parseDate(ev?.date);
        return eventDate && eventDate < today;
      });

      setPastEvents(filtered);
    } else {
      setPastEvents([]);
    }
  }, [events]);

  // Search + Sort filter
  const filteredEvents = pastEvents
    .filter((ev) =>
      (ev?.name || ev?.eventId || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = parseDate(a?.date);
      const dateB = parseDate(b?.date);
      if (!dateA || !dateB) return 0;
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  if (loading) {
    return (
      <div className="p-10">
        <LoadingState text="Loading past events..." />
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-6 items-center w-full py-8 pt-20 px-4">
      {/* Title */}
      <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-2">
        <FaCalendarAlt className="text-primary" /> 🎉 Past Events
      </h1>

      {/* Search & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl gap-4">
        {/* Search Box */}
        <div className="relative w-full sm:w-1/2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search past events..."
            className="w-full px-4 py-3 pl-10 rounded-2xl bg-primary-foreground text-foreground border border-border shadow-md focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <FaSearch className="absolute left-3 top-3.5 text-muted-foreground" />
        </div>

        {/* Sort Button */}
        <button
          onClick={() =>
            setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
          }
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground shadow hover:shadow-lg transition"
        >
          {sortOrder === "newest" ? (
            <>
              <FaSortAmountDown /> Newest First
            </>
          ) : (
            <>
              <FaSortAmountUp /> Oldest First
            </>
          )}
        </button>
      </div>

      {/* Count */}
      <div className="text-center">
        <p className="text-muted-foreground">
          Showing <span className="font-semibold">{filteredEvents.length}</span>{" "}
          {filteredEvents.length === 1 ? "event" : "events"}
        </p>
      </div>

      {/* Event Grid */}
      <div className="w-full max-w-5xl">
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, i) => (
              <motion.div
                key={event?.slug || event?._id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center mt-10">
            No past events found.
          </p>
        )}
      </div>
    </section>
  );
}
