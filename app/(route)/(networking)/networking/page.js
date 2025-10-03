"use client";

import { useState } from "react";
import MentorshipPageComp from "@/components/mentorship/MentorshipPageComp";
import NetworkPageComp from "@/components/network/NetworkPageComp";

export default function CombinedPageForEvents() {
  const [isMentorshipTab, setIsMentorshipTab] = useState(false);

  const btnStyle = (active) =>
    `p-2 border border-border rounded-full w-1/2 transition-colors duration-200 ${
      active ? "bg-accent text-white" : "hover:bg-muted hover:text-accent"
    }`;

  return (
    <section className="max-w-7xl py-6">
      {/* Tabs */}
      <div className="flex w-full justify-center px-2 gap-1">
        <button
          className={btnStyle(!isMentorshipTab)}
          onClick={() => setIsMentorshipTab(false)}
        >
          Networking
        </button>
        <button
          className={btnStyle(isMentorshipTab)}
          onClick={() => setIsMentorshipTab(true)}
        >
          Mentorship
        </button>
      </div>

      {/* Content */}
      <div>
        {isMentorshipTab ? (
          <div className="px-2 mt-2">
            <MentorshipPageComp />
          </div>
        ) : (
          <div className="px-2 mt-2">
            <NetworkPageComp />
          </div>
        )}
      </div>
    </section>
  );
}
