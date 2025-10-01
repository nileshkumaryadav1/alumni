"use client";

import React, { useState, useEffect } from "react";
import { GraduationCap, Users, BookOpen, Handshake } from "lucide-react";

export default function MentorshipPage() {
  const [student, setStudent] = useState(null);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch logged-in student/alumni
    const stored = localStorage.getItem("student");
    if (stored) {
      setStudent(JSON.parse(stored));
    }

    // Fetch user’s network connections (friends/accepted requests)
    fetch("/api/network/connections")
      .then((res) => res.json())
      .then((data) => setConnections(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading mentorship data...</p>;
  if (!student) return <p className="min-h-screen flex items-center justify-center">Please login to view mentorship.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Handshake className="w-6 h-6" />
        Mentorship
      </h1>

      {student.role === "alumni" ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Students You Can Mentor
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {connections.length === 0 ? (
              <p className="text-gray-500">No connected students yet.</p>
            ) : (
              connections
                .filter((c) => c.role === "student")
                .map((c) => (
                  <div
                    key={c._id}
                    className="p-4 border rounded-xl shadow-sm bg-white flex flex-col gap-2"
                  >
                    <h3 className="font-medium">{c.name}</h3>
                    <p className="text-sm text-gray-600">
                      {c.college} • {c.year} Year
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Offer Mentorship
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Alumni You Can Learn From
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {connections.length === 0 ? (
              <p className="text-gray-500">No connected alumni yet.</p>
            ) : (
              connections
                .filter((c) => c.role === "alumni")
                .map((c) => (
                  <div
                    key={c._id}
                    className="p-4 border rounded-xl shadow-sm bg-white flex flex-col gap-2"
                  >
                    <h3 className="font-medium">{c.name}</h3>
                    <p className="text-sm text-gray-600">
                      {c.jobTitle} @ {c.company}
                    </p>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                      Request Mentorship
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
