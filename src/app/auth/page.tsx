"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { initiateEmailSignIn, initiateEmailSignUp } from "@/firebase/non-blocking-login";
import { useAuth, useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const JNVLogo = () => (
  <svg 
    viewBox="0 0 100 100" 
    className="w-16 h-16"
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" />
    <path d="M50 75 L50 45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <path 
      d="M50 45 C45 40 42 35 50 25 C58 35 55 40 50 45 Z" 
      fill="hsl(var(--primary))" 
    />
    <path d="M35 60 L50 65 L65 60 L65 75 L50 80 L35 75 Z" fill="currentColor" fillOpacity="0.2" />
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
    if (isLogin) {
      initiateEmailSignIn(auth, email, password);
    } else {
      initiateEmailSignUp(auth, email, password);
    }
  };

  if (isUserLoading) return null;

  return (
    <div className="bg-[#050505] min-h-screen">
      <Navbar />
      
      <main className="pt-40 pb-32 px-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="glass border-white/10 shadow-2xl overflow-hidden">
            <div className="h-2 bg-primary" />
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-6">
                <div className="text-primary">
                  <JNVLogo />
                </div>
              </div>
              <CardTitle className="text-3xl font-headline font-black uppercase tracking-tight">
                {isLogin ? "Welcome Back" : "Join the Batch"}
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2 font-body font-light">
                {isLogin 
                  ? "Sign in to manage your memories and profile." 
                  : "Register to preserve your Navodaya journey forever."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">JNV Alumni Email</label>
                  <Input 
                    type="email" 
                    placeholder="name@alumni.jnv.com" 
                    className="bg-white/5 border-white/10 h-12 focus:ring-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="bg-white/5 border-white/10 h-12 focus:ring-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button className="w-full bg-primary text-black font-black uppercase tracking-widest py-7 group hover:bg-white transition-all">
                  {isLogin ? "Sign In" : "Register"} 
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                <div className="text-center pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                  >
                    {isLogin ? "Create a new account" : "Already have an account? Sign In"}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
          <p className="text-center mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
            Once a Navodayan, Always a Navodayan
          </p>
        </motion.div>
      </main>
    </div>
  );
}
