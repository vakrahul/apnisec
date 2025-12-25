"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ServicesPage() {
  const router = useRouter();

  useEffect(() => {
    // 1. Check if the user has a token (same logic as your Navbar)
    const token = localStorage.getItem('token');

    if (token) {
      // 2. If logged in, go to Dashboard
      router.push("/dashboard");
    } else {
      // 3. If NOT logged in, go to Login
      router.push("/login");
    }
  }, [router]);

  // Loading state while redirecting
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-400">Checking access...</p>
    </div>
  );
}