"use client";

import { useParams, useRouter } from "next/navigation";
import { ALL_STUDENTS } from "@/lib/data";
import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Quote, Star, BookOpen, Home, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function StudentProfile() {
  const { id } = useParams();
  const router = useRouter();
  const student = ALL_STUDENTS.find((s) => s.id === id);

  if (!student) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#050505]">
        <div className="text-center">
          <h1 className="text-2xl mb-8 font-headline font-black">Student not found</h1>
          <button onClick={() => router.back()} className="text-primary hover:underline flex items-center gap-2 font-black uppercase tracking-widest text-xs">
            <ArrowLeft className="w-4 h-4" /> Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] text-foreground min-h-screen">
      <Navbar />

      <main className="pt-40 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-20"
          >
            <button 
              onClick={() => router.back()}
              className="group flex items-center gap-4 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
            >
              <div className="p-3 rounded-full border border-white/10 group-hover:border-primary transition-all">
                <ArrowLeft className="w-4 h-4" />
              </div>
              Back to Directory
            </button>
            <div className="flex items-center gap-6">
              <Badge variant="outline" className="border-primary/40 text-primary px-4 py-1 uppercase font-black text-[10px] tracking-widest">Batch 2018-2025</Badge>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <Home className="w-3 h-3 text-primary" />
                {student.house} House
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
            {/* Image & Quote Column */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-[#111]">
                <Image
                  src={student.photo}
                  alt={student.name}
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              
              <div className="mt-16 relative">
                <Quote className="absolute -top-12 -left-8 w-24 h-24 text-primary/10 -rotate-12 pointer-events-none" />
                <h3 className="text-xs font-black flex items-center gap-3 text-primary uppercase tracking-widest mb-6">
                  <span className="w-6 h-[1px] bg-primary" /> The Legacy Quote
                </h3>
                <p className="text-3xl md:text-5xl font-headline font-black italic leading-tight text-white tracking-tighter">
                  "{student.quote}"
                </p>
              </div>
            </motion.div>

            {/* Content Column */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-7 space-y-24"
            >
              <div>
                <h1 className="text-7xl md:text-9xl font-headline font-black mb-8 leading-none tracking-tighter text-gradient">{student.name}</h1>
                <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl">
                  {student.bio}
                </p>
              </div>

              {/* Highlights */}
              <section>
                <div className="flex items-center gap-4 mb-10">
                  <Star className="w-5 h-5 text-primary" />
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white">Milestones & Achievements</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {student.highlights.map((highlight, idx) => (
                    <div key={idx} className="bg-[#111] border border-white/5 p-8 rounded-2xl group hover:border-primary/30 transition-all">
                      <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 opacity-50">Milestone {idx + 1}</div>
                      <span className="text-lg font-bold text-white group-hover:text-primary transition-colors">{highlight}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Personal Stories */}
              <section>
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white">The Journey Logs</h2>
                  </div>
                </div>
                
                <div className="space-y-12">
                  {student.memories.map((memory, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ x: 10 }}
                      className="group border-l border-white/10 pl-10 py-4 transition-all hover:border-primary"
                    >
                      <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{memory.title}</h3>
                      <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8">
                        {memory.description}
                      </p>
                      {memory.image && (
                        <div className="relative aspect-video rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
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