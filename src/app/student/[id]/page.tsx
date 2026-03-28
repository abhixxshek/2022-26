"use client";

import { useParams, useRouter } from "next/navigation";
import { ALL_STUDENTS } from "@/lib/data";
import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Quote, Star, BookOpen, Home, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function StudentProfile() {
  const { id } = useParams();
  const router = useRouter();
  const student = ALL_STUDENTS.find((s) => s.id === id);

  if (!student) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#050505]">
        <div className="text-center">
          <h1 className="text-2xl mb-8 font-headline font-black uppercase tracking-widest text-white/20">Archive record not found</h1>
          <button onClick={() => router.back()} className="text-primary hover:underline flex items-center gap-4 font-black uppercase tracking-[0.4em] text-[10px]">
            <ArrowLeft className="w-4 h-4" /> Return to directory
          </button>
        </div>
      </div>
    );
  }

  const houseColorClass = {
    Aravalli: "text-aravalli border-aravalli/30 bg-aravalli/5",
    Nilgiri: "text-nilgiri border-nilgiri/30 bg-nilgiri/5",
    Shivalik: "text-shivalik border-shivalik/30 bg-shivalik/5",
    Udaygiri: "text-udaygiri border-udaygiri/30 bg-udaygiri/5",
  }[student.house];

  return (
    <div className="bg-[#050505] text-foreground min-h-screen">
      <Navbar />

      <main className="pt-48 pb-40 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-32"
          >
            <button 
              onClick={() => router.back()}
              className="group flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-primary transition-all"
            >
              <div className="p-4 rounded-full border border-white/5 group-hover:border-primary/40 transition-all">
                <ArrowLeft className="w-4 h-4" />
              </div>
              Back to Archive
            </button>
            <div className="flex items-center gap-10">
              <Badge variant="outline" className="border-primary/20 text-primary px-6 py-2 uppercase font-black text-[9px] tracking-[0.5em] rounded-full">BATCH 2018-2025</Badge>
              <div className={cn("hidden md:flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.5em] px-6 py-2 rounded-full border", houseColorClass)}>
                <Home className="w-4 h-4" />
                {student.house} House
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-32">
            {/* Image & Quote Column */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] bg-[#080808]">
                <Image
                  src={student.photo}
                  alt={student.name}
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
              </div>
              
              <div className="mt-24 relative">
                <Quote className="absolute -top-16 -left-12 w-32 h-32 text-primary/5 -rotate-12 pointer-events-none" />
                <h3 className="text-[9px] font-black flex items-center gap-4 text-primary uppercase tracking-[0.6em] mb-10">
                  <span className="w-10 h-[1px] bg-primary/40" /> The Legacy Quote
                </h3>
                <p className="text-4xl md:text-6xl font-serif italic font-light leading-[1.1] text-white tracking-tight">
                  "{student.quote}"
                </p>
              </div>
            </motion.div>

            {/* Content Column */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-7 space-y-32"
            >
              <div>
                <h1 className="text-7xl md:text-[9rem] font-black mb-12 leading-none tracking-tighter uppercase text-gradient">{student.name}</h1>
                <p className="text-xl md:text-3xl text-white/40 font-light leading-relaxed max-w-2xl italic font-serif">
                  {student.bio}
                </p>
              </div>

              {/* Highlights */}
              <section>
                <div className="flex items-center gap-6 mb-16">
                  <Star className="w-6 h-6 text-primary" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40">Milestones & Achievements</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {student.highlights.map((highlight, idx) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 p-10 rounded-3xl group hover:border-primary/20 transition-all">
                      <div className="text-[8px] font-black text-primary uppercase tracking-[0.5em] mb-6 opacity-30">Archive Entry {idx + 1}</div>
                      <span className="text-xl font-serif italic text-white group-hover:text-primary transition-colors">{highlight}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Personal Stories */}
              <section className="pt-16 border-t border-white/5">
                <div className="flex items-center justify-between mb-16">
                  <div className="flex items-center gap-6">
                    <BookOpen className="w-6 h-6 text-primary" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40">The Journey Logs</h2>
                  </div>
                </div>
                
                <div className="space-y-24">
                  {student.memories.map((memory, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ x: 20 }}
                      className="group border-l-[1px] border-white/10 pl-16 py-6 transition-all hover:border-primary/60"
                    >
                      <h3 className="text-3xl font-black mb-6 uppercase tracking-tight group-hover:text-primary transition-colors">{memory.title}</h3>
                      <p className="text-xl text-white/30 font-light leading-relaxed mb-12 max-w-2xl">
                        {memory.description}
                      </p>
                      {memory.image && (
                        <div className="relative aspect-video rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl border border-white/5">
                          <Image src={memory.image} alt={memory.title} fill className="object-cover" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
