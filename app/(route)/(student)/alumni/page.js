// "use client";

// import { motion } from "framer-motion";
// import { Users, Search, PlusCircle } from "lucide-react";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   UserCircle,
//   Mail,
//   Phone,
//   GraduationCap,
//   Calendar,
//   XCircle,
//   Linkedin,
// } from "lucide-react";

// export default function MainPage() {
//   const [users, setUsers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [enrollments, setEnrollments] = useState([]);
//   const [student, setStudent] = useState(null);

//   useEffect(() => {
//     const storedStudent = localStorage.getItem("student");
//     if (storedStudent) {
//       try {
//         const parsed = JSON.parse(storedStudent);
//         setStudent(parsed);
//       } catch (err) {
//         console.error("Invalid student data in localStorage", err);
//         localStorage.removeItem("student");
//       }
//     }
//   }, []);

//   useEffect(() => {
//     axios
//       .get("/api/admin/users")
//       .then((res) => setUsers(res.data))
//       .catch((err) => console.error("Error fetching users", err));

//     axios
//       .get("/api/admin/enrollments")
//       .then((res) => setEnrollments(res.data))
//       .catch((err) => console.error("Error fetching enrollments", err));
//   }, []);

//   const getUserEvents = (user) => {
//     return enrollments
//       .filter((enrollment) =>
//         enrollment.participants.some(
//           (p) => p._id === user._id || p.email === user.email
//         )
//       )
//       .map((enrollment) => enrollment.eventDetails?.name || "Unnamed Event");
//   };

//   if (!student) {
//     return (
//       <section className="flex min-h-screen py-12 flex-col items-center justify-center text-center px-6 bg-background text-foreground">
//         {/* Icon */}
//         <motion.div
//           initial={{ rotate: -45, opacity: 0 }}
//           animate={{ rotate: 0, opacity: 1 }}
//           transition={{ duration: 0.6 }}
//           className="mb-6"
//         >
//           <Users className="w-20 h-20 text-accent" />
//         </motion.div>

//         {/* Title */}
//         <motion.h1
//           initial={{ y: -30, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.6 }}
//           className="text-4xl sm:text-6xl font-bold"
//         >
//           Alumni Network
//         </motion.h1>

//         {/* Subtitle */}
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3, duration: 0.6 }}
//           className="mt-4 text-lg sm:text-xl text-secondary max-w-2xl"
//         >
//           Discover, connect, and collaborate with fellow alumni. Search
//           profiles, explore achievements, and grow together.
//         </motion.p>

//         {/* Actions */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6, duration: 0.6 }}
//           className="mt-8 flex flex-wrap justify-center gap-4"
//         >
//           <Link
//             href="/alumni"
//             className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-lg font-semibold text-background shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
//           >
//             <Search className="w-5 h-5" />
//             Find Alumni
//           </Link>

//           <Link
//             href="/register"
//             className="inline-flex items-center gap-2 rounded-xl border-2 border-accent px-6 py-3 text-lg font-semibold text-accent transition-transform hover:scale-105 hover:bg-accent hover:text-background"
//           >
//             <PlusCircle className="w-5 h-5" />
//             Add Profile
//           </Link>
//         </motion.div>
//       </section>
//     );
//   }

//   return (
//     <section className="flex min-h-screen py-12 flex-col items-center justify-center text-center px-6 bg-background text-foreground">
//       {student.role === "student" && (
//         <div className="max-w-7xl mx-auto md:p-6 p-4 bg-[color:var(--background)] text-[color:var(--foreground)]">
//           <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[color:var(--highlight)]">
//             Alumni List ({users.filter((u) => u.role === "alumni").length})
//           </h1>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {users
//               .filter((u) => u.role === "alumni")
//               .map((alumni) => (
//                 <div
//                   key={alumni._id}
//                   className="p-6 border border-[color:var(--border)] rounded-2xl shadow-md bg-[color:var(--card)] backdrop-blur-md hover:shadow-lg hover:scale-[1.02] transition-transform duration-300"
//                 >
//                   <div className="flex flex-col items-center mb-4">
//                     <UserCircle className="w-16 h-16 text-[color:var(--accent)] mb-2" />
//                     <h2 className="text-lg font-semibold text-[color:var(--foreground)] text-center">
//                       {alumni.name}
//                     </h2>
//                     <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700 uppercase">
//                       Alumni
//                     </div>
//                   </div>

