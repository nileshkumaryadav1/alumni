"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  UserCheck,
  Network,
  ArrowRight,
} from "lucide-react";

export default function NetworkPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentData, setStudentData] = useState({});
  const [activeTab, setActiveTab] = useState("requests");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const student = localStorage.getItem("student");
      if (student) {
        setIsLoggedIn(true);
        setStudentData(JSON.parse(student));
      }
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "requests":
        return (
          <motion.div
            key="requests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-accent" />
              Friend Requests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((id) => (
                <div
                  key={id}
                  className="p-4 rounded-2xl border bg-card shadow-md flex flex-col gap-3"
                >
                  <div>
                    <p className="font-medium">Student {id}</p>
                    <p className="text-sm text-secondary">
                      Requested to connect
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gradient-to-r from-accent/80 to-accent text-white rounded-full hover:scale-105 transition">
                      Accept
                    </button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-full hover:scale-105 transition">
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case "friends":
        return (
          <motion.div
            key="friends"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-accent" />
              Your Friends
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3].map((id) => (
                <div
                  key={id}
                  className="p-4 rounded-2xl border bg-card shadow-md flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">Alumni {id}</p>
                    <p className="text-sm text-secondary">Batch 2020</p>
                  </div>
                  <button className="text-red-500 text-sm hover:underline">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case "suggestions":
        return (
          <motion.div
            key="suggestions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              People You May Know
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((id) => (
                <div
                  key={id}
                  className="p-4 rounded-2xl border bg-card shadow-md flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">Student {id}</p>
                    <p className="text-sm text-secondary">
                      Same College / Batch
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-accent text-white rounded-full hover:scale-105 transition">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // --------------------------
  // Logged-in View
  // --------------------------
  if (isLoggedIn) {
    return (
      <section className="min-h-screen bg-background text-foreground flex flex-col pt-6 md:pt-12">
        {/* Heading */}
        <div
          className="flex items-center gap-3 justify-center mb-2 px-6"
        >
          <Network className="w-7 h-7 text-accent" />
          <h1 className="text-2xl font-bold">My Network</h1>
        </div>

        {/* Redesigned Tabs */}
        <div className="flex justify-center mt-6 gap-4 px-6">
          {[
            { key: "requests", label: "Requests", icon: UserPlus },
            { key: "friends", label: "Friends", icon: UserCheck },
            { key: "suggestions", label: "Suggestions", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center px-2 py-3 rounded-full transition shadow-md ${
                  isActive
                    ? "bg-gradient-to-r from-accent to-accent/80 text-white shadow-lg"
                    : "bg-card text-foreground hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Animated Content */}
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </section>
    );
  }

  // --------------------------
  // Logged-out Landing Style
  // --------------------------
  return (
    <section className="flex flex-col items-center justify-center text-center min-h-screen px-6 bg-gradient-to-b from-background via-background/90 to-background">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-6"
      >
        <Network className="w-20 h-20 text-accent drop-shadow-lg" />
      </motion.div>

      <motion.h1 className="text-4xl sm:text-6xl font-extrabold">
        Build Your <span className="text-accent">Network</span>
      </motion.h1>

      <motion.p className="mt-4 text-lg sm:text-xl text-secondary max-w-2xl">
        Connect with alumni and students. Grow together, mentor each other, and
        unlock new opportunities.
      </motion.p>

      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <Link href="/register" className="btn-primary">
          Join Now <ArrowRight className="w-5 h-5" />
        </Link>
        <Link href="/alumni" className="btn-outline">
          <Users className="w-5 h-5" /> Explore Alumni
        </Link>
      </div>
    </section>
  );
}
