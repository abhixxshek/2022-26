
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShieldCheck, History } from "lucide-react";
import { initiateEmailSignIn, initiateEmailSignUp } from "@/firebase/non-blocking-login";
import { useAuth, useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const JNVLogo = () => (
  <svg 
    viewBox="0 0 100 100" 
    className="w-16 h-16"
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1" />
    <path d="M50 75 L50 45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path 
      d="M50 45 C45 40 42 35 50 25 C58 35 55 40 50 45 Z" 
      fill="hsl(var(--primary))" 
    />
    <path d="M35 60 L50 65 L65 60 L65 75 L50 80 L35 75 Z" fill="currentColor" fillOpacity="0.1" />
  </svg>
);

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/profile");
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Weak Access Key",
        description: "Your password must be at least 6 characters long for archive security.",
      });
      return;
    }

    if (isLogin) {
      initiateEmailSignIn(auth, email, password);
    } else {
      initiateEmailSignUp(auth, email, password);
      toast({
        title: "Record Initialization Started",
        description: "Welcome. Your credentials are being committed. Next, complete your student profile.",
      });
    }
  };

  if (isUserLoading) return null;

  return (
    <div className="bg-[#020202] min-h-screen selection:bg-primary/20 text-foreground overflow-hidden">
      <Navbar />
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black to-transparent" />
      </div>

      <main className="relative z-10 pt-48 pb-40 px-6 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-16">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block p-6 rounded-full border border-white/5 bg-white/[0.02] mb-8 text-primary/80"
            >
              <JNVLogo />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-serif italic text-white mb-4 tracking-tight">
              {isLogin ? "Archive Portal" : "Student Enrollment"}
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
              Batch 2018 — 2025 Digital Records
            </p>
          </div>

          <Card className="bg-[#050505]/80 backdrop-blur-xl border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden rounded-[2.5rem]">
            <div className="h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            
            <CardContent className="px-10 py-16">
              <AnimatePresence mode="wait">
                <motion.form 
                  key={isLogin ? "login" : "signup"}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit} 
                  className="space-y-10"
                >
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 ml-1">Identity / Email</label>
                      <Input 
                        type="email" 
                        placeholder="name@alumni.jnv.com" 
                        className="bg-white/[0.03] border-white/10 h-16 focus:ring-primary/40 focus:border-primary/40 transition-all rounded-2xl px-6 text-sm placeholder:text-white/10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 ml-1">Access Key / Password</label>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="bg-white/[0.03] border-white/10 h-16 focus:ring-primary/40 focus:border-primary/40 transition-all rounded-2xl px-6 text-sm placeholder:text-white/10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button className="w-full bg-white text-black hover:bg-primary transition-all duration-500 rounded-full h-16 text-[10px] font-black uppercase tracking-[0.6em] shadow-xl group overflow-hidden relative">
                    <span className="relative z-10 flex items-center justify-center">
                      {isLogin ? "AUTHORIZE ACCESS" : "INITIALIZE RECORD"} 
                      <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </Button>

                  <div className="text-center pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="group inline-flex flex-col items-center gap-2"
                    >
                      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-primary transition-colors">
                        {isLogin ? "New Student? Enroll Here" : "Existing Record? Sign In"}
                      </span>
                      <div className="h-[1px] w-0 group-hover:w-full bg-primary transition-all duration-500" />
                    </button>
                  </div>
                </motion.form>
              </AnimatePresence>
            </CardContent>
          </Card>

          <div className="mt-16 flex items-center justify-center gap-12 text-white/10">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4" />
              <p className="text-[9px] font-black uppercase tracking-[0.4em]">Secure Archive</p>
            </div>
            <div className="w-[1px] h-4 bg-white/5" />
            <div className="flex items-center gap-3">
              <History className="w-4 h-4" />
              <p className="text-[9px] font-black uppercase tracking-[0.4em]">7 Year Legacy</p>
            </div>
          </div>
        </motion.div>
      </main>

      <div className="fixed bottom-12 right-12 pointer-events-none opacity-5">
        <p className="text-[12rem] font-black uppercase leading-none select-none">
          2018—25
        </p>
      </div>
    </div>
  );
}
