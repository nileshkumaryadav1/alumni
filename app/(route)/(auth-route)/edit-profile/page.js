"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    _id: "",
    role: "student",
    name: "",
    email: "",
    phone: "",
    college: "",
    year: "",
    branch: "",
    batch: "",
    jobTitle: "",
    company: "",
    linkedin: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("student"));
    if (!stored) {
      router.push("/login");
      return;
    }
    setFormData({
      _id: stored._id || "",
      role: stored.role || "student",
      name: stored.name || "",
      email: stored.email || "",
      phone: stored.phone || "",
      college: stored.college || "",
      year: stored.year || "",
      branch: stored.branch || "",
      batch: stored.batch || "",
      jobTitle: stored.jobTitle || "",
      company: stored.company || "",
      linkedin: stored.linkedin || "",
    });
    setLoading(false);
  }, [router]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/student/${formData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Profile updated successfully!");
        localStorage.setItem("student", JSON.stringify(data.student));
        router.push("/dashboard");
      } else {
        setMessage("❌ Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ An error occurred while updating profile.");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto my-10 p-6 bg-[var(--card)] rounded-xl shadow-xl mt-20 border border-[color:var(--border)]">
      <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-2 gap-4">
        <div>
          <p>ID: {formData._id}</p>
        </div>

        <div>
          <label className="block mb-1 font-medium">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-[var(--background)]"
          >
            <option value="student">Student</option>
            <option value="alumni">Alumni</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-[var(--background)]"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            className="w-full p-2 rounded border bg-[var(--background)]"
            disabled
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            type="tel"
            className="w-full p-2 rounded border bg-[var(--background)]"
            required
          />
        </div>

        {/* Student-specific fields */}
        {formData.role === "student" && (
          <>
            <div>
              <label className="block mb-1 font-medium">College</label>
              <input
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="w-full p-2 rounded border bg-[var(--background)]"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Year</label>
              <input
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full p-2 rounded border bg-[var(--background)]"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Branch</label>
              <input
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full p-2 rounded border bg-[var(--background)]"
                required
              />
            </div>
          </>
        )}

        {/* Alumni-specific fields */}
        {formData.role === "alumni" && (
          <>
            <div>
              <label className="block mb-1 font-medium">Batch</label>
              <input
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className="w-full p-2 rounded border bg-[var(--background)]"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Job Title</label>
              <input
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="w-full p-2 rounded border bg-[var(--background)]"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Company</label>
              <input
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full p-2 rounded border bg-[var(--background)]"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">LinkedIn</label>
              <input
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full p-2 rounded border bg-[var(--background)]"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="px-4 py-2 rounded bg-[var(--accent)] text-white font-semibold hover:opacity-90"
        >
          Save Changes
        </button>
      </form>

      {message && (
        <p
          className={`mb-4 text-sm ${
            message.startsWith("✅") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
