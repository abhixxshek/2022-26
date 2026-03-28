"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, History } from "lucide-react";
import { initiateEmailSignIn, initiateEmailSignUp } from "@/firebase/non-blocking-login";
import { useAuth, useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const JNVLogo = () => (
  <svg 
    viewBox="0 0 100 100" 
    className="w-20 h-20"
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
    
    // Password strength validation
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "Your access key must be at least 6 characters long.",
      });
      return;
    }

    if (isLogin) {
      initiateEmailSignIn(auth, email, password);
    } else {
      initiateEmailSignUp(auth, email, password);
    }
  };

  if (isUserLoading) return null;

  return (
    <div className="bg-[#020202] min-h-screen selection:bg-primary/20">
      <Navbar />
      
      <main className="pt-48 pb-40 px-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="bg-[#050505] border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden rounded-[2.5rem]">
            <div className="h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            <CardHeader className="text-center pb-12 pt-16">
              <div className="flex justify-center mb-10">
                <div className="text-primary/80 animate-pulse">
                  <JNVLogo />
                </div>
              </div>
              <CardTitle className="text-4xl font-serif italic text-white tracking-tight">
                {isLogin ? "Welcome Back" : "Join the Archive"}
              </CardTitle>
              <CardDescription className="text-white/30 mt-4 text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed">
                {isLogin 
                  ? "SIGN IN TO MANAGE YOUR LEGACY." 
                  : "PRESERVE YOUR 7-YEAR JOURNEY FOREVER."}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-10 pb-16">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 ml-1">Identity / Email</label>
                  <Input 
                    type="email" 
                    placeholder="name@alumni.jnv.com" 
                    className="bg-white/[0.03] border-white/5 h-14 focus:ring-primary/40 focus:border-primary/40 transition-all rounded-2xl px-6 text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 ml-1">Access Key / Password</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="bg-white/[0.03] border-white/5 h-14 focus:ring-primary/40 focus:border-primary/40 transition-all rounded-2xl px-6 text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button className="w-full bg-white text-black hover:bg-primary transition-all duration-500 rounded-full h-16 text-[10px] font-black uppercase tracking-[0.6em] shadow-xl group">
                  {isLogin ? "AUTHORIZE" : "INITIALIZE"} 
                  <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </Button>

                <div className="text-center pt-8">
                  <button 
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-primary transition-colors underline-offset-8 decoration-white/10 hover:decoration-primary"
                  >
                    {isLogin ? "CREATE NEW STUDENT RECORD" : "ALREADY HAVE AN ARCHIVE ACCESS?"}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="text-center mt-12 flex items-center justify-center gap-4 text-white/10">
            <History className="w-4 h-4" />
            <p className="text-[9px] font-black uppercase tracking-[0.6em]">
              BATCH 2018 - 2025 PORTAL
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}