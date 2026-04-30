
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { useUser, useAuth, initiateSignOut, useDoc, useMemoFirebase, useFirestore } from "@/firebase";
import Image from "next/image";
import { doc } from "firebase/firestore";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
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
    router.push("/");
  };

  const navLinks = [
    { name: "The Journey", href: "/" },
    { name: "Yearbook", href: "/yearbook" },
    { name: "Media Vault", href: "/gallery" },
    { name: "The Wall", href: "/wall" },
  ];

  const isAdmin = studentData?.role === "admin";

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-8 py-8",
        isScrolled ? "bg-black/90 backdrop-blur-xl py-6 border-b border-white/5" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-8 h-8 flex items-center justify-center text-primary">
            <Sparkles className="w-full h-full" />
          </div>
          <span className="font-serif italic text-white text-lg tracking-tight">
            Batch '22
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
                  "text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                  pathname === "/admin" ? "text-primary" : "text-primary/60 hover:text-primary"
                )}
              >
                <ShieldCheck className="w-3 h-3" /> ADMIN
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={user ? "/profile" : "/auth"}
              className={cn(
                "px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2",
                pathname === "/auth" || pathname === "/profile"
                  ? "bg-primary text-black border-primary"
                  : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
              )}
            >
              {user ? (
                <>
                  <User className="w-3 h-3" /> PROFILE
                </>
              ) : "ARCHIVE ENTRY"}
            </Link>

            {user && (
              <button
                onClick={handleSignOut}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-destructive hover:border-destructive/40 transition-all"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