//                   <div className="space-y-2 text-sm border-t border-[color:var(--border)] pt-3">
//                     <p className="flex items-center gap-2 text-[color:var(--secondary)]">
//                       <Mail className="w-4 h-4 text-[color:var(--highlight)]" />
//                       {alumni.email}
//                     </p>

//                     {alumni.phone && (
//                       <p className="flex items-center gap-2 text-[color:var(--secondary)]">
//                         <Phone className="w-4 h-4 text-[color:var(--highlight)]" />
//                         {alumni.phone}
//                       </p>
//                     )}

//                     {alumni.jobTitle && alumni.company && (
//                       <p className="flex items-center gap-2 text-[color:var(--secondary)]">
//                         <GraduationCap className="w-4 h-4 text-[color:var(--highlight)]" />
//                         {alumni.jobTitle} at {alumni.company} ({alumni.batch})
//                       </p>
//                     )}

//                     {alumni.linkedin && (
//                       <p className="text-xs text-[color:var(--accent)] hover:underline break-all">
//                         LinkedIn:{" "}
//                         <a
//                           href={alumni.linkedin}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           {alumni.linkedin}
//                         </a>
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto md:p-6 p-4 bg-[color:var(--background)] text-[color:var(--foreground)]">
//         {/* Header */}
//         <h1 className="md:text-3xl text-2xl font-bold text-center mb-8 text-[color:var(--highlight)]">
//           Registered Users ({users.length})
//         </h1>

//         {/* Search Bar */}
//         <div className="relative mb-8 max-w-md mx-auto">
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="🔍 Search by name, email..."
//             className="w-full px-4 py-2 rounded-xl border border-[color:var(--border)] bg-white/5 backdrop-blur placeholder:text-gray-400 text-sm focus:ring-2 focus:ring-[color:var(--accent)] transition"
//           />
//           {search && (
//             <button
//               onClick={() => setSearch("")}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[color:var(--accent)] transition"
//             >
//               <XCircle className="w-5 h-5" />
//             </button>
//           )}
//         </div>

//         {/* Users Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {users
//             .filter(
//               (user) =>
//                 user.name.toLowerCase().includes(search.toLowerCase()) ||
//                 user.email.toLowerCase().includes(search.toLowerCase())
//             )
//             .map((user) => {
//               const events = getUserEvents(user);

//               return (
//                 <div
//                   key={user._id}
//                   className="p-6 border border-[color:var(--border)] rounded-2xl shadow-md bg-[color:var(--card)] backdrop-blur-md hover:shadow-lg hover:scale-[1.02] transition-transform duration-300"
//                 >
//                   {/* User Header */}
//                   <div className="flex flex-col items-center mb-4">
//                     <UserCircle className="w-16 h-16 text-[color:var(--accent)] mb-2" />
//                     <h2 className="text-lg font-semibold text-[color:var(--foreground)] text-center">
//                       {user.name}
//                     </h2>
//                     <div
//                       className={`inline-block px-3 py-1 rounded-full text-sm font-semibold uppercase ${
//                         user.role === "student"
//                           ? "bg-blue-100 text-blue-700"
//                           : user.role === "alumni"
//                           ? "bg-green-100 text-green-700"
//                           : "bg-red-100 text-red-700"
//                       }`}
//                     >
//                       {user.role}
//                     </div>
//                   </div>

