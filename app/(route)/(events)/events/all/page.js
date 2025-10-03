"use client";

import { useState } from "react";
import EventListPage from "../page";
import RegisteredForEvent from "@/components/dashboard/RegisteredForEvent";

export default function CombinedPageForEvents() {
  const [isRegisteredTab, setIsRegisteredTab] = useState(false);

  const btnStyle = (active) =>
    `p-2 border border-border rounded-full w-1/2 transition-colors duration-200 ${
      active ? "bg-accent text-white" : "hover:bg-muted hover:text-accent"
    }`;

  return (
    <section className="max-w-7xl py-6">
      {/* Tabs */}
      <div className="flex w-full justify-center px-2 gap-1">
        <button
          className={btnStyle(!isRegisteredTab)}
          onClick={() => setIsRegisteredTab(false)}
        >
          All Events
        </button>
        <button
          className={btnStyle(isRegisteredTab)}
          onClick={() => setIsRegisteredTab(true)}
        >
          Registered Events
        </button>
      </div>

      {/* Content */}
      <div>
        {isRegisteredTab ? (
          <div className="px-2 mt-2">
            <RegisteredForEvent />
          </div>
        ) : (
          <EventListPage />
        )}
      </div>
    </section>
  );
}
