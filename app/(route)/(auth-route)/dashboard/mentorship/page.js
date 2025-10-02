"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Handshake, UserCircle, UserPlus, UserCheck } from "lucide-react";
import axios from "axios";
import StudentCard from "@/components/dashboard/StudentCard";

export default function MentorshipPage() {
  const [student, setStudent] = useState(null);
  const [friends, setFriends] = useState([]);
  const [activeTab, setActiveTab] = useState("friends");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (!stored) return setLoading(false);

    const parsed = JSON.parse(stored);
    setStudent(parsed);

    const fetchConnections = async () => {
      try {
        const res = await axios.get(`/api/connect?userId=${parsed._id}`);
        setFriends(res.data.friends || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const refresh = async () => {
    if (!student) return;
    const res = await axios.get(`/api/connect?userId=${student._id}`);
    setFriends(res.data.friends || []);
  };

  const handleOfferMentorship = async (id) => {
    alert(`Mentorship offered to ${id}`);
  };

  const handleRequestMentorship = async (id) => {
    alert(`Mentorship requested from ${id}`);
  };
  const handleRemove = async (id) => {
    await axios.delete(`/api/connect?connId=${id}`);
    refresh();
  };

  if (loading)
    return <p className="p-6 text-center">Loading mentorship data...</p>;
  if (!student)
    return (
      <p className="min-h-screen flex items-center justify-center">
        Please login to view mentorship.
      </p>
    );

  // Only accepted friends for mentorship
  // const connections = friends
  //   .map((f) => (f.sender._id === student._id ? f.receiver : f.sender))
  //   .filter(Boolean);

  const connections = friends;

  // const studentConnections = connections.filter((c) => c.role === "student");
  // const alumniConnections = connections.filter((c) => c.role === "alumni");
  const studentConnections = connections;
  const alumniConnections = connections;

  const renderTab = () => {
    switch (activeTab) {
      case "friends":
        const list =
          student.role === "alumni" ? alumniConnections : studentConnections;
        if (list.length === 0)
          return (
            <p className="text-secondary text-center">
              No connected {student.role === "alumni" ? "students" : "alumni"}{" "}
              yet.
            </p>
          );

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {list.map((student) => (
              <motion.div
                key={student.uniqueId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 bg-card rounded-2xl shadow-md flex flex-col gap-2"
              >
                {/* <StudentCard user={student.user} /> */}
                <div className="flex items-center gap-3">
                  <UserCircle className="w-12 h-12 text-accent" />
                  <div>
                    <h3 className="font-medium">{student.user.name}</h3>
                    {student.role === "alumni" ? (
                      <p className="text-sm text-secondary">
                        {student.user.jobTitle} @ {student.company}
                      </p>
                    ) : (
                      <p className="text-sm text-secondary">
                        {student.college} • {student.user.batch}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  className={`mt-2 px-4 py-2 rounded-lg text-white transition ${
                    student.role === "alumni"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  onClick={() =>
                    student.role === "alumni"
                      ? handleOfferMentorship(student._id)
                      : handleRequestMentorship(student._id)
                  }
                >
                  {student.role === "alumni"
                    ? "Offer Mentorship"
                    : "Request Mentorship"}
                </button>
                <button
                  className="mt-1 text-red-500 text-sm hover:underline self-start"
                  onClick={() => handleRemove(student._id)}
                >
                  Remove Friend
                </button>
              </motion.div>
            ))}
          </div>
        );

      default:
        return <p className="text-secondary text-center">Select a tab</p>;
    }
  };

  return (
    <section className="min-h-screen bg-background text-foreground flex flex-col pt-6 md:pt-12 px-6">
      <div className="flex items-center gap-3 justify-center mb-6">
        <Handshake className="w-7 h-7 text-accent" />
        <h1 className="text-2xl font-bold">Mentorship</h1>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        {[{ key: "friends", label: "Connections", icon: UserCheck }].map(
          (tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition ${
                  isActive
                    ? "bg-gradient-to-r from-accent to-accent/80 text-white shadow-lg"
                    : "bg-card text-foreground hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          }
        )}
      </div>

      <AnimatePresence mode="wait">{renderTab()}</AnimatePresence>
    </section>
  );
}
