"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Home, Camera, GraduationCap, User } from "lucide-react";
import { useUser } from "@/firebase";

const JNVLogo = () => (
  <svg 
    viewBox="0 0 100 100" 
    className="w-12 h-12 transition-transform group-hover:scale-110"
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" />
    <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
    {/* Torch handle */}
    <path d="M50 75 L50 45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    {/* Flame */}
    <path 
      d="M50 45 C45 40 42 35 50 25 C58 35 55 40 50 45 Z" 
      fill="hsl(var(--primary))" 
      className="animate-pulse"
    />
    {/* Book */}
    <path d="M35 60 L50 65 L65 60 L65 75 L50 80 L35 75 Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M35 60 L50 65 L65 60" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M35 75 L50 80 L65 75" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M50 65 L50 80" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "glass py-2" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="text-primary">
            <JNVLogo />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-black text-xl tracking-tighter leading-none uppercase">
              JNV <span className="text-primary">MEMORIES</span>
            </span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">
              Once a Navodayan, Always a Navodayan
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="text-xs font-black uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span className="hidden md:inline">Campus</span>
          </Link>
          <Link href="/gallery" className="text-xs font-black uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
            <Camera className="w-4 h-4" />
            <span className="hidden md:inline">Moments</span>
          </Link>
          {user ? (
            <Link href="/profile" className="px-6 py-3 rounded-full bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95 flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">My Legacy</span>
            </Link>
          ) : (
            <Link href="/auth" className="px-6 py-3 rounded-full bg-primary text-black text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Join the Batch</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