//                   {/* User Info */}
//                   <div className="space-y-2 text-sm border-t border-[color:var(--border)] pt-3">
//                     <p className="flex items-center gap-2 text-[color:var(--secondary)]">
//                       <Mail className="w-4 h-4 text-[color:var(--highlight)]" />
//                       <span>{user.email}</span>
//                     </p>
//                     {user.phone && (
//                       <p className="flex items-center gap-2 text-[color:var(--secondary)]">
//                         <Phone className="w-4 h-4 text-[color:var(--highlight)]" />
//                         <span>{user.phone}</span>
//                       </p>
//                     )}
//                     {(user.college || user.company) && (
//                       <p className="flex items-center gap-2 text-[color:var(--secondary)]">
//                         <GraduationCap className="w-4 h-4 text-[color:var(--highlight)]" />
//                         <span>
//                           {user.role === "student" && user.college}
//                           {user.role === "alumni" &&
//                             `${user.jobTitle} at ${user.company} (${user.batch})`}
//                         </span>
//                       </p>
//                     )}
//                     {user.linkedin && (
//                       <p className="text-xs text-[color:var(--accent)] hover:underline break-all flex items-center justify-center">
//                         <a
//                           href={user.linkedin}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           <Linkedin className="w-6 h-6" />
//                         </a>
//                       </p>
//                     )}
//                   </div>

//                   {/* Enrolled Events */}
//                   <div className="mt-5 border-t border-[color:var(--border)] pt-3">
//                     <p className="text-sm font-medium text-[color:var(--accent)] flex items-center gap-2 mb-2">
//                       <Calendar className="w-4 h-4" />
//                       Enrolled Events ({events.length})
//                     </p>
//                     {events.length > 0 ? (
//                       <div className="flex flex-wrap gap-2">
//                         {events.map((event, idx) => (
//                           <span
//                             key={idx}
//                             className="px-3 py-1 rounded-full text-xs bg-[color:var(--accent)]/10 text-[color:var(--accent)] border border-[color:var(--accent)]/30"
//                           >
//                             {event}
//                           </span>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="italic text-xs text-[color:var(--secondary)]">
//                         No events enrolled
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import {
  Users,
  Search,
  PlusCircle,
  UserCircle,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Linkedin,
} from "lucide-react";

