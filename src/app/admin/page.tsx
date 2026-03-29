
"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection, initiateSignOut, useAuth } from "@/firebase";
import { doc, collection, query } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Image as ImageIcon, 
  MessageSquare, 
  ShieldCheck, 
  LogOut,
  ChevronRight,
  Database,
  Trash2,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();

  const studentRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "students", user.uid);
  }, [db, user]);

  const { data: studentData, isLoading: isDocLoading } = useDoc(studentRef);

  // Archive Statistics
  const studentsQuery = useMemoFirebase(() => db ? query(collection(db, "students")) : null, [db]);
  const photosQuery = useMemoFirebase(() => db ? query(collection(db, "photos")) : null, [db]);
  const memoriesQuery = useMemoFirebase(() => db ? query(collection(db, "memories")) : null, [db]);

  const { data: students } = useCollection(studentsQuery);
  const { data: photos } = useCollection(photosQuery);
  const { data: memories } = useCollection(memoriesQuery);

  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace("/auth");
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    // Wait for both user session and profile document to finish loading
    if (!isUserLoading && !isDocLoading) {
      if (studentData && studentData.role === "admin") {
        setIsAuthorized(true);
      } else {
        // If data is fully loaded and no admin role is found, deny access
        setIsAuthorized(false);
        if (user) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "Master administrative credentials are required for this portal.",
          });
        }
        router.replace("/");
      }
    }
  }, [studentData, isUserLoading, isDocLoading, user, router]);

  const handleSignOut = () => {
    initiateSignOut(auth);
    router.push("/");
  };

  if (isUserLoading || isDocLoading || isAuthorized === null) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <ShieldCheck className="w-12 h-12 text-primary animate-pulse" />
          <p className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20">Verifying Authority...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Archived Students", value: students?.length || 0, icon: Users, color: "text-blue-400" },
    { label: "Vault Records", value: photos?.length || 0, icon: ImageIcon, color: "text-emerald-400" },
    { label: "Reflection Notes", value: memories?.length || 0, icon: MessageSquare, color: "text-amber-400" },
  ];

  return (
    <div className="bg-[#050505] min-h-screen selection:bg-primary/20">
      <Navbar />

      <main className="pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-20 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[8px] font-black uppercase tracking-widest mb-4">
                <ShieldCheck className="w-3 h-3" /> Master Control
              </div>
              <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">Admin Panel</h1>
              <p className="text-white/30 text-[10px] uppercase font-black tracking-[0.3em]">Global Archive Management System</p>
            </motion.div>

            <Button 
              onClick={handleSignOut}
              variant="outline" 
              className="border-white/5 bg-white/5 hover:bg-destructive hover:text-white rounded-full h-12 px-8 text-[10px] font-black uppercase tracking-widest gap-2"
            >
              <LogOut className="w-3 h-3" /> Secure Logout
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-white/[0.02] border-white/5 rounded-3xl overflow-hidden group hover:border-primary/20 transition-all">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div className={`p-4 rounded-2xl bg-white/[0.03] ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/10" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">{stat.label}</p>
                    <p className="text-4xl font-bold text-white">{stat.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Management Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="bg-white/[0.01] border-white/5 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-10 border-b border-white/5">
                <CardTitle className="text-xl font-bold flex items-center gap-4">
                  <Database className="w-5 h-5 text-primary" />
                  Archival Integrity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-1">Moderation Notice</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed">
                      As the administrator, you have the power to permanently remove any record from this archive. Please exercise caution.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20">System Tools</p>
                  <Button className="w-full h-14 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-primary transition-all">
                    Generate Archive Report
                  </Button>
                  <Button variant="outline" className="w-full h-14 border-white/10 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em]">
                    Sync Metadata
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.01] border-white/5 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-10 border-b border-white/5">
                <CardTitle className="text-xl font-bold flex items-center gap-4">
                  <Trash2 className="w-5 h-5 text-destructive" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/10">Audit Log is currently empty</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
