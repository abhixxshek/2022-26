
"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { YEAR_DATA } from "@/lib/data";
import { StudentCard } from "@/components/StudentCard";
import { Zap, Coffee, Users, ScrollText, History, Camera, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-[#050505] text-foreground min-h-screen selection:bg-primary/30 overflow-x-hidden font-body">
      <Navbar />
      
      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image - Cinematic Vibe */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://picsum.photos/seed/navodaya-road/1920/1080" 
            alt="The Road Ahead"
            fill
            className="object-cover grayscale opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
        </div>

        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-20 text-center px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-serif italic text-primary text-xl md:text-2xl mb-8 tracking-widest opacity-80">
              A Seven Year Legacy
            </p>
            
            <h1 className="text-8xl md:text-[14rem] font-black mb-6 leading-none tracking-tighter uppercase flex flex-col items-center">
              <span className="block">BATCH</span>
              <span className="font-serif font-light text-white italic normal-case tracking-tight -mt-4 md:-mt-12 block">
                2018—2025
              </span>
            </h1>

            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto mb-12" />

            <p className="text-white/30 text-[10px] md:text-xs max-w-md mx-auto leading-relaxed font-black uppercase tracking-[0.5em] mb-20">
              The Digital Archive of Jawahar Navodaya Vidyalaya.
              <br />
              Every mile we walked together, every memory we made.
            </p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="flex flex-col items-center gap-6"
            >
              <button 
                onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex flex-col items-center gap-4 text-[9px] uppercase font-black tracking-[0.6em] text-white/20 hover:text-primary transition-colors cursor-pointer"
              >
                Enter the Archive
                <div className="relative w-[1px] h-16 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-primary translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000" />
                  <div className="w-full h-full bg-white/10" />
                </div>
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Tagline at bottom */}
        <div className="absolute bottom-12 left-12">
          <p className="text-[9px] font-black uppercase tracking-[0.8em] text-white/10">
            ONCE A NAVODAYAN, ALWAYS A NAVODAYAN
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-40 px-6 border-y border-white/5 bg-[#020202]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { icon: <Zap className="w-4 h-4" />, title: "Morning PT", count: "2500+", label: "Whistles" },
              { icon: <Coffee className="w-4 h-4" />, title: "Sunday Mess", count: "365", label: "Specials" },
              { icon: <Users className="w-4 h-4" />, title: "House Bonds", count: "04", label: "Dormitories" },
              { icon: <ScrollText className="w-4 h-4" />, title: "Migration", count: "01", label: "Year Abroad" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="text-primary/40 group-hover:text-primary transition-colors flex justify-center mb-6">{item.icon}</div>
                <h4 className="text-5xl font-serif italic text-white mb-2">{item.count}</h4>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">{item.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The 7-Year Journey */}
      <section className="py-60 px-6 relative bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-40">
            <h2 className="text-6xl md:text-[8rem] font-black uppercase tracking-tighter leading-none mb-6">
              The <span className="text-primary">Journey</span>
            </h2>
            <p className="text-white/20 text-xs font-black uppercase tracking-[0.4em]">Seven years mapped across the halls.</p>
          </div>

          <div className="space-y-[20rem]">
            {YEAR_DATA.map((year, index) => (
              <div key={year.id} id={year.id} className="relative">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="mb-20 max-w-3xl"
                >
                  <p className="text-primary font-black mb-6 uppercase tracking-[0.5em] text-[10px]">
                    {year.subtitle}
                  </p>
                  <h3 className="text-6xl md:text-8xl font-serif italic mb-8 tracking-tight text-white">
                    {year.title}
                  </h3>
                  <p className="text-lg text-white/30 leading-relaxed font-light italic border-l border-white/10 pl-8">
                    {year.description}
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {year.students.map((student) => (
                    <StudentCard key={student.id} student={student} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Teaser */}
      <section className="py-60 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <Camera className="w-10 h-10 text-primary mx-auto mb-12 opacity-30" />
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12">
            Captured <span className="text-primary italic font-serif lowercase">In Time.</span>
          </h2>
          <Link href="/gallery" className="inline-flex items-center gap-4 group">
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/30 group-hover:text-primary transition-all">
              View Visual Archive
            </span>
            <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-primary transition-all group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-12 border-t border-white/5 bg-black/50">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="font-black text-[10px] tracking-[0.5em] uppercase text-white">JNV <span className="text-primary">MEMORIES</span></span>
            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-white/10 italic font-serif">Once a Navodayan, Always a Navodayan</p>
          </div>
          <div className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">
            © 2025 BATCH 2018—2025
          </div>
        </div>
      </footer>
    </div>
  );
}
