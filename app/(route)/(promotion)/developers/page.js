"use client";

import { motion } from "framer-motion";
import { Github, Globe, Linkedin } from "lucide-react";

// 🔹 Hardcoded developers data
const developersData = [
  {
    _id: 1,
    name: "Nilesh Kumar",
    role: "Full Stack Developer",
    bio: "Passionate about building scalable web apps with MERN stack.",
    image: "https://collegefinder.site/profile.jpg",
    github: "https://github.com/nileshkumaryadav1",
    linkedin: "https://linkedin.com/in/nileshkumaryadav1",
    portfolio: "https://nileshkumar.vercel.app",
  },
  {
    _id: 2,
    name: "Shivam Kumar",
    role: "UI/UX Designer",
    bio: "Designs sleek and user-friendly interfaces with a focus on accessibility.",
    // image: "https://i.pravatar.cc/150?img=2",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    portfolio: "https://example.com",
  },
  {
    _id: 3,
    name: "Muskan Kumari",
    role: "Backend Engineer",
    bio: "Loves working with APIs, databases, and system architecture.",
    // image: "https://i.pravatar.cc/150?img=3",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    portfolio: "https://example.com",
  },
  {
    _id: 4,
    name: "Jeevan Prem",
    role: "Frontend Developer",
    bio: "Creates engaging UIs using React, Next.js, and Tailwind.",
    // image: "https://i.pravatar.cc/150?img=4",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    portfolio: "https://example.com",
  },
  {
    _id: 5,
    name: "Anandita Kumari",
    role: "DevOps Engineer",
    bio: "Focuses on CI/CD pipelines, cloud deployment, and automation.",
    // image: "https://i.pravatar.cc/150?img=5",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    portfolio: "https://example.com",
  },
  {
    _id: 6,
    name: "Khushi Kumari",
    role: "Mobile App Developer",
    bio: "Building cross-platform apps with React Native and Expo.",
    // image: "https://i.pravatar.cc/150?img=6",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    portfolio: "https://example.com",
  },
];

export default function DevelopersPage() {
  return (
    <section className="py-16 px-6 sm:px-12 lg:px-24 bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-[color:var(--accent)] mb-10"
        >
          Meet Our Developers
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {developersData.map((developer, index) => (
            <motion.div
              key={developer._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <DeveloperCard {...developer} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeveloperCard({ name, role, bio, image, github, linkedin, portfolio }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="p-6 rounded-2xl bg-[color:var(--background)] shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[color:var(--border)]"
    >
      <img
        src={image}
        alt={name}
        className="w-28 h-28 rounded-full mx-auto border-4 border-[color:var(--accent)] object-cover"
      />
      <h3 className="text-xl font-semibold mt-4 text-[color:var(--foreground)]">
        {name}
      </h3>
      <p className="text-sm text-[color:var(--secondary)]">{role}</p>
      <p className="text-sm text-[color:var(--secondary)] mt-2">{bio}</p>
      <div className="mt-4 flex justify-center gap-4">
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[color:var(--highlight)] transition-colors"
        >
          <Github size={22} />
        </a>
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[color:var(--highlight)] transition-colors"
        >
          <Linkedin size={22} />
        </a>
        <a
          href={portfolio}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[color:var(--highlight)] transition-colors"
        >
          <Globe size={22} />
        </a>
      </div>
    </motion.div>
  );
}
