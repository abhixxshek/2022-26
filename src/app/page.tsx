
"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { YEAR_DATA } from "@/lib/data";
import { StudentCard } from "@/components/StudentCard";
import { AddMemoryDialog } from "@/components/AddMemoryDialog";
import { ChevronDown, Zap, Coffee, Users, ScrollText, History, Camera } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-[#050505] text-foreground min-h-screen selection:bg-primary/30 overflow-x-hidden font-body">
      <Navbar />
      
      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden hero-radial-gradient">
        {/* Abstract Background Grid */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="relative z-20 text-center px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-serif italic text-primary text-xl md:text-3xl mb-12 tracking-wide opacity-90">
              A Journey We&apos;ll Always Carry
            </p>
            
            <h1 className="text-7xl md:text-[11rem] font-black mb-12 leading-none tracking-tighter uppercase flex flex-wrap justify-center items-baseline gap-x-12">
              <span>Batch</span>
              <span className="font-serif font-light text-white/95 italic normal-case tracking-tight">2018—2025</span>
            </h1>

            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent mx-auto mb-16" />

            <p className="text-white/40 text-[10px] md:text-xs max-w-lg mx-auto leading-relaxed font-black uppercase tracking-[0.4em] mb-24 opacity-80">
              Seven years of laughter, late nights, and lessons learned. Join us as we look back on the moments that defined us.
            </p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="flex flex-col items-center gap-6 cursor-pointer group"
              onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="text-[10px] uppercase font-black tracking-[0.6em] text-white/20 group-hover:text-primary transition-colors">
                Explore the Archive
              </span>
              <div className="relative w-[1px] h-24 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000" />
                <div className="w-full h-full bg-white/10" />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Tagline at bottom right */}
        <div className="absolute bottom-16 right-16 hidden lg:block">
          <p className="text-[9px] font-black uppercase tracking-[0.8em] text-white/10 hover:text-primary transition-all cursor-default">
            ONCE A NAVODAYAN, ALWAYS A NAVODAYAN
          </p>
        </div>
      </section>

      {/* Stats & Feel Section */}
      <section id="stats" className="py-60 px-6 border-b border-white/5 bg-[#050505] relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-center mb-60">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div className="flex items-center gap-4 text-primary text-[10px] font-black uppercase tracking-[0.5em]">
                <History className="w-4 h-4" />
                <span>Navodaya Life</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-serif italic text-white leading-tight tracking-tight">
                The Hostel <span className="text-white/20">Chronicles</span>
              </h2>
              <p className="text-xl text-white/40 leading-relaxed font-light">
                Hostel life wasn't just about sharing a room; it was about sharing a destiny. 
                From the 5:30 AM whistle to the secret midnight feast, these walls witnessed our transition from children to young adults.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-8">
              {[
                { icon: <Zap className="w-5 h-5" />, title: "Morning PT", count: "2500+", label: "Whistles" },
                { icon: <Coffee className="w-5 h-5" />, title: "Sunday Mess", count: "365", label: "Specials" },
                { icon: <Users className="w-5 h-5" />, title: "Houses", count: "04", label: "Dormitories" },
                { icon: <ScrollText className="w-5 h-5" />, title: "Migration", count: "01", label: "Year Abroad" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 border border-white/5 bg-white/[0.02] rounded-2xl group hover:border-primary/20 transition-all"
                >
                  <div className="text-primary mb-6">{item.icon}</div>
                  <h4 className="text-4xl font-serif italic text-white mb-2">{item.count}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{item.title}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The 7-Year Journey */}
      <section className="py-60 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-40 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-8 py-2 border border-primary/20 rounded-full mb-12"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.8em] text-primary">The Timeline</span>
            </motion.div>
            <h2 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-none mb-12">The <span className="text-white/10">Legacy</span></h2>
          </div>

          <div className="space-y-[30rem]">
            {YEAR_DATA.map((year, index) => (
              <div key={year.id} id={year.id} className="relative group">
                <div className="mb-32">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                  >
                    <p className="text-primary font-black mb-8 uppercase tracking-[0.5em] text-[10px]">
                      {year.subtitle}
                    </p>
                    <h3 className="text-7xl md:text-9xl font-serif italic mb-12 tracking-tight text-white group-hover:text-primary transition-all duration-700">
                      {year.title}
                    </h3>
                    <p className="text-xl md:text-2xl text-white/30 leading-relaxed font-light italic">
                      {year.description}
                    </p>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                  {year.students.map((student) => (
                    <StudentCard key={student.id} student={student} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cinematic Gallery Teaser */}
      <section className="py-60 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto text-center">
          <Camera className="w-12 h-12 text-primary mx-auto mb-12 opacity-20" />
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-12">Frozen <span className="text-primary italic font-serif lowercase">moments.</span></h2>
          <Link href="/gallery" className="inline-block group">
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40 group-hover:text-primary transition-all">
              Access the visual archive
            </span>
            <div className="w-full h-[1px] bg-white/10 mt-4 group-hover:bg-primary transition-all" />
          </Link>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-80 px-6 text-center bg-gradient-to-t from-primary/5 to-transparent relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-6xl md:text-9xl font-serif italic mb-16 text-white tracking-tighter leading-tight">Every end is just a <span className="text-primary">new beginning.</span></h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
            <Link href="/auth" className="px-16 py-6 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-primary transition-all shadow-2xl">
              Join the Batch
            </Link>
            <AddMemoryDialog />
          </div>
        </div>
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
           <p className="text-[10px] font-black uppercase tracking-[1em] text-white/5">2018—2025</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-12 border-t border-white/5 bg-black">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-start gap-24">
          <div className="space-y-8">
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 border border-primary/40 rounded-full flex items-center justify-center">
                <span className="text-primary text-[10px] font-black">JNV</span>
              </div>
              <span className="font-black text-xs tracking-[0.5em] uppercase">MEMORIES</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 max-w-xs leading-loose">
              The digital yearbook for Jawahar Navodaya Vidyalaya. Batch of 2018-2025.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-24">
            <div className="space-y-6">
              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Archive</h5>
              <div className="flex flex-col gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                <Link href="/gallery" className="hover:text-primary transition-colors">Visual Reel</Link>
                <Link href="#journey" className="hover:text-primary transition-colors">The Journey</Link>
                <Link href="/auth" className="hover:text-primary transition-colors">Portal Login</Link>
              </div>
            </div>
            <div className="space-y-6">
              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Community</h5>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                Aravalli · Nilgiri<br/>Shivalik · Udaygiri
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-[1800px] mx-auto mt-32 pt-12 border-t border-white/5 flex justify-between items-center">
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/10">© 2025 JNV MEMORIES | ALL RIGHTS RESERVED</p>
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-primary/30 font-serif italic normal-case tracking-normal">Once a Navodayan, Always a Navodayan</p>
        </div>
      </footer>
    </div>
  );
}
