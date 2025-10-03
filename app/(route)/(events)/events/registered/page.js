"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RegisteredForEvent from "@/components/dashboard/RegisteredForEvent";

export default function RegisteredEvents() {
  const [student, setStudent] = useState(null);
  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");

    if (!storedStudent) {
      router.push("/login");
      return;
    }

    try {
      const parsed = JSON.parse(storedStudent);
      setStudent(parsed);

      // Fetch registered events
      fetch(`/api/student/${parsed._id}/events`)
        .then((res) => res.json())
        .then((data) => setEvents(data || []))
        .catch((err) => {
          console.error("Error fetching events", err);
          setEvents([]);
        });
    } catch (err) {
      console.error("Invalid student data in localStorage", err);
      localStorage.removeItem("student");
      router.push("/login");
    }
  }, [router]);

  if (!student) {
    return (
      <main className="min-h-screen flex items-center justify-center text-[var(--foreground)] bg-[var(--background)]">
        <p className="text-center text-sm">Loading your Registered Events...</p>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen px-4 py-8 md:px-12"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <section>
          <RegisteredForEvent />
        </section>
      </div>
    </main>
  );
}
