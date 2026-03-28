
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

const JNVLogo = () => (
  <svg 
    viewBox="0 0 100 100" 
    className="w-8 h-8 transition-transform group-hover:scale-110"
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1.5" />
    <path d="M50 75 L50 45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path 
      d="M50 45 C45 40 42 35 50 25 C58 35 55 40 50 45 Z" 
      fill="hsl(var(--primary))" 
    />
  </svg>
);

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const db = useFirestore();

  const studentRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "students", user.uid);
  }, [db, user]);

  const { data: studentData } = useDoc(studentRef);
  const isAdmin = studentData?.role === "admin";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "The Journey", href: "/" },
    { name: "Yearbook", href: "/yearbook" },
    { name: "Media Vault", href: "/gallery" },
    { name: "The Wall", href: "/wall" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-8 py-8",
        isScrolled ? "bg-black/90 backdrop-blur-xl py-6 border-b border-white/5" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="text-white">
            <JNVLogo />
          </div>
          <span className="font-serif italic text-white text-lg tracking-tight">
            Batch '25
          </span>
        </Link>

        <div className="flex items-center gap-12">
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-widest transition-all",
                    isActive 
                      ? "text-primary border-b border-primary pb-1" 
                      : "text-white/60 hover:text-white"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
            
            {isAdmin && (
              <Link 
                href="/admin" 
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all",
                  pathname === "/admin" ? "text-primary" : "text-primary/60"
                )}
              >
                <ShieldCheck className="w-3 h-3" /> Admin Panel
              </Link>
            )}
          </div>
          
          <Link 
            href="/auth" 
            className={cn(
              "px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
              pathname === "/auth" || pathname === "/profile"
                ? "bg-primary text-black border-primary" 
                : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
            )}
          >
            {user ? "PROFILE" : "ARCHIVE ENTRY"}
          </Link>
        </div>
      </div>
    </nav>
  );
}
