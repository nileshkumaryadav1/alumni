"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const defaultTips = [
  "Pro tip: Keep your alumni profile updated.",
  "Search alumni by name, batch, or company with /",
  "Connect with alumni on LinkedIn 🤝",
  "Add your current job title and company.",
  "Join upcoming alumni events 🎉",
  "Stay in touch with your batchmates.",
  "Share career opportunities with others 💼",
  "Explore the alumni directory 🔍",
  "Help juniors with mentorship 🙌",
  "Networking is key — reach out and grow 🚀",
];

export default function LoadingState({ text = "Loading…", tips }) {
  const activeTips = tips && tips.length > 0 ? tips : defaultTips;
  const [tipIndex, setTipIndex] = useState(0);

  // Rotate tips every 2.2s
  useEffect(() => {
    const id = setInterval(() => {
      setTipIndex((i) => (i + 1) % activeTips.length);
    }, 2200);
    return () => clearInterval(id);
  }, [activeTips]);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen">
      {/* Logo */}
      <Image
        src="/logo.png"
        alt="Loading"
        width={80}
        height={80}
        className="mb-4 rounded-full"
        priority
      />

      {/* Loading text */}
      <p className="text-lg font-medium">{text}</p>

      {/* Progress bar */}
      <div className="w-48 h-2 bg-gray-300 dark:bg-gray-700 rounded-full mt-4 overflow-hidden">
        <div className="h-full w-1/3 bg-cyan-500 animate-slide rounded-full" />
      </div>

      {/* Tips */}
      {activeTips.length > 0 && (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 text-center">
          {activeTips[tipIndex]}
        </p>
      )}

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(50%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-slide {
          animation: slide 1.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
