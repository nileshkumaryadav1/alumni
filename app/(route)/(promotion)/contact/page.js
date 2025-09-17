"use client";

import { useState } from "react";
import { Search, Users, HelpCircle } from "lucide-react";

export default function AlumniManagement() {
  const [alumniSearch, setAlumniSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [openFAQ, setOpenFAQ] = useState(null);

  const alumniList = [
    { name: "Nilesh Kumar", role: "Software Engineer", contact: "nilesh@alumni.com" },
    { name: "Shivam Kumar", role: "Product Designer", contact: "shivam@alumni.com" },
    { name: "Muskan Kumari", role: "Data Analyst", contact: "muskan@alumni.com" },
    { name: "Jeevan Prem", role: "Project Manager", contact: "jeevan@alumni.com" },
  ];

  const studentLeads = [
    { name: "Shivam Kumar", role: "Student Lead - CSE", contact: "shivam@college.com" },
    { name: "Nilesh Kumar", role: "Student Lead - CE", contact: "nilesh@college.com" },
    { name: "Muskan Kumari", role: "Student Lead - CSE", contact: "muskan@college.com" },
    { name: "Jeevan Prem", role: "Student Lead - CSE", contact: "jivan@college.com" },
  ];

  const faqs = [
    {
      q: "How can I connect with alumni?",
      a: "You can explore the Alumni Directory and filter by batch, company, or role to find the right connection.",
    },
    {
      q: "Can alumni mentor students?",
      a: "Yes, alumni can sign up as mentors and students can request guidance directly through the platform.",
    },
    {
      q: "Is the alumni network free to join?",
      a: "Yes, both alumni and students can join the network without any charges.",
    },
    {
      q: "Can students contact alumni directly?",
      a: "Yes, but only after alumni approve the request to connect. This ensures privacy and safety.",
    },
    {
      q: "How do I update my alumni profile?",
      a: "You can log in and navigate to the Profile section to edit your details anytime.",
    },
  ];

  return (
    <section className="py-16 px-6 sm:px-12 lg:px-24 bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-[color:var(--accent)] drop-shadow-lg">
            Alumni & Student Management
          </h1>
          <p className="text-base sm:text-lg text-[color:var(--secondary)] leading-relaxed">
            Browse alumni, connect with student leads, and get answers to your
            most common questions.
          </p>
        </div>

        {/* Alumni Directory */}
        <CardSection title="Alumni Directory" icon={<Users className="w-5 h-5" />}>
          <SearchBox value={alumniSearch} setValue={setAlumniSearch} placeholder="Search Alumni..." />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {alumniList
              .filter((a) => a.name.toLowerCase().includes(alumniSearch.toLowerCase()))
              .map((alumni, i) => (
                <MemberCard key={i} {...alumni} />
              ))}
          </div>
        </CardSection>

        {/* Student Leads */}
        <CardSection title="Student Leads" icon={<Users className="w-5 h-5" />}>
          <SearchBox value={studentSearch} setValue={setStudentSearch} placeholder="Search Student Leads..." />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {studentLeads
              .filter((s) => s.name.toLowerCase().includes(studentSearch.toLowerCase()))
              .map((student, i) => (
                <MemberCard key={i} {...student} />
              ))}
          </div>
        </CardSection>

        {/* FAQs */}
        <CardSection title="Frequently Asked Questions" icon={<HelpCircle className="w-5 h-5" />}>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-white/5 p-4 cursor-pointer transition hover:bg-white/10"
                onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
              >
                <h3 className="font-medium flex justify-between items-center">
                  {faq.q}
                  <span className="text-[color:var(--accent)]">{openFAQ === idx ? "−" : "+"}</span>
                </h3>
                {openFAQ === idx && (
                  <p className="mt-2 text-sm text-[color:var(--secondary)] leading-relaxed">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </CardSection>
      </div>
    </section>
  );
}

/* 🔹 Reusable Components */
function CardSection({ title, icon, children }) {
  return (
    <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2 text-[color:var(--accent)]">
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}

function MemberCard({ name, role, contact }) {
  return (
    <div className="rounded-xl p-4 bg-white/10 border border-white/20 shadow-md hover:scale-[1.02] transition transform duration-200">
      <h3 className="font-semibold text-[color:var(--foreground)]">{name}</h3>
      <p className="text-sm text-[color:var(--secondary)]">{role}</p>
      <p className="text-xs text-[color:var(--accent)] mt-1">{contact}</p>
    </div>
  );
}

function SearchBox({ value, setValue, placeholder }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/20 rounded-lg backdrop-blur-md">
      <Search className="w-4 h-4 text-[color:var(--secondary)]" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent outline-none w-full text-sm text-[color:var(--foreground)]"
      />
    </div>
  );
}
