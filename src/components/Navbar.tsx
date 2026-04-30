
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, LogOut, ShieldCheck, Sparkles, Menu, X } from "lucide-react";
import { useUser, useAuth, initiateSignOut, useDoc, useMemoFirebase, useFirestore } from "@/firebase";
import Image from "next/image";
import { doc } from "firebase/firestore";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 md:px-8 py-5 md:py-8",
          isScrolled || mobileMenuOpen ? "bg-black/95 backdrop-blur-xl py-5 border-b border-white/5" : "bg-transparent"
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

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-12">
            <div className="flex items-center gap-10">
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

          {/* Mobile Right Side: Profile + Hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              href={user ? "/profile" : "/auth"}
              className={cn(
                "px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border flex items-center gap-2",
                pathname === "/auth" || pathname === "/profile"
                  ? "bg-primary text-black border-primary"
                  : "bg-white/10 border-white/20 text-white"
              )}
            >
              {user ? <><User className="w-3 h-3" /> ME</> : "LOGIN"}
            </Link>
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-all duration-300",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          onClick={() => setMobileMenuOpen(false)}
        />
        {/* Menu Panel */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 bg-[#080808] border-b border-white/10 pt-24 pb-10 px-8 transition-transform duration-300",
            mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          )}
        >
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  )}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                  {link.name}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all",
                  pathname === "/admin"
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-primary/60 hover:text-primary hover:bg-white/5"
                )}
              >
                <ShieldCheck className="w-4 h-4" /> Admin Panel
              </Link>
            )}

            {user && (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all mt-4 border-t border-white/5 pt-6 w-full text-left"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
