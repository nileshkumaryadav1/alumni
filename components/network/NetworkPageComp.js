"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, UserCheck, Network, UserCircle } from "lucide-react";
import axios from "axios";
import NotLoginPromptCard from "../extra/NotLoginPrompt";

export default function NetworkPageComp() {
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("suggestions");
  const [allUsers, setAllUsers] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const local = localStorage.getItem("student");
    if (!local) return setLoading(false);
    const parsed = JSON.parse(local);
    setStudent(parsed);

    const fetchData = async () => {
      try {
        const { data: users } = await axios.get("/api/admin/users");
        setAllUsers(users.filter((u) => u._id !== parsed._id));

        const res = await axios.get(`/api/connect?userId=${parsed._id}`);
        setIncoming(res.data.incoming || []);
        setOutgoing(res.data.outgoing || []);
        setFriends(res.data.friends || []);
      } catch (err) {
        console.error("Error fetching network data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const refresh = async () => {
    if (!student) return;
    try {
      const res = await axios.get(`/api/connect?userId=${student._id}`);
      setIncoming(res.data.incoming || []);
      setOutgoing(res.data.outgoing || []);
      setFriends(res.data.friends || []);
    } catch (err) {
      console.error("Error refreshing network:", err);
    }
  };

  const handleConnect = async (u) => {
    if (!student) return;
    await axios.post("/api/connect", {
      senderId: student._id,
      receiverId: u._id,
    });
    refresh();
  };
  const handleAccept = async (connId) => {
    await axios.put("/api/connect", { connId, status: "accepted" });
    refresh();
  };
  const handleReject = async (connId) => {
    await axios.put("/api/connect", { connId, status: "rejected" });
    refresh();
  };
  const handleRemove = async (connId) => {
    await axios.delete(`/api/connect?connId=${connId}`);
    refresh();
  };

  // filter suggestions = users not in incoming/outgoing/friends
  const suggestions = allUsers.filter(
    (u) =>
      !incoming.some((r) => r.user?._id === u._id) &&
      !outgoing.some((r) => r.user?._id === u._id) &&
      !friends.some((f) => f.user?._id === u._id)
  );

  if (loading)
    return <p className="p-6 text-secondary text-center">Loading...</p>;

  if (!student)
    return (
      <section className="flex flex-col items-center justify-center md:min-h-screen py-10 text-center px-6">
        <Network className="w-24 h-24 text-accent mb-6 drop-shadow-lg" />
        <h1 className="text-4xl sm:text-6xl font-extrabold">
          Build Your <span className="text-accent">Network</span>
        </h1>
        <p className="my-4 text-lg sm:text-xl text-secondary max-w-2xl">
          Connect with alumni and students. Grow together, mentor each other,
          unlock opportunities.
        </p>
        <NotLoginPromptCard />
      </section>
    );

  const renderTab = () => {
    switch (activeTab) {
      case "requests":
        return incoming.length === 0 ? (
          <p className="text-secondary text-center">No incoming requests</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incoming.map((r) => (
              <motion.div
                key={r._id || r.connId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 bg-card rounded-2xl shadow-md flex flex-col gap-2"
              >
                <p className="font-medium">{r.user?.name || "Unknown User"}</p>
                <p className="text-sm text-secondary">Sent you a request</p>
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-full hover:scale-105 transition"
                    onClick={() => handleAccept(r._id || r.connId)}
                  >
                    Accept
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-full hover:scale-105 transition"
                    onClick={() => handleReject(r._id || r.connId)}
                  >
                    Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case "friends":
        return friends.length === 0 ? (
          <p className="text-secondary text-center">No friends yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friends.map((f) => (
              <motion.div
                key={f._id || f.connId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 bg-card rounded-2xl shadow-md flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{f.user?.name || "Unknown"}</p>
                  <p className="text-sm text-secondary">Connected</p>
                </div>
                <button
                  className="text-red-500 text-sm hover:underline"
                  onClick={() => handleRemove(f._id || f.connId)}
                >
                  Remove
                </button>
              </motion.div>
            ))}
          </div>
        );

      case "suggestions":
        return suggestions.length === 0 ? (
          <p className="text-secondary text-center">No suggestions available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((u) => (
              <motion.div
                key={u._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 bg-card rounded-2xl shadow-md flex items-center justify-between gap-4"
              >
                <UserCircle className="w-16 h-16 text-accent" />
                <div className="flex-1">
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-secondary">
                    {u.batch || u.year || "Unknown"}
                  </p>
                </div>
                <button
                  className="px-4 py-2 bg-accent text-white rounded-full hover:scale-105 transition"
                  onClick={() => handleConnect(u)}
                >
                  Connect
                </button>
              </motion.div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="min-h-screen bg-background text-foreground flex flex-col pt-6 md:pt-12 px-6">
      <div className="flex items-center gap-3 justify-center mb-6">
        <Network className="w-7 h-7 text-accent" />
        <h1 className="text-2xl font-bold">My Network</h1>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-6">
        {[
          { key: "requests", label: "Requests", icon: UserPlus },
          { key: "friends", label: "Friends", icon: UserCheck },
          { key: "suggestions", label: "Suggestions", icon: Users },
        ].map((tab) => {
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
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">{renderTab()}</AnimatePresence>
    </section>
  );
}
