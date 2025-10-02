import {
  GraduationCap,
  IdCard,
  Linkedin,
  Mail,
  Phone,
  UserCircle,
} from "lucide-react";
import React from "react";

export default function StudentCard({ user }) {
  return (
    <section>
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
            <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-6 h-6" />
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
