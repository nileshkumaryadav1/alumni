// app/(route)/(admin)/admin/users/[id]/page.js
"use client";

import StudentCard from "@/components/dashboard/StudentCard";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminUserDetailsPage() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();

  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/users/${id}`);
        if (!response.ok) {
          throw new Error("User not found");
        }
        const data = await response.json();
        setStudentData(data.student);
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-accent text-lg">Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent/90 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <section className="max-w-xl mx-auto p-6 bg-card rounded-2xl shadow-lg mt-10">

      {/* Student Info */}
      <div className="flex flex-col items-center">
        <StudentCard user={studentData} />
      </div>

      {/* Students Career progess */}

      {/* Students Achievements */}

      {/* Mentorship */}

      {/* Events/workshops participation */}

      {/* Notes */}

      {/* Feedback */}
    </section>
  );
}
