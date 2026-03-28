
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useUser, useAuth, useDoc, useMemoFirebase, useFirestore } from "@/firebase";
import { initiateSignOut } from "@/firebase/non-blocking-login";
import { LogOut, ShieldCheck } from "lucide-react";
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
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();

  const studentRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "students", user.uid);
  }, [db, user]);

  const { data: studentData } = useDoc(studentRef);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    initiateSignOut(auth);
  };

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
            <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-primary border-b border-primary pb-1">
              The Journey
            </Link>
            <Link href="/yearbook" className="text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all">
              Yearbook
            </Link>
            <Link href="/gallery" className="text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all">
              Media Vault
            </Link>
            <Link href="/wall" className="text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all">
              The Wall
            </Link>
            {studentData?.role === "admin" && (
              <Link href="/admin" className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:scale-105 transition-all">
                <ShieldCheck className="w-3 h-3" /> Admin Panel
              </Link>
            )}
          </div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="px-8 py-2.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
                My Legacy
              </Link>
              <button 
                onClick={handleSignOut}
                className="p-2.5 text-white/40 hover:text-white transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/auth" className="px-8 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
              SIGN IN
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
