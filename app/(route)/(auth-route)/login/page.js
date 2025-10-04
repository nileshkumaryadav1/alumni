"use client";

import { useState } from "react";
import LoginPageComp from "@/components/auth/LoginPageComp";
import AdminLoginPageComp from "@/components/auth/AdminLoginPageComp";

export default function LoginPage() {
  const [isAdminLoginTab, setIsAdminLoginTab] = useState(false);

  const btnBase =
    "w-1/2 px-4 py-2 font-medium border border-border rounded-full transition-all duration-200";
  const btnActive = "bg-accent text-white shadow-md";
  const btnInactive =
    "bg-card text-foreground hover:bg-muted hover:text-accent";

  return (
    <section className="py-8 px-4 flex flex-col items-center">
      {/* Tabs */}
      <div className="flex w-full max-w-md gap-2 mb-6 bg-muted/30 p-2 rounded-full shadow-inner">
        <button
          onClick={() => setIsAdminLoginTab(false)}
          className={`${btnBase} ${
            !isAdminLoginTab ? btnActive : btnInactive
          }`}
        >
          Alumni / Student Login
        </button>

        <button
          onClick={() => setIsAdminLoginTab(true)}
          className={`${btnBase} ${
            isAdminLoginTab ? btnActive : btnInactive
          }`}
        >
          Administration Login
        </button>
      </div>

      {/* Render correct tab */}
      <div className="w-full max-w-xl">
        {isAdminLoginTab ? <AdminLoginPageComp /> : <LoginPageComp />}
      </div>
    </section>
  );
}
