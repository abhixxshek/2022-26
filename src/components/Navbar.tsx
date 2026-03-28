"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useUser } from "@/firebase";

const JNVLogo = () => (
  <svg 
    viewBox="0 0 100 100" 
    className="w-10 h-10 transition-transform group-hover:scale-110"
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1.5" />
    <path d="M50 75 L50 45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path 
      d="M50 45 C45 40 42 35 50 25 C58 35 55 40 50 45 Z" 
      fill="hsl(var(--primary))" 
    />
    <path d="M35 60 L50 65 L65 60 L65 75 L50 80 L35 75 Z" fill="currentColor" fillOpacity="0.1" />
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-8 py-10",
        isScrolled ? "bg-black/90 backdrop-blur-xl py-6 border-b border-white/5" : "bg-transparent"
      )}
    >
      <div className="max-w-[1800px] mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-5 group">
          <div className="text-white">
            <JNVLogo />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-black text-xs tracking-[0.5em] uppercase leading-none">
              JNV <span className="text-primary">MEMORIES</span>
            </span>
            <span className="text-[8px] font-bold tracking-[0.2em] text-white/30 uppercase mt-1">
              Once a Navodayan, Always a Navodayan
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-16">
          <Link href="/gallery" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-primary transition-all">
            Archive
          </Link>
          {user ? (
            <Link href="/profile" className="px-8 py-3 bg-white/5 hover:bg-white hover:text-black border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all">
              My Legacy
            </Link>
          ) : (
            <Link href="/auth" className="px-8 py-3 bg-white/5 hover:bg-white hover:text-black border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all">
              Portal Access
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
