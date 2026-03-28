"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Home, Camera, GraduationCap, User } from "lucide-react";
import { useUser } from "@/firebase";

const JNVLogo = () => (
  <svg 
    viewBox="0 0 100 100" 
    className="w-10 h-10 transition-transform group-hover:scale-110"
    fill="currentColor"
  >
    {/* Simplified official JNV logo representation */}
    <path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="50" cy="40" r="12" className="fill-primary" />
    <path d="M35 65 Q50 55 65 65" fill="none" stroke="currentColor" strokeWidth="3" />
    <path d="M30 75 Q50 65 70 75" fill="none" stroke="currentColor" strokeWidth="3" />
    <rect x="40" y="50" width="20" height="2" fill="currentColor" />
    <path d="M25 45 L35 45 M65 45 L75 45" stroke="currentColor" strokeWidth="1.5" />
    <path d="M50 25 V35" stroke="currentColor" strokeWidth="1" />
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
        <Link href="/" className="flex items-center gap-3 group">
          <div className="text-primary">
            <JNVLogo />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-lg tracking-tight leading-none">
              JNV <span className="text-primary">MEMORIES</span>
            </span>
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.15em] mt-1">
              Once a Navodayan, Always a Navodayan
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
          {user ? (
            <Link href="/profile" className="px-5 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-primary transition-all active:scale-95 flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">My Profile</span>
            </Link>
          ) : (
            <Link href="/auth" className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Join the Batch</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
