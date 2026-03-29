
"use client";

import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from "@/firebase";
import { collection, query, orderBy, limit, doc } from "firebase/firestore";
import { Heart, Loader2, Trash2 } from "lucide-react";
import { AddMemoryDialog } from "@/components/AddMemoryDialog";
import { Button } from "@/components/ui/button";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { toast } from "@/hooks/use-toast";

export default function WallPage() {
  const db = useFirestore();
  const { user } = useUser();

  const studentRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "students", user.uid);
  }, [db, user]);

  const { data: studentData } = useDoc(studentRef);

  const memoriesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "memories"), orderBy("uploadedAt", "desc"), limit(50));
  }, [db]);

  const { data: memories, isLoading } = useCollection(memoriesQuery);

  const handleDelete = (id: string) => {
    if (!id || !db) return;
    if (!confirm("Are you sure you want to permanently remove this memory from the wall?")) return;
    
    const memoryRef = doc(db, "memories", id);
    deleteDocumentNonBlocking(memoryRef);
    toast({ 
      title: "Memory Erased", 
      description: "The message has been removed from the public wall by administrator." 
    });
  };

  const isAdmin = studentData?.role === "admin";

  return (
    <div className="bg-[#0a0a0b] min-h-screen text-foreground selection:bg-primary/20">
      <Navbar />

      <main className="pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest"
            >
              <Heart className="w-3 h-3 fill-primary" />
              Final Goodbyes
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold text-white tracking-tight"
            >
              The Reflection Wall
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-white/40 max-w-2xl mx-auto font-light leading-relaxed"
            >
              A space to leave your final words, memories, and wishes. These notes 
              will remain here as a testament to our journey.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="pt-8"
            >
              <AddMemoryDialog />
            </motion.div>
          </div>

          {isLoading ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-white/5 animate-pulse rounded-sm" />
              ))}
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-4 gap-10 space-y-12">
              {memories?.map((memory: any, idx) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative break-inside-avoid group"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 w-16 h-8 bg-white/10 backdrop-blur-sm z-20 shadow-sm opacity-80" />
                  
                  <div className="bg-[#f0e6d2] p-8 md:p-10 shadow-[5px_15px_30px_rgba(0,0,0,0.3)] transform transition-all duration-500 hover:-translate-y-2 hover:rotate-1 relative">
                    {isAdmin && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(memory.id);
                        }} 
                        className="absolute top-2 right-2 text-red-600/30 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    )}
                    
                    <div className="space-y-6">
                      <p className="text-black/80 text-xl font-serif italic leading-relaxed">
                        "{memory.description}"
                      </p>
                      
                      <div className="pt-6 border-t border-black/10">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-black">
                          {memory.studentName || "Anonymous Navodayan"}
                        </p>
                        {memory.classYearLabel && (
                          <p className="text-[9px] font-bold text-black/40 uppercase tracking-widest mt-1">
                            {memory.classYearLabel}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {memories?.length === 0 && !isLoading && (
                <div className="col-span-full py-40 text-center">
                  <p className="text-white/10 font-black uppercase tracking-[0.5em] text-xl">
                    The wall is waiting for its first mark.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_100%)]" />
      </div>
    </div>
  );
}
