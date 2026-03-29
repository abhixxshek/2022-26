
"use client";

import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { StudentCard } from "@/components/StudentCard";
import { Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const HOUSES = [
  { name: "All Houses", color: "bg-white/5 text-white/40 border-white/10" },
  { name: "Aravalli", color: "bg-aravalli/10 text-aravalli border-aravalli/20", active: "bg-aravalli text-white border-aravalli shadow-aravalli/20" },
  { name: "Nilgiri", color: "bg-nilgiri/10 text-nilgiri border-nilgiri/20", active: "bg-nilgiri text-white border-nilgiri shadow-nilgiri/20" },
  { name: "Shivalik", color: "bg-shivalik/10 text-shivalik border-shivalik/20", active: "bg-shivalik text-white border-shivalik shadow-shivalik/20" },
  { name: "Udaygiri", color: "bg-udaygiri/10 text-udaygiri border-udaygiri/20", active: "bg-udaygiri text-black border-udaygiri shadow-udaygiri/20" },
];

export default function YearbookPage() {
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeHouse, setActiveHouse] = useState("All Houses");

  const studentsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "students"), orderBy("name"));
  }, [db]);

  const { data: students, isLoading } = useCollection(studentsQuery);

  const filteredStudents = students?.filter(s => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      s.name?.toLowerCase().includes(searchLower) ||
      s.nickname?.toLowerCase().includes(searchLower) ||
      s.house?.toLowerCase().includes(searchLower);
    const matchesHouse = activeHouse === "All Houses" || s.house === activeHouse;
    return matchesSearch && matchesHouse;
  });

  return (
    <div className="bg-[#050505] min-h-screen text-foreground selection:bg-primary/20">
      <Navbar />

      <main className="pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">The Batch of '25</h1>
              <p className="text-white/40 max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed">
                Faces that defined our journey. Moments that became memories. Click a card to explore their legacy.
              </p>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-20 bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <Input 
                placeholder="Find a classmate..." 
                className="bg-black/40 border-white/10 pl-12 h-12 rounded-full text-white focus:ring-primary/20 transition-all placeholder:text-white/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {HOUSES.map((house) => (
                <button
                  key={house.name}
                  onClick={() => setActiveHouse(house.name)}
                  className={cn(
                    "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                    activeHouse === house.name 
                      ? (house.active || "bg-primary text-black border-primary shadow-lg shadow-primary/20") 
                      : house.color
                  )}
                >
                  {house.name}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredStudents?.map((student: any) => (
                <StudentCard key={student.id} student={{
                  ...student,
                  photo: student.profilePhotoUrl || `https://picsum.photos/seed/${student.id}/400/500`,
                  bio: student.shortBio,
                  classYear: "12",
                  quote: student.fullBio
                }} />
              ))}
              {filteredStudents?.length === 0 && !isLoading && (
                <div className="col-span-full py-40 text-center">
                  <p className="text-white/10 font-black uppercase tracking-[0.5em] text-xl">No records found in the archive.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
