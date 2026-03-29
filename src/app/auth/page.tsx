
"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth, useFirestore } from "@/firebase";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { 
  signInAnonymously,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function AuthPage() {
  const [accessKey, setAccessKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();

  const STUDENT_KEY = "JNVRTM25";
  const ADMIN_KEY = "JNVRTM18";
  
  // Internal Admin Credential (Master Admin)
  const ADMIN_EMAIL = "primeparam07@gmail.com";
  const ADMIN_INTERNAL_PWD = "NAVODAYA_MASTER_ADMIN_SECRET_2025";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedKey = accessKey.trim().toUpperCase();

    if (formattedKey !== STUDENT_KEY && formattedKey !== ADMIN_KEY) {
      toast({
        variant: "destructive",
        title: "Invalid Access Key",
        description: "Please use the official Batch '25 or Admin key.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Sign out any existing session to prevent conflicts
      await signOut(auth);

      if (formattedKey === ADMIN_KEY) {
        // Admin: Sign in with fixed master account
        let userCredential;
        try {
          userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_INTERNAL_PWD);
        } catch (err: any) {
          // If the account doesn't exist, create it (first time setup)
          if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
            try {
              userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_INTERNAL_PWD);
            } catch (createErr: any) {
              if (createErr.code === 'auth/email-already-in-use') {
                // If it's already in use but we hit an error earlier, try one last sign-in
                // or surface the specific error.
                throw new Error("Administrative record conflict. Please contact support.");
              }
              throw createErr;
            }
          } else {
            throw err;
          }
        }

        const studentRef = doc(db, "students", userCredential.user.uid);
        await setDoc(studentRef, {
          id: userCredential.user.uid,
          name: "Master Admin",
          email: ADMIN_EMAIL,
          role: "admin",
          batchId: "batch-2018-2025",
          lastActive: serverTimestamp(),
        }, { merge: true });

        toast({
          title: "Administrative Access Authorized",
          description: "Welcome back to the Master Archive Control.",
        });
        router.push("/admin");
      } else {
        // Student: Anonymous Sign In
        const userCredential = await signInAnonymously(auth);
        
        const studentRef = doc(db, "students", userCredential.user.uid);
        await setDoc(studentRef, {
          id: userCredential.user.uid,
          role: "student",
          batchId: "batch-2018-2025",
          lastActive: serverTimestamp(),
        }, { merge: true });

        toast({
          title: "Archive Entry Authorized",
          description: "Welcome to the Batch '25 Archive.",
        });
        router.push("/profile");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Entry Failed",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen selection:bg-primary/20 text-foreground overflow-x-hidden">
      <Navbar />
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 pt-48 pb-40 px-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="bg-black/60 backdrop-blur-3xl border border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            
            <div className="pt-12 pb-8 text-center px-10">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                {accessKey.toUpperCase() === "JNVRTM18" ? <ShieldCheck className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
              </div>
              <h2 className="text-3xl font-serif italic text-white mb-2">
                {accessKey.toUpperCase() === "JNVRTM18" ? "Admin Access" : "Archive Entry"}
              </h2>
              <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30">
                Official Batch '25 Digital Portal
              </p>
            </div>

            <div className="px-10 pb-16">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-primary ml-1 flex items-center gap-2">
                      <Lock className="w-3 h-3" /> Access Key
                    </label>
                    <input 
                      type="text"
                      placeholder="ENTER KEY" 
                      className="w-full bg-white/[0.03] border border-white/10 h-16 rounded-2xl px-6 focus:outline-none focus:ring-1 focus:ring-primary/40 text-white uppercase tracking-[0.2em] placeholder:text-white/10 text-center"
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button 
                  disabled={isSubmitting}
                  className="w-full bg-white text-black hover:bg-primary transition-all duration-500 rounded-full h-16 text-[10px] font-black uppercase tracking-[0.4em] group overflow-hidden"
                >
                  <span className="flex items-center justify-center">
                    {isSubmitting ? "AUTHORIZING..." : "ENTER ARCHIVE"} 
                    {!isSubmitting && <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </span>
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
