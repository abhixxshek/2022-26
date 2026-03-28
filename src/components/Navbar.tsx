"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Home, Camera, GraduationCap } from "lucide-react";

const JNVLogo = () => (
  <svg 
    viewBox="0 0 100 100" 
    className="w-10 h-10 transition-transform group-hover:scale-110"
    fill="currentColor"
  >
    <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" fill="none" stroke="currentColor" strokeWidth="4" />
    <path d="M50 20 L50 60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <circle cx="50" cy="15" r="5" className="fill-accent" />
    <path d="M30 45 Q50 35 70 45" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M30 55 Q50 45 70 55" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M30 65 Q50 55 70 65" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />
  </svg>
);

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

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
        <Link href="/" className="flex items-center gap-3 group">
          <div className="text-primary">
            <JNVLogo />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-lg tracking-tight leading-none">
              JNV <span className="text-primary">MEMORIES</span>
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              Pragati Shila
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span className="hidden md:inline">Campus</span>
          </Link>
          <Link href="/gallery" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
            <Camera className="w-4 h-4" />
            <span className="hidden md:inline">Moments</span>
          </Link>
          <button className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span className="hidden sm:inline">Alumni Portal</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
