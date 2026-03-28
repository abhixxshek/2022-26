
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Mail, 
  CheckCircle2, 
  Info,
  ExternalLink,
  Copy,
  Check,
  Sparkles
} from "lucide-react";
import { initiateEmailSignIn, initiateEmailSignUp, initiateGoogleSignIn } from "@/firebase/non-blocking-login";
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

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const BATCH_ACCESS_KEY = "JNVRTM25";

  useEffect(() => {
    if (user) {
      router.push("/profile");
    }
  }, [user, router]);

  const applyBatchKey = () => {
    setPassword(BATCH_ACCESS_KEY);
    toast({
      title: "Batch Key Applied",
      description: "The official Batch '25 Access Key has been set.",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast({
      title: "Copied",
      description: "Access Key copied to clipboard.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && !agreeToTerms) {
      toast({
        variant: "destructive",
        title: "Consent Required",
        description: "Please agree to the Digital Archive terms to proceed.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLogin) {
        initiateEmailSignIn(auth, email, password);
      } else {
        initiateEmailSignUp(auth, email, password);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    initiateGoogleSignIn(auth);
  };

  if (isUserLoading) return null;

  return (
    <div className="bg-[#020202] min-h-screen selection:bg-primary/20 text-foreground overflow-x-hidden">
      <Navbar />
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black to-transparent" />
      </div>

      <main className="relative z-10 pt-48 pb-40 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          {/* Brand & Details Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block space-y-16"
          >
            <div>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block p-6 rounded-3xl border border-white/5 bg-white/[0.02] mb-12 text-primary"
              >
                <JNVLogo />
              </motion.div>
              <h1 className="text-7xl font-serif italic text-white mb-8 tracking-tighter leading-none">
                Once a Navodayan,<br />
                Always a <span className="text-primary not-italic font-black uppercase">Navodayan.</span>
              </h1>
              <p className="text-white/40 text-lg font-light leading-relaxed max-w-lg font-serif italic">
                The secure digital legacy for JNV Kalukheda (Batch of 2018—2025). Access your archive record with your official email and the batch access key.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-primary/40 transition-all text-primary">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80 mb-2">Standardized Key</h3>
                  <p className="text-[11px] text-white/30 uppercase font-black tracking-widest leading-relaxed">Use the official batch key "{BATCH_ACCESS_KEY}" for instant identification.</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-primary/40 transition-all text-primary">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80 mb-2">Identity Vault</h3>
                  <p className="text-[11px] text-white/30 uppercase font-black tracking-widest leading-relaxed">Your data is stored in the Batch '25 vault, protected by Firebase security.</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-primary/40 transition-all text-primary">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80 mb-2">Verified Bonding</h3>
                  <p className="text-[11px] text-white/30 uppercase font-black tracking-widest leading-relaxed">Connect with verified alumni and rediscover the magic of JNV life.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Auth Form Column */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="lg:hidden text-center mb-16">
              <JNVLogo />
              <h1 className="text-4xl font-serif italic text-white mt-8">{isLogin ? "Archive Portal" : "Student Enrollment"}</h1>
            </div>

            <Card className="bg-[#050505]/80 backdrop-blur-3xl border-white/5 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8)] overflow-hidden rounded-[3rem]">
              <div className="h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              
              <CardContent className="px-12 py-20">
                <div className="space-y-12">
                  <div className="space-y-6">
                    <Button 
                      onClick={handleGoogleSignIn}
                      className="w-full bg-white text-black hover:bg-primary transition-all duration-500 rounded-2xl h-16 text-[10px] font-black uppercase tracking-[0.4em] group"
                    >
                      <GoogleIcon />
                      Continue with Google
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/5"></span>
                      </div>
                      <div className="relative flex justify-center text-[9px] uppercase font-black tracking-widest">
                        <span className="bg-[#050505] px-6 text-white/20">or use access key</span>
                      </div>
                    </div>
                  </div>

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
                          <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary ml-1 flex items-center gap-2">
                            <Mail className="w-3 h-3" /> Identity / Email
                          </label>
                          <Input 
                            type="email" 
                            placeholder="name@alumni.jnv.com" 
                            className="bg-white/[0.03] border-white/10 h-16 focus:ring-primary/40 focus:border-primary/40 transition-all rounded-2xl px-6 text-sm placeholder:text-white/10 text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between ml-1">
                            <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-2">
                              <Lock className="w-3 h-3" /> Access Key
                            </label>
                            <button 
                              type="button" 
                              onClick={applyBatchKey}
                              className="text-[8px] font-black uppercase tracking-widest text-white/30 hover:text-primary transition-colors flex items-center gap-1.5"
                            >
                              <Sparkles className="w-2.5 h-2.5" /> Apply "{BATCH_ACCESS_KEY}"
                            </button>
                          </div>
                          <div className="relative">
                            <Input 
                              type={isLogin ? "password" : "text"} 
                              placeholder="••••••••" 
                              className="bg-white/[0.03] border-white/10 h-16 focus:ring-primary/40 focus:border-primary/40 transition-all rounded-2xl px-6 text-sm placeholder:text-white/10 text-white pr-24"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                            {password && (
                              <button 
                                type="button"
                                onClick={copyToClipboard}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-primary transition-colors"
                              >
                                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </button>
                            )}
                          </div>
                          <p className="text-[8px] text-white/20 uppercase font-black tracking-widest ml-1">
                            {isLogin ? "* Use your registered archive access key." : `* Recommended key: ${BATCH_ACCESS_KEY} for all students.`}
                          </p>
                        </div>

                        {!isLogin && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="flex items-start space-x-4 p-6 bg-primary/5 border border-primary/10 rounded-2xl"
                          >
                            <Checkbox 
                              id="terms" 
                              checked={agreeToTerms} 
                              onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
                              className="mt-1 border-primary data-[state=checked]:bg-primary"
                            />
                            <div className="grid gap-1.5 leading-none">
                              <label htmlFor="terms" className="text-[10px] font-black uppercase tracking-widest text-white/60 cursor-pointer">
                                I agree to the Digital Archive Terms
                              </label>
                              <p className="text-[9px] text-white/30 uppercase font-bold tracking-tighter">
                                I am a member of Batch '25 and agree to share my public profile in the archive.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="space-y-6">
                        <Button 
                          disabled={isSubmitting}
                          className="w-full bg-white text-black hover:bg-primary transition-all duration-500 rounded-full h-16 text-[10px] font-black uppercase tracking-[0.6em] shadow-xl group overflow-hidden relative"
                        >
                          <span className="relative z-10 flex items-center justify-center">
                            {isLogin ? "AUTHORIZE ACCESS" : "INITIALIZE RECORD"} 
                            <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                          </span>
                        </Button>

                        <div className="flex flex-col items-center gap-6">
                          <button 
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="group inline-flex flex-col items-center gap-2"
                          >
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 group-hover:text-primary transition-colors">
                              {isLogin ? "New Student? Enroll Here" : "Existing Record? Sign In"}
                            </span>
                            <div className="h-[1px] w-0 group-hover:w-full bg-primary transition-all duration-500" />
                          </button>

                          {isLogin && (
                            <button type="button" className="text-[8px] font-black uppercase tracking-[0.5em] text-white/10 hover:text-white transition-colors flex items-center gap-2">
                              <Info className="w-3 h-3" /> Help with Access
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.form>
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            <div className="mt-12 text-center">
              <p className="text-[8px] font-black uppercase tracking-[0.6em] text-white/10 flex items-center justify-center gap-3">
                <ShieldCheck className="w-3 h-3" /> Official Batch '25 Legacy Record <ExternalLink className="w-2 h-2" />
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <div className="fixed bottom-12 right-12 pointer-events-none opacity-5 hidden lg:block">
        <p className="text-[12rem] font-black uppercase leading-none select-none">
          2018—25
        </p>
      </div>
    </div>
  );
}
