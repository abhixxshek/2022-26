"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { YEAR_DATA } from "@/lib/data";
import { StudentCard } from "@/components/StudentCard";
import { AddMemoryDialog } from "@/components/AddMemoryDialog";
import { ChevronDown, GraduationCap, MapPin, Heart, BookOpen, Coffee, Sun } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background z-10" />
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
            className="w-full h-full"
          >
            <img 
              src="https://picsum.photos/seed/navodaya-hero/1920/1080" 
              alt="JNV Campus" 
              className="w-full h-full object-cover grayscale-[20%] brightness-[0.7]"
            />
          </motion.div>
        </div>

        <div className="relative z-20 text-center max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="h-px w-12 bg-primary/50" />
              <p className="text-primary font-bold tracking-[0.4em] uppercase text-xs">Batch 2018 - 2025</p>
              <span className="h-px w-12 bg-primary/50" />
            </div>
            <h1 className="text-6xl md:text-9xl font-headline font-bold mb-8 leading-tight">
              The <span className="text-primary italic">Navodayan</span> Way
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Seven years of shared dormitory beds, 5:30 AM whistles, and migration stories. 
              Relive the journey from being Class 6 juniors to the Class 12 legends.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="px-10 py-5 bg-primary text-primary-foreground rounded-full font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-primary/20">
                Explore the Batch
              </button>
              <AddMemoryDialog />
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <ChevronDown className="w-8 h-8 text-primary" />
        </motion.div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center p-8 glass rounded-3xl">
              <Sun className="w-12 h-12 text-accent mb-6" />
              <h3 className="text-2xl font-bold mb-4 font-headline">The 5:30 AM Routine</h3>
              <p className="text-muted-foreground font-light">From PT grounds to the morning assembly, the discipline that built us.</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 glass rounded-3xl">
              <Coffee className="w-12 h-12 text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-4 font-headline">Dorm Life</h3>
              <p className="text-muted-foreground font-light">Late night tea, shared secrets, and the unbreakable bond of House brotherhood.</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 glass rounded-3xl">
              <BookOpen className="w-12 h-12 text-accent mb-6" />
              <h3 className="text-2xl font-bold mb-4 font-headline">Study Prep</h3>
              <p className="text-muted-foreground font-light">Intense prep classes and group studies that made boards feel like a breeze.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Year Sections */}
      {YEAR_DATA.map((year, index) => (
        <section 
          key={year.id} 
          id={year.id}
          className="min-h-screen py-32 px-6 border-t border-white/5 relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="max-w-2xl"
              >
                <div className="flex items-center gap-2 text-accent font-bold mb-6 uppercase tracking-widest text-sm">
                  <Heart className="w-4 h-4 fill-accent" />
                  <span>{year.subtitle}</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-headline font-bold mb-8">{year.title}</h2>
                <p className="text-xl text-muted-foreground leading-relaxed font-light">{year.description}</p>
              </motion.div>
              
              <div className="hidden md:block text-right">
                <span className="text-[16rem] font-bold text-white/5 leading-none absolute top-0 right-0 pointer-events-none font-headline select-none">
                  {index + 1}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {year.students.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* JNV Memories Stats */}
      <section className="py-40 bg-primary/5 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16 text-center">
            <motion.div whileHover={{ scale: 1.1 }}>
              <p className="text-5xl md:text-8xl font-headline font-bold text-primary mb-4">7</p>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Years Together</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <p className="text-5xl md:text-8xl font-headline font-bold text-primary mb-4">2555</p>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Days of Hostel Life</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <p className="text-5xl md:text-8xl font-headline font-bold text-primary mb-4">1</p>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Migration Journey</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <p className="text-5xl md:text-8xl font-headline font-bold text-primary mb-4">∞</p>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Lifetime Bonds</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">J</div>
              <span className="font-headline font-bold tracking-tight text-xl">JNV MEMORIES</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs font-light">
              Dedicated to the Batch of 2018-2025. This is our story, etched in the corridors of the campus we called home.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-6">
              <p className="font-bold text-xs uppercase tracking-[0.3em] text-primary">Explore</p>
              <ul className="text-sm text-muted-foreground space-y-3 font-light">
                <li><a href="#" className="hover:text-primary transition-colors">House Records</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Migration Diary</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Alumni</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <p className="font-bold text-xs uppercase tracking-[0.3em] text-primary">About</p>
              <ul className="text-sm text-muted-foreground space-y-3 font-light">
                <li><a href="#" className="hover:text-primary transition-colors">The Spirit</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <p className="font-bold text-xs uppercase tracking-[0.3em] text-primary">Navodaya Anthem</p>
            <p className="text-sm italic text-muted-foreground font-light leading-relaxed">
              "Hum Navodaya Ho, Hum Navodaya Ho... Pragatishila Hum, Hum Navodaya Ho."
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          <p>© 2025 JNV Memories | Batch 2018-2025.</p>
          <div className="flex gap-8">
            <div className="flex items-center gap-2"><GraduationCap className="w-3 h-3 text-primary" /> Alumni Network</div>
            <div className="flex items-center gap-2"><MapPin className="w-3 h-3 text-primary" /> Across India</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
