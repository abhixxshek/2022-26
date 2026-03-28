
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // The admin dashboard is retired. Everyone has management access on main pages.
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
      Redirecting to Archive...
    </div>
  );
}
