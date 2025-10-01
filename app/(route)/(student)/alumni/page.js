"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import {
  Users,
  Search,
  PlusCircle,
  UserCircle,
  Linkedin,
  GraduationCap,
  IdCard,
  Phone,
  Mail,
} from "lucide-react";
import EventCard from "@/components/fest/EventCard";

export default function MainPage() {
  const [student, setStudent] = useState(null);
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [events, setEvents] = useState([]);
  const [fundraisers, setFundraisers] = useState([]);

  // Get logged-in student from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (stored) {
      try {
        setStudent(JSON.parse(stored));
      } catch (err) {
        console.error("Invalid student data", err);
        localStorage.removeItem("student");
      }
    }
  }, []);

  // Fetch data from APIs
  useEffect(() => {
    axios.get("/api/admin/users").then((res) => setUsers(res.data));
    axios.get("/api/admin/enrollments").then((res) => setEnrollments(res.data));
    axios.get("/api/achievements").then((res) => setAchievements(res.data));
    axios.get("/api/homepage").then((res) => setEvents(res.data.events));
    axios.get("/api/fundraisers").then((res) => setFundraisers(res.data));
  }, []);

  const getUserEvents = (user) => {
    return enrollments
      .filter((enrollment) =>
        enrollment.participants.some(
          (p) => p._id === user._id || p.email === user.email
        )
      )
      .map((enrollment) => enrollment.eventDetails?.name || "Unnamed Event");
  };

  /** ------------------- COMPONENTS ------------------- **/

  const HeroSection = () => (
    <section className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-blue-50 text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Users className="w-20 h-20 text-accent mx-auto mb-4" />
        <h1 className="text-4xl sm:text-6xl font-bold mb-4">
          {student ? `Welcome, ${student.name}!` : "Alumni & Student Network"}
        </h1>
        <p className="text-lg sm:text-xl text-secondary max-w-2xl mx-auto">
          {student
            ? "Connect, explore events, and see achievements in your community."
            : "Discover, connect, and collaborate with students and alumni. Join now!"}
        </p>

        {!student && (
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-lg font-semibold text-background shadow-lg hover:scale-105 transition"
            >
              <PlusCircle className="w-5 h-5" /> Register
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-accent px-6 py-3 text-lg font-semibold text-accent hover:bg-accent hover:text-background hover:scale-105 transition"
            >
              <Search className="w-5 h-5" /> Login
            </Link>
          </div>
        )}
      </motion.div>
    </section>
  );

  const AlumniCarousel = () => {
    const alumni = users.filter((u) => u.role === "alumni");
    const preview = student ? alumni : alumni.slice(0, 3);

    return (
      <section className="max-w-7xl mx-auto py-12 px-2">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[color:var(--highlight)] text-center">
          Top Alumni
        </h2>
        <div className="flex item-center gap-4 overflow-x-auto scrollbar-hide">
          {preview.map((user) => (
            <div
              key={user._id}
              className="min-w-[220px] p-4 border border-[color:var(--border)] rounded-xl shadow-md bg-[color:var(--card)]"
            >
              {/* User Header */}
              <div className="flex flex-col items-center mb-4">
                <UserCircle className="w-16 h-16 text-[color:var(--accent)] mb-2" />
                <h2 className="text-lg font-semibold text-[color:var(--foreground)] text-center">
                  {user.name}
                </h2>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold uppercase ${
                    user.role === "student"
                      ? "bg-blue-100 text-blue-700"
                      : user.role === "alumni"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.role}
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-2 text-sm border-t border-[color:var(--border)] pt-3">
                <p className="flex items-center gap-2 text-[color:var(--secondary)]">
                  <Mail className="w-4 h-4 text-[color:var(--highlight)]" />
                  <span>{user.email}</span>
                </p>
                {user.phone && (
                  <p className="flex items-center gap-2 text-[color:var(--secondary)]">
                    <Phone className="w-4 h-4 text-[color:var(--highlight)]" />
                    <span>{user.phone}</span>
                  </p>
                )}
                {user.uniqueId && (
                  <p className="flex items-center gap-2 text-[color:var(--secondary)]">
                    <IdCard className="w-4 h-4 text-[color:var(--highlight)]" />
                    <span>uniqueId: {user.uniqueId}</span>
                  </p>
                )}
                {(user.college || user.company) && (
                  <p className="flex items-center gap-2 text-[color:var(--secondary)]">
                    <GraduationCap className="w-4 h-4 text-[color:var(--highlight)]" />
                    <span>
                      {user.role === "student" && user.college}
                      {user.role === "alumni" &&
                        `${user.jobTitle} at ${user.company} (${user.batch})`}
                    </span>
                  </p>
                )}
                {user.linkedin && (
                  <p className="text-xs text-[color:var(--accent)] hover:underline break-all flex items-center justify-center">
                    <a
                      href={user.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="w-6 h-6" />
                    </a>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        {!student && (
          <p className="text-sm mt-2 text-center text-[color:var(--secondary)]">
            Login to see full alumni network.
          </p>
        )}
      </section>
    );
  };

  const EventsSection = () => {
    const previewEvents = student ? events : events.slice(0, 3);

    return (
      <section className="max-w-7xl mx-auto py-12 px-2">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[color:var(--highlight)] text-center">
          Upcoming Events & Opportunities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
        {!student && (
          <p className="text-sm mt-2 text-center text-[color:var(--secondary)]">
            Login to register and see all events.
          </p>
        )}
      </section>
    );
  };

  const AchievementsSection = () => {
    const previewAchievements = student
      ? achievements
      : achievements.slice(0, 4);

    return (
      <section className="max-w-7xl mx-auto py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[color:var(--highlight)]  text-center">
          Student & Alumni Achievements
        </h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {previewAchievements.map((ach) => (
            <div
              key={ach._id}
              className="min-w-[220px] p-4 border border-[color:var(--border)] rounded-xl shadow-md bg-[color:var(--card)]"
            >
              <h3 className="font-semibold mb-1">{ach.name}</h3>
              <p className="text-sm text-[color:var(--secondary)]">
                {ach.description}
              </p>
              <p className="text-xs mt-2 text-[color:var(--accent)]">
                {ach.year}
              </p>
            </div>
          ))}
        </div>
        {!student && (
          <p className="text-sm mt-2 text-center text-[color:var(--secondary)]">
            Register to showcase your achievements.
          </p>
        )}
      </section>
    );
  };

  const FundraisingSection = () => {
    const previewFundraisers = student ? fundraisers : fundraisers.slice(0, 3);

    return (
      <section className="max-w-7xl mx-auto py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[color:var(--highlight)] text-center">
          Community Fundraisers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewFundraisers.map((f) => (
            <div
              key={f._id}
              className="p-4 border border-[color:var(--border)] rounded-xl shadow-md bg-[color:var(--card)]"
            >
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm mt-1 text-[color:var(--secondary)]">
                {f.description}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-accent h-2 rounded-full"
                  style={{ width: `${(f.raised / f.target) * 100}%` }}
                />
              </div>
              <p className="text-xs mt-1 text-[color:var(--secondary)]">
                Raised: ${f.raised} / ${f.target}
              </p>
              {student && (
                <button className="mt-3 px-4 py-2 bg-accent text-background rounded-xl hover:scale-105 transition">
                  Contribute
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  /** ------------------- RENDER ------------------- **/
  return (
    <main className="bg-background text-foreground">
      <HeroSection />
      <AlumniCarousel />
      <EventsSection />
      <AchievementsSection />
      <FundraisingSection />
    </main>
  );
}
