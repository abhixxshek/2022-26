
"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth, useFirestore } from "@/firebase";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";
import { doc, getDoc, serverTimestamp } from "firebase/firestore";
import { Lock, Mail, User, ArrowRight, ShieldCheck } from "lucide-react";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function AuthPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();

  const STUDENT_KEY = "JNVRTM25";
  const ADMIN_KEY = "JNVRTM18";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedKey = accessKey.trim().toUpperCase();
    const isAdminEntry = formattedKey === ADMIN_KEY;
    const isStudentEntry = formattedKey === STUDENT_KEY;

    if (!isAdminEntry && !isStudentEntry) {
      toast({
        variant: "destructive",
        title: "Invalid Access Key",
        description: `Please use the official Batch '25 or Admin key.`,
      });
      return;
    }

    if (!name.trim() || !email.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Name and Email are required for the archive record.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, formattedKey);
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email') {
          userCredential = await createUserWithEmailAndPassword(auth, email, formattedKey);
          await updateProfile(userCredential.user, { displayName: name });
        } else {
          throw err;
        }
      }

      const studentRef = doc(db, "students", userCredential.user.uid);
      const studentDoc = await getDoc(studentRef);
      if (!studentDoc.exists()) {
        setDocumentNonBlocking(studentRef, {
          id: userCredential.user.uid,
          name: name,
          email: email,
          role: isAdminEntry ? "admin" : "student",
          house: "Aravalli", 
          shortBio: isAdminEntry ? "Archive Administrator" : "Member of Batch '25",
          batchId: "batch-2018-2025",
          createdAt: serverTimestamp(),
        }, { merge: true });
      }

      toast({
        title: isAdminEntry ? "Admin Authorized" : "Access Authorized",
        description: `Welcome to the Archive, ${name}.`,
      });
      
      router.push("/");
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
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-serif italic text-white mb-2">Archive Entry</h2>
              <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30">
                Official Batch '25 Digital Portal
              </p>
            </div>

            <div className="px-10 pb-16">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-primary ml-1 flex items-center gap-2">
                      <User className="w-3 h-3" /> Full Name
                    </label>
                    <input 
                      placeholder="Enter your name" 
                      className="w-full bg-white/[0.03] border border-white/10 h-14 rounded-2xl px-6 focus:outline-none focus:ring-1 focus:ring-primary/40 text-white placeholder:text-white/10"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-primary ml-1 flex items-center gap-2">
                      <Mail className="w-3 h-3" /> Institutional Email
                    </label>
                    <input 
                      type="email"
                      placeholder="email@example.com" 
                      className="w-full bg-white/[0.03] border border-white/10 h-14 rounded-2xl px-6 focus:outline-none focus:ring-1 focus:ring-primary/40 text-white placeholder:text-white/10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-primary ml-1 flex items-center gap-2">
                      <Lock className="w-3 h-3" /> Access Key
                    </label>
                    <input 
                      type="text"
                      placeholder="ENTER KEY" 
                      className="w-full bg-white/[0.03] border border-white/10 h-14 rounded-2xl px-6 focus:outline-none focus:ring-1 focus:ring-primary/40 text-white uppercase tracking-widest placeholder:text-white/10"
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
