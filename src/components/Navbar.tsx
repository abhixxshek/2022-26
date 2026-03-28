
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { BookOpen, Camera, Home, User } from "lucide-react";

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
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl group-hover:scale-110 transition-transform">
            N
          </div>
          <span className="font-headline font-bold text-lg tracking-tight hidden sm:block">
            NAVODAYA <span className="text-primary">MEMORIES</span>
          </span>
        </Link>

        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span className="hidden md:inline">Home</span>
          </Link>
          <Link href="/gallery" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
            <Camera className="w-4 h-4" />
            <span className="hidden md:inline">Gallery</span>
          </Link>
          <button className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all active:scale-95">
            Join the Journey
          </button>
        </div>
      </div>
    </nav>
  );
}
