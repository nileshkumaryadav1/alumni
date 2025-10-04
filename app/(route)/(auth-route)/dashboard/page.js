"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Pencil, Trash2 } from "lucide-react";
import StudentInfo from "@/components/dashboard/StudentInfo";
import RegisteredForEvent from "@/components/dashboard/RegisteredForEvent";
import MentorshipPageComp from "@/components/mentorship/MentorshipPageComp";
import NetworkPageComp from "@/components/network/NetworkPageComp";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [student, setStudent] = useState(null);
  const [events, setEvents] = useState([]);
  const router = useRouter();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (!stored) {
      router.push("/login");
      return;
    }

    const student = JSON.parse(stored);

    // ✅ Validate student against DB
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        const exists = data.some((u) => u.email === student.email);

        if (exists) {
          setUsers(data);
        } else {
          // ❌ Student not in DB → logout
          localStorage.removeItem("student");
          router.push("/login");
        }
      })
      .catch((err) => {
        console.error("Error fetching users", err);
        setUsers([]);
      });

    try {
      const parsed = JSON.parse(stored);
      setStudent(parsed);

      fetch(`/api/student/${parsed._id}/events`)
        .then((res) => res.json())
        .then((data) => setEvents(data || []))
        .catch((err) => {
          console.error("Error fetching events", err);
          setEvents([]);
        });
    } catch (err) {
      console.error("Invalid student data", err);
      localStorage.removeItem("student");
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    if (!confirm("🔒 Are you sure you want to logout?")) return;
    toast.success("Logout successful.");
    localStorage.removeItem("student");
    router.replace("/login");
  };

  const handleDeleteAccount = async () => {
    if (!confirm("⚠️ This will permanently delete your account. Continue?"))
      return;
    if (!student?._id) return;

    try {
      const res = await fetch(`/api/student/${student._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        // alert("Account deleted.");
        toast("Account deleted.");
        localStorage.removeItem("student");
        router.push("/register");
      } else {
        // alert("Failed to delete account.");
        toast("Failed to delete account.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      // alert("An error occurred.");
      toast("An error occurred.");
    }
  };

  if (!student) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <p className="text-sm animate-pulse">Loading your dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8 md:px-12 bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[color:var(--foreground)] break-words">
              Welcome back, {student.name || student.email}
            </h1>
            <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
              Manage your profile, explore events, and stay connected.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 text-sm">
            <button
              onClick={() => router.push("/edit-profile")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition shadow-sm"
            >
              <Pencil size={16} /> Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-500 hover:bg-red-500/30 transition shadow-sm"
            >
              <LogOut size={16} /> Logout
            </button>
            <button
              onClick={handleDeleteAccount}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600/30 transition shadow-sm"
            >
              <Trash2 size={16} /> Delete Account
            </button>
          </div>
        </div>

        {/* Student Info */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-md">
          <StudentInfo student={student} />
        </section>

        {/* Registered Events */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Registered Events
          </h2>
          <RegisteredForEvent />
        </section>

        {/* Networking Section */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-md">
          <NetworkPageComp />
        </section>

        {/* Mentorship Section */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-md">
          <MentorshipPageComp />
        </section>
      </div>
    </main>
  );
}
