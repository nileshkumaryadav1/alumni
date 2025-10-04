"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import { Users, Search, PlusCircle } from "lucide-react";
import EventCard from "@/components/fest/EventCard";
import StudentCardWithConnectBtn from "@/components/network/StudentCardWithConnectBtn";
import StatsSection from "@/components/explore/StatOverViewSection";
import QuickLinksSection from "@/components/explore/QuickLinkSection";
import JoinCard from "@/components/explore/JoinCard";
import HeroSection from "@/components/explore/HeroSection";

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

  const AlumniCarousel = () => {
    const alumni = users.filter((u) => u.role === "alumni");
    const preview = student ? alumni : alumni.slice(0, 3);

    return (
      <section className="max-w-7xl mx-auto py-12 px-2">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[color:var(--highlight)] text-center">
          Top Alumni
        </h2>

        {/* Alumni card with connect btn */}
        <div>
          <StudentCardWithConnectBtn student={preview} />
        </div>
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
    <main className="bg-background text-foreground px-4">
      <HeroSection student={student} />
      <StatsSection />
      <QuickLinksSection />
      <AlumniCarousel />
      <EventsSection />
      <AchievementsSection />
      <FundraisingSection />
      {!student && <JoinCard />}
    </main>
  );
}
