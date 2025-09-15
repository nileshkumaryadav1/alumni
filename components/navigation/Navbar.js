"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, Menu, X, Home, Users, Search } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
    { href: "/alumni", label: "Alumni", icon: <Users className="w-5 h-5" /> },
    { href: "/alumni/search", label: "Search", icon: <Search className="w-5 h-5" /> },
  ];

  return (
    <nav className="w-full bg-background border-b border-color-border shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-accent">
          <GraduationCap className="w-7 h-7" />
          AlumniSystem
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1 text-foreground/80 hover:text-accent transition-colors"
            >
              {icon}
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-md text-foreground/80 hover:text-accent"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-background border-t border-color-border shadow-md">
          {links.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-foreground/80 hover:text-accent transition-colors"
            >
              {icon}
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
