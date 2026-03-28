
"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Users, BookOpen, Camera, Trash2, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { toast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const studentDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "students", user.uid);
  }, [db, user]);

  const { data: studentData, isLoading: isDocLoading } = useDoc(studentDocRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/auth");
    }
    if (!isDocLoading && studentData && studentData.role !== "admin") {
      router.push("/");
      toast({ variant: "destructive", title: "Access Denied", description: "You do not have administrative privileges." });
    }
  }, [user, isUserLoading, studentData, isDocLoading, router]);

  const studentsQuery = useMemoFirebase(() => query(collection(db, "students"), orderBy("name")), [db]);
  const memoriesQuery = useMemoFirebase(() => query(collection(db, "memories"), orderBy("uploadedAt", "desc")), [db]);
  const photosQuery = useMemoFirebase(() => query(collection(db, "photos"), orderBy("uploadedAt", "desc")), [db]);

  const { data: students } = useCollection(studentsQuery);
  const { data: memories } = useCollection(memoriesQuery);
  const { data: photos } = useCollection(photosQuery);

  const handleDelete = (collectionName: string, id: string) => {
    if (!confirm("Are you absolutely sure? This action is permanent in the archive.")) return;
    
    const docRef = doc(db, collectionName, id);
    deleteDocumentNonBlocking(docRef);
    toast({ title: "Archived Record Removed", description: "The data has been permanently deleted from the archive." });
  };

  if (isUserLoading || isDocLoading || !studentData || studentData.role !== "admin") {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen text-foreground">
      <Navbar />
      
      <main className="pt-40 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <div className="flex items-center gap-4 mb-4">
              <ShieldAlert className="w-8 h-8 text-primary" />
              <h1 className="text-5xl font-black uppercase tracking-tighter">Admin <span className="text-primary">Control</span></h1>
            </div>
            <p className="text-white/40 uppercase font-black text-[10px] tracking-[0.5em]">Batch '25 Archive Management Portal</p>
          </motion.div>

          <Tabs defaultValue="students" className="space-y-12">
            <TabsList className="bg-white/5 border border-white/10 p-1 h-14 rounded-full">
              <TabsTrigger value="students" className="rounded-full px-8 h-full text-[10px] font-black uppercase tracking-widest gap-2">
                <Users className="w-3 h-3" /> Students ({students?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="memories" className="rounded-full px-8 h-full text-[10px] font-black uppercase tracking-widest gap-2">
                <BookOpen className="w-3 h-3" /> Memories ({memories?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="photos" className="rounded-full px-8 h-full text-[10px] font-black uppercase tracking-widest gap-2">
                <Camera className="w-3 h-3" /> Photos ({photos?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students?.map((s) => (
                  <Card key={s.id} className="bg-black/40 border-white/5 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between p-6">
                      <div className="space-y-1">
                        <CardTitle className="text-lg font-bold">{s.name}</CardTitle>
                        <CardDescription className="text-[10px] uppercase font-black tracking-widest text-primary">{s.house} House | {s.role}</CardDescription>
                      </div>
                      {s.id !== user.uid && (
                        <Button variant="ghost" size="icon" onClick={() => handleDelete("students", s.id)} className="text-white/20 hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <p className="text-[10px] text-white/40 font-mono mb-4">{s.email}</p>
                      <p className="text-xs line-clamp-2 text-white/60">{s.shortBio}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="memories" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {memories?.map((m) => (
                  <Card key={m.id} className="bg-black/40 border-white/5 p-8 relative group">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete("memories", m.id)} className="absolute top-4 right-4 text-white/20 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-primary/40 rounded-full" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary">{m.studentName}</p>
                          <h3 className="text-lg font-bold">{m.title}</h3>
                        </div>
                      </div>
                      <p className="text-sm text-white/60 line-clamp-3 italic font-serif leading-relaxed">"{m.description}"</p>
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">{m.classYearLabel}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="photos" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {photos?.map((p) => (
                  <div key={p.id} className="relative aspect-[4/3] group rounded-2xl overflow-hidden border border-white/5 bg-black">
                    <img src={p.url} alt={p.caption} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-6">
                      <Button variant="destructive" size="icon" onClick={() => handleDelete("photos", p.id)} className="ml-auto w-8 h-8 rounded-full">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{p.classYearLabel}</p>
                        <p className="text-xs text-white line-clamp-2 font-bold">{p.caption}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
