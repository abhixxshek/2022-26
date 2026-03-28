"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { YEAR_DATA } from "@/lib/data";
import { StudentCard } from "@/components/StudentCard";
import { AddMemoryDialog } from "@/components/AddMemoryDialog";
import { ChevronDown, MapPin, Heart, Coffee, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-[#050505] text-foreground min-h-screen selection:bg-primary/30 overflow-x-hidden">
      <Navbar />
      
      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden hero-radial-gradient">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-20 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <p className="font-serif italic text-primary text-xl md:text-2xl mb-8 tracking-wide">
              A Journey We&apos;ll Always Carry
            </p>
            
            <h1 className="text-6xl md:text-[8rem] font-bold mb-8 leading-none tracking-tight flex flex-wrap justify-center items-center gap-x-8">
              <span>Batch</span>
              <span className="font-serif font-medium text-white/90 italic">2018—25</span>
            </h1>

            <div className="w-24 h-[1px] bg-primary/40 mx-auto mb-12" />

            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed font-light mb-20 tracking-wide opacity-80">
              Seven years of laughter, late nights, and lessons learned. Join us as we look back on the moments that defined us.
            </p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="flex flex-col items-center gap-4 cursor-pointer group"
              onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-muted-foreground group-hover:text-primary transition-colors">
                Click to start the journey
              </span>
              <div className="w-[1px] h-16 bg-gradient-to-b from-primary/50 to-transparent" />
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Tagline at bottom right */}
        <div className="absolute bottom-12 right-12 hidden md:block">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20 hover:text-primary transition-colors cursor-default">
            Once a Navodayan, Always a Navodayan
          </p>
        </div>
      </section>

      {/* JNV Environment Feels */}
      <section id="journey" className="py-40 px-6 border-b border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 mb-40">
            {[
              { 
                icon: <Zap className="w-6 h-6 text-primary" />, 
                title: "Morning PT", 
                desc: "The 5:30 AM whistle. The rhythmic crunch of shoes on the field, the cold morning mist, and the discipline that built our foundation." 
              },
              { 
                icon: <Coffee className="w-6 h-6 text-primary" />, 
                title: "Sunday Special", 
                desc: "The aroma of Puri-Sabji wafting through the corridors. The one day the mess felt like home after a week of standard fare." 
              },
              { 
                icon: <Users className="w-6 h-6 text-primary" />, 
                title: "House Brotherhood", 
                desc: "Aravalli, Nilgiri, Shivalik, Udaygiri. Not just dorms, but identities we protected with pride in every inter-house clash." 
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-8"
              >
                <div className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold uppercase tracking-widest">{feature.title}</h3>
                <p className="text-muted-foreground text-sm font-light leading-relaxed opacity-70">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-20 py-20 border-y border-white/5">
            {[
              { val: "2555", label: "Days in Hostel" },
              { val: "100+", label: "Mess Rituals" },
              { val: "365", label: "Migration Scheme" },
              { val: "∞", label: "Navodayan Spirit" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <h4 className="text-4xl md:text-6xl font-serif italic text-primary mb-2">{stat.val}</h4>
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section: Class 6 to 12 */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-40">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight uppercase">The 7-Year Journey</h2>
            <p className="text-lg text-muted-foreground max-w-2xl font-light opacity-70">A chronological archive of our evolution, from the scared children of Class 6 to the legacy of Class 12.</p>
          </div>

          <div className="space-y-60">
            {YEAR_DATA.map((year, index) => (
              <div key={year.id} id={year.id} className="relative">
                <div className="mb-24">
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <p className="text-primary font-bold mb-6 uppercase tracking-[0.3em] text-[10px] flex items-center gap-3">
                      <span className="w-8 h-[1px] bg-primary" />
                      {year.subtitle}
                    </p>
                    <h2 className="text-6xl md:text-8xl font-serif italic mb-10 tracking-tight">{year.title}</h2>
                    <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed font-light opacity-70">
                      {year.description}
                    </p>
                  </motion.div>
                </div>

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

      {/* Final Call to Action */}
      <section className="py-60 px-6 text-center bg-gradient-to-b from-transparent to-primary/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-serif italic mb-12">Every end is just a new beginning.</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/auth" className="px-12 py-5 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all">
              Join the Archive
            </Link>
            <AddMemoryDialog />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] uppercase font-bold tracking-[0.4em] text-muted-foreground/40">
          <div className="flex flex-col items-center md:items-start">
            <p>© 2025 JNV MEMORIES | BATCH 2018-2025</p>
            <p className="mt-2 text-primary/40 font-serif italic normal-case tracking-normal">Once a Navodayan, Always a Navodayan</p>
          </div>
          <div className="flex gap-12">
            <Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link>
            <Link href="/auth" className="hover:text-primary transition-colors">Access Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
