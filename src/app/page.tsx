
"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { YEAR_DATA } from "@/lib/data";
import { StudentCard } from "@/components/StudentCard";
import { AddMemoryDialog } from "@/components/AddMemoryDialog";
import { ChevronDown, GraduationCap, MapPin, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background z-10" />
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            className="w-full h-full"
          >
            <img 
              src="https://picsum.photos/seed/navodaya-hero/1920/1080" 
              alt="Navodaya Campus" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div className="relative z-20 text-center max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary font-bold tracking-[0.3em] uppercase mb-4 text-sm">A Lifetime of Brotherhood</p>
            <h1 className="text-6xl md:text-8xl font-headline font-bold mb-8 leading-tight">
              7 Years of <span className="text-primary">Memories</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              From the first nervous step in Class 6 to the tearful farewell of Class 12. 
              Reconnect with the people who shared your journey through the corridors of JNV.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg hover:scale-105 transition-transform">
                Explore Yearbook
              </button>
              <AddMemoryDialog />
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <ChevronDown className="w-8 h-8 text-primary" />
        </motion.div>
      </section>

      {/* Year Sections */}
      {YEAR_DATA.map((year, index) => (
        <section 
          key={year.id} 
          id={year.id}
          className="min-h-screen py-32 px-6 border-t border-white/5 relative"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="max-w-xl"
              >
                <div className="flex items-center gap-2 text-primary font-bold mb-4 uppercase tracking-widest text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>The Journey Continues</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-headline font-bold mb-6">{year.title}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{year.description}</p>
              </motion.div>
              
              <div className="hidden md:block text-right">
                <span className="text-[12rem] font-bold text-white/5 leading-none absolute top-10 right-10 pointer-events-none font-headline">
                  0{index + 1}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {year.students.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Stats Section */}
      <section className="py-32 bg-primary/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <p className="text-4xl md:text-6xl font-headline font-bold text-primary mb-2">256</p>
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Students</p>
            </div>
            <div>
              <p className="text-4xl md:text-6xl font-headline font-bold text-primary mb-2">7</p>
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Years</p>
            </div>
            <div>
              <p className="text-4xl md:text-6xl font-headline font-bold text-primary mb-2">1.2k</p>
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Memories</p>
            </div>
            <div>
              <p className="text-4xl md:text-6xl font-headline font-bold text-primary mb-2">42</p>
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Faculty</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">N</div>
              <span className="font-headline font-bold tracking-tight">NAVODAYA MEMORIES</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              A digital tribute to the bond formed in the heart of Navodaya Vidyalayas.
            </p>
          </div>
          
          <div className="flex gap-10">
            <div className="space-y-4">
              <p className="font-bold text-sm uppercase tracking-widest">Platform</p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li><a href="#" className="hover:text-primary">Yearbook</a></li>
                <li><a href="#" className="hover:text-primary">Gallery</a></li>
                <li><a href="#" className="hover:text-primary">Alumni</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="font-bold text-sm uppercase tracking-widest">Support</p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li><a href="#" className="hover:text-primary">Privacy</a></li>
                <li><a href="#" className="hover:text-primary">Terms</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex justify-between items-center text-xs text-muted-foreground">
          <p>© 2024 Navodaya Memories. Created for the Class of 2022-26.</p>
          <div className="flex gap-4">
            <GraduationCap className="w-4 h-4" />
            <MapPin className="w-4 h-4" />
          </div>
        </div>
      </footer>
    </div>
  );
}