export default function MainPage() {
  const [student, setStudent] = useState(null);
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [events, setEvents] = useState([]);
  const [fundraisers, setFundraisers] = useState([]);

  // Get logged-in student from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (stored) {
      try {
        setStudent(JSON.parse(stored));
      } catch (err) {
        console.error("Invalid student data", err);
        localStorage.removeItem("student");
      }
    }
  }, []);

  // Fetch data from APIs
  useEffect(() => {
    axios.get("/api/admin/users").then((res) => setUsers(res.data));
    axios.get("/api/admin/enrollments").then((res) => setEnrollments(res.data));
    axios.get("/api/achievements").then((res) => setAchievements(res.data));
    axios.get("/api/homepage").then((res) => setEvents(res.data.events));
    axios.get("/api/fundraisers").then((res) => setFundraisers(res.data));
  }, []);

  const getUserEvents = (user) => {
    return enrollments
      .filter((enrollment) =>
        enrollment.participants.some(
          (p) => p._id === user._id || p.email === user.email
        )
      )
      .map((enrollment) => enrollment.eventDetails?.name || "Unnamed Event");
  };

  /** ------------------- COMPONENTS ------------------- **/

  const HeroSection = () => (
    <section className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-blue-50 text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Users className="w-20 h-20 text-accent mx-auto mb-4" />
        <h1 className="text-4xl sm:text-6xl font-bold mb-4">
          {student ? `Welcome, ${student.name}!` : "Alumni & Student Network"}
        </h1>
        <p className="text-lg sm:text-xl text-secondary max-w-2xl mx-auto">
          {student
            ? "Connect, explore events, and see achievements in your community."
            : "Discover, connect, and collaborate with students and alumni. Join now!"}
        </p>

        {!student && (
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-lg font-semibold text-background shadow-lg hover:scale-105 transition"
            >
              <PlusCircle className="w-5 h-5" /> Register
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-accent px-6 py-3 text-lg font-semibold text-accent hover:bg-accent hover:text-background hover:scale-105 transition"
            >
              <Search className="w-5 h-5" /> Login
            </Link>
          </div>
        )}
      </motion.div>
    </section>
  );

  const AlumniCarousel = () => {
    const alumni = users.filter((u) => u.role === "alumni");
    const preview = student ? alumni : alumni.slice(0, 3);

    return (
      <section className="max-w-7xl mx-auto py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[color:var(--highlight)] text-center">
          Top Alumni
        </h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {preview.map((alumni) => (
            <div
              key={alumni._id}
              className="min-w-[220px] p-4 border border-[color:var(--border)] rounded-xl shadow-md bg-[color:var(--card)]"
            >
              <div className="flex flex-col items-center mb-4">
                <UserCircle className="w-16 h-16 text-[color:var(--accent)] mb-2" />
                <h3 className="font-semibold">{alumni.name}</h3>
                <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                  Alumni
                </span>
              </div>
              <p className="text-sm text-[color:var(--secondary)]">
                {alumni.jobTitle} at {alumni.company} ({alumni.batch})
              </p>
              {alumni.linkedin && (
                <p className="mt-2 text-xs text-[color:var(--accent)]">
                  <a
                    href={alumni.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
        {!student && (
          <p className="text-sm mt-2 text-center text-[color:var(--secondary)]">
            Login to see full alumni network.
          </p>
        )}
      </section>
    );
  };

  const EventsSection = () => {
    const previewEvents = student ? events : events.slice(0, 3);

    return (
      <section className="max-w-7xl mx-auto py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[color:var(--highlight)] text-center">
          Upcoming Events & Opportunities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewEvents.map((event) => (
            <div
              key={event._id}
              className="p-4 border border-[color:var(--border)] rounded-xl shadow-md bg-[color:var(--card)]"
            >
              <h3 className="font-semibold mb-2">{event.name}</h3>
              <p className="text-sm text-[color:var(--secondary)]">
                {event.category} - {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="mt-2 text-sm">{event.description}</p>
              {student && (
                <button className="mt-3 px-4 py-2 bg-accent text-background rounded-xl hover:scale-105 transition">
                  {event.registered ? "Registered" : "Register"}
                </button>
              )}
            </div>
          ))}
        </div>
        {!student && (
          <p className="text-sm mt-2 text-center text-[color:var(--secondary)]">
            Login to register and see all events.
          </p>
        )}
      </section>
    );
  };

  const AchievementsSection = () => {
    const previewAchievements = student
      ? achievements
      : achievements.slice(0, 4);

    return (
      <section className="max-w-7xl mx-auto py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[color:var(--highlight)]  text-center">
          Student & Alumni Achievements
        </h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {previewAchievements.map((ach) => (
            <div
              key={ach._id}
              className="min-w-[220px] p-4 border border-[color:var(--border)] rounded-xl shadow-md bg-[color:var(--card)]"
            >
              <h3 className="font-semibold mb-1">{ach.name}</h3>
              <p className="text-sm text-[color:var(--secondary)]">
                {ach.description}
              </p>
              <p className="text-xs mt-2 text-[color:var(--accent)]">
                {ach.year}
              </p>
            </div>
          ))}
        </div>
        {!student && (
          <p className="text-sm mt-2 text-center text-[color:var(--secondary)]">
            Register to showcase your achievements.
          </p>
        )}
      </section>
    );
  };

  const FundraisingSection = () => {
    const previewFundraisers = student ? fundraisers : fundraisers.slice(0, 3);

    return (
      <section className="max-w-7xl mx-auto py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[color:var(--highlight)] text-center">
          Community Fundraisers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewFundraisers.map((f) => (
            <div
              key={f._id}
              className="p-4 border border-[color:var(--border)] rounded-xl shadow-md bg-[color:var(--card)]"
            >
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm mt-1 text-[color:var(--secondary)]">
                {f.description}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-accent h-2 rounded-full"
                  style={{ width: `${(f.raised / f.target) * 100}%` }}
                />
              </div>
              <p className="text-xs mt-1 text-[color:var(--secondary)]">
                Raised: ${f.raised} / ${f.target}
              </p>
              {student && (
                <button className="mt-3 px-4 py-2 bg-accent text-background rounded-xl hover:scale-105 transition">
                  Contribute
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  /** ------------------- RENDER ------------------- **/
  return (
    <main className="bg-background text-foreground">
      <HeroSection />
      <AlumniCarousel />
      <EventsSection />
      <AchievementsSection />
      <FundraisingSection />
    </main>
  );
}
