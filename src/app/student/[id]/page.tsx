"use client";

import { useParams, useRouter } from "next/navigation";
import { ALL_STUDENTS } from "@/lib/data";
import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Quote, Star, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function StudentProfile() {
  const { id } = useParams();
  const router = useRouter();
  const student = ALL_STUDENTS.find((s) => s.id === id);

  if (!student) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Student not found</h1>
          <button onClick={() => router.back()} className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-12"
          >
            <button 
              onClick={() => router.back()}
              className="p-3 rounded-full glass hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Badge variant="outline" className="border-primary text-primary px-3 py-1">Batch 2018-2025</Badge>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Image Column */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src={student.photo}
                  alt={student.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="mt-12 glass rounded-3xl p-8 space-y-6 relative overflow-hidden">
                <Quote className="absolute -top-4 -right-4 w-24 h-24 text-primary/10 rotate-12" />
                <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                  <Quote className="w-5 h-5" /> Graduation Quote
                </h3>
                <p className="text-2xl font-headline italic leading-relaxed text-foreground/90">
                  "{student.quote}"
                </p>
              </div>
            </motion.div>

            {/* Content Column */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-7 space-y-16"
            >
              <div>
                <h1 className="text-5xl md:text-7xl font-headline font-bold mb-4">{student.name}</h1>
                <p className="text-primary font-bold text-xl uppercase tracking-widest mb-6">{student.house} House | Class {student.classYear} Journey</p>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  {student.bio}
                </p>
              </div>

              {/* Highlights */}
              <section>
                <div className="flex items-center gap-2 mb-8">
                  <Star className="w-5 h-5 text-accent" />
                  <h2 className="text-2xl font-headline font-bold">Hostel & School Highlights</h2>
                </div>
                <div className="flex flex-wrap gap-4">
                  {student.highlights.map((highlight, idx) => (
                    <div key={idx} className="glass px-6 py-4 rounded-2xl flex items-center gap-4 hover:border-accent/30 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                        {idx + 1}
                      </div>
                      <span className="font-medium">{highlight}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Memory Cards */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-headline font-bold">Personal Stories</h2>
                  </div>
                  <Badge variant="secondary">{student.memories.length} Stories</Badge>
                </div>
                
                <div className="space-y-8">
                  {student.memories.map((memory, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className="glass rounded-3xl p-8 border-l-4 border-l-primary"
                    >
                      <h3 className="text-xl font-bold mb-3">{memory.title}</h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {memory.description}
                      </p>
                      {memory.image && (
                        <div className="relative aspect-video rounded-2xl overflow-hidden mt-6">
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
