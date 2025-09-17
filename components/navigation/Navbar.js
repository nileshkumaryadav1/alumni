"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Menu, X, ChevronDown, PersonStandingIcon } from "lucide-react";

// Import icons
import {
  FaCalendarAlt,
  FaClock,
  FaCode,
  FaHistory,
  FaHome,
  FaInfoCircle,
  FaListAlt,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { MdDashboard, MdPerson } from "react-icons/md";

const navLinks = [
  {
    href: "/",
    label: "Home",
    icon: <FaHome className="text-[color:var(--accent)]" />,
  },
  {
    href: "/alumni",
    label: "Alumni",
    icon: <MdPerson className="text-[color:var(--accent)]" />,
  },
  {
    label: "Events",
    icon: <FaCalendarAlt className="text-[color:var(--accent)]" />,
    items: [
      {
        href: "/events",
        label: "All Events",
        icon: <FaListAlt className="text-sm" />,
      },
      {
        href: "/events/upcoming/events",
        label: "Upcoming Events",
        icon: <FaClock className="text-sm" />,
      },
      {
        href: "/events/past/events",
        label: "Past Events",
        icon: <FaHistory className="text-sm" />,
      },
      {
        href: "/events/registered",
        label: "Regd Events/Workshop",
        icon: <FaUsers className="text-sm" />,
      },
      {
        href: "/schedule",
        label: "Schedule",
        icon: <FaCalendarAlt className="text-sm" />,
      },
    ],
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <MdDashboard className="text-[color:var(--accent)]" />,
  },
  {
    label: "Management",
    icon: <FaUsers className="text-[color:var(--accent)]" />,
    items: [
      {
        href: "/contact",
        label: "Organizers",
        icon: <FaUser className="text-sm" />,
      },
      {
        href: "/coordinators",
        label: "Coordinators",
        icon: <FaUser className="text-sm" />,
      },
      {
        href: "/about",
        label: "About Alumni",
        icon: <FaInfoCircle className="text-sm" />,
      },
      {
        href: "/developers",
        label: "Developers",
        icon: <FaCode className="text-sm" />,
      },
    ],
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-[color:var(--background)]/70 border-b border-[color:var(--border)] shadow-md">
      <div className="flex justify-between items-center mx-auto max-w-6xl px-5 md:px-10 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-[color:var(--accent)]"
        >
          <GraduationCap className="w-7 h-7" />
          AlumniSystem
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) =>
            link.items ? (
              <div
                key={link.label}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    pathname.includes(link.label.toLowerCase())
                      ? "text-[color:var(--accent)]"
                      : "text-[color:var(--secondary)] group-hover:text-[color:var(--accent)]"
                  }`}
                >
                  {link.icon} {link.label}
                  <ChevronDown size={14} />
                </button>

                <AnimatePresence>
                  {openDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 w-56 bg-[color:var(--background)]/95 backdrop-blur-xl border border-[color:var(--border)] rounded-xl shadow-lg py-3"
                    >
                      {link.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-2 px-5 py-2 text-sm rounded-md transition ${
                            pathname === item.href
                              ? "bg-[color:var(--accent)] text-[color:var(--background)]"
                              : "text-[color:var(--secondary)] hover:bg-[color:var(--accent)] hover:text-[color:var(--background)]"
                          }`}
                        >
                          {item.icon} {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition ${
                  pathname === link.href
                    ? "text-[color:var(--accent)]"
                    : "text-[color:var(--secondary)] hover:text-[color:var(--accent)]"
                }`}
              >
                {link.icon} {link.label}
              </Link>
            )
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          aria-label="Toggle menu"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[color:var(--accent)]"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-50 h-screen w-screen bg-[color:var(--background)]/95 backdrop-blur-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border)]">
              <span className="text-lg font-bold text-[color:var(--accent)]">
                AlumniSystem
              </span>
              <button
                aria-label="Close menu"
                onClick={() => setIsOpen(false)}
                className="text-[color:var(--accent)]"
              >
                <X size={30} />
              </button>
            </div>

            {/* Scrollable Links */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {navLinks.map((link) =>
                link.items ? (
                  <div key={link.label}>
                    <button
                      onClick={() =>
                        setOpenMobileDropdown(
                          openMobileDropdown === link.label ? null : link.label
                        )
                      }
                      className="flex justify-between items-center w-full px-4 py-3 rounded-lg text-lg font-medium text-[color:var(--secondary)] hover:bg-[color:var(--accent)]/20 transition"
                    >
                      <span className="flex items-center gap-2">
                        {link.icon} {link.label}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${
                          openMobileDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {openMobileDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-2 ml-6 space-y-2"
                        >
                          {link.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-md text-base transition ${
                                pathname === item.href
                                  ? "bg-[color:var(--accent)] text-[color:var(--background)]"
                                  : "text-[color:var(--secondary)] hover:bg-[color:var(--accent)] hover:text-[color:var(--background)]"
                              }`}
                            >
                              {item.icon} {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-md text-lg transition ${
                      pathname === link.href
                        ? "bg-[color:var(--accent)] text-[color:var(--background)]"
                        : "text-[color:var(--secondary)] hover:bg-[color:var(--accent)] hover:text-[color:var(--background)]"
                    }`}
                  >
                    {link.icon} {link.label}
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
