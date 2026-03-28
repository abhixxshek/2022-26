
"use client";

import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { MessageSquare, Quote, History } from "lucide-react";
import { AddMemoryDialog } from "@/components/AddMemoryDialog";

export default function WallPage() {
  const db = useFirestore();

  const memoriesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "memories"), orderBy("uploadedAt", "desc"), limit(50));
  }, [db]);

  const { data: memories, isLoading } = useCollection(memoriesQuery);

  return (
    <div className="bg-[#050505] min-h-screen text-foreground">
      <Navbar />

      <main className="pt-40 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 text-primary font-black mb-6 uppercase tracking-[0.4em] text-[10px]">
                <MessageSquare className="w-4 h-4" />
                <span>The Public Feed</span>
              </div>
              <h1 className="text-6xl md:text-[8rem] font-black mb-8 leading-none tracking-tighter uppercase">
                The <span className="text-gradient">Wall</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed font-light font-body">
                A shared stream of consciousness. Read the stories, achievements, and 
                inside jokes that made our batch legendary.
              </p>
            </motion.div>

            <AddMemoryDialog />
          </div>

          {isLoading ? (
            <div className="space-y-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-40 bg-white/5 animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="columns-1 md:columns-2 gap-8 space-y-8">
              {memories?.map((memory: any, idx) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="break-inside-avoid bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] group hover:border-primary/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">
                      {memory.classYearLabel}
                    </span>
                    <Quote className="w-4 h-4 text-white/10 group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{memory.title}</h3>
                  <p className="text-lg text-white/40 leading-relaxed italic mb-8">
                    "{memory.description}"
                  </p>
                  <div className="flex items-center gap-4 pt-8 border-t border-white/5">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-black">
                      {memory.studentName?.charAt(0) || "N"}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
                      Shared by {memory.studentName || "A Navodayan"}
                    </span>
                  </div>
                </motion.div>
              ))}
              {memories?.length === 0 && (
                <p className="text-center py-40 text-white/20 font-black uppercase tracking-[0.5em] col-span-full">The wall is currently empty. Be the first to post.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
