
"use client";

import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { StudentCard } from "@/components/StudentCard";
import { Users, History, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function YearbookPage() {
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = useState("");

  const studentsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "students"), orderBy("name"));
  }, [db]);

  const { data: students, isLoading } = useCollection(studentsQuery);

  const filteredStudents = students?.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.house?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#050505] min-h-screen text-foreground selection:bg-primary/20">
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
                <Users className="w-4 h-4" />
                <span>Student Directory</span>
              </div>
              <h1 className="text-6xl md:text-[8rem] font-black mb-8 leading-none tracking-tighter uppercase">
                The <span className="text-gradient">Yearbook</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed font-light font-body">
                The faces that defined seven years. From the hallways of Aravalli to the 
                playgrounds of Udaygiri.
              </p>
            </motion.div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <Input 
                placeholder="Search by name or house..." 
                className="bg-white/5 border-white/10 pl-12 h-14 rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredStudents?.map((student: any) => (
                <StudentCard key={student.id} student={{
                  ...student,
                  photo: student.profilePhotoUrl || `https://picsum.photos/seed/${student.id}/400/500`,
                  bio: student.shortBio,
                  classYear: "12", // Default for 2018-2025 batch final year
                  quote: student.fullBio?.substring(0, 50) + "..."
                }} />
              ))}
              {filteredStudents?.length === 0 && (
                <p className="col-span-full text-center py-40 text-white/20 font-black uppercase tracking-[0.5em]">No records found in the archive.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
