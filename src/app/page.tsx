"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { YEAR_DATA } from "@/lib/data";
import { StudentCard } from "@/components/StudentCard";
import { AddMemoryDialog } from "@/components/AddMemoryDialog";
import { ChevronDown, MapPin, Heart, Coffee, Sun, Compass, Zap, Users, BookOpen } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="bg-[#050505] text-foreground min-h-screen selection:bg-primary/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/60 to-[#050505] z-10" />
          <motion.div
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
            className="w-full h-full"
          >
            <img 
              src="https://picsum.photos/seed/jnv-campus-main/1920/1080" 
              alt="JNV Campus" 
              className="w-full h-full object-cover opacity-60"
              data-ai-hint="boarding school campus"
            />
          </motion.div>
        </div>

        <div className="relative z-20 text-center max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="h-[1px] w-8 bg-primary/40" />
              <p className="text-primary font-bold tracking-[0.6em] uppercase text-[10px] md:text-xs">Navodaya Vidyalaya | Batch 2018 - 2025</p>
              <span className="h-[1px] w-8 bg-primary/40" />
            </div>
            <h1 className="text-7xl md:text-[10rem] font-headline font-black mb-6 leading-none tracking-tighter text-gradient">
              SEVEN <span className="italic font-light">YEARS</span>
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-light font-body">
              From the heavy metal <span className="text-primary font-bold italic">Trunk Boxes</span> of Class 6 to the emotional farewell of Class 12. This is the story of our shared destiny.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <button 
                onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-12 py-5 bg-white text-black rounded-full font-black text-sm uppercase tracking-widest hover:bg-primary transition-all overflow-hidden"
              >
                <span className="relative z-10">Relive the Journey</span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
              <AddMemoryDialog />
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 cursor-pointer opacity-30 hover:opacity-100 transition-opacity"
          onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <ChevronDown className="w-10 h-10 text-primary" />
        </motion.div>
      </section>

      {/* JNV Environment Feels */}
      <section id="journey" className="py-32 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-40">
            {[
              { 
                icon: <Zap className="w-8 h-8 text-primary" />, 
                title: "Morning PT", 
                desc: "The collective groan at 5:30 AM, the rhythmic steps on the field, and the crisp morning air that defined our discipline." 
              },
              { 
                icon: <Coffee className="w-8 h-8 text-primary" />, 
                title: "Sunday Special", 
                desc: "The puri-sabji aroma that meant freedom. The one day the mess felt like a feast." 
              },
              { 
                icon: <Users className="w-8 h-8 text-primary" />, 
                title: "House Brotherhood", 
                desc: "Aravalli, Nilgiri, Shivalik, Udaygiri. Not just names, but identities we fought for in every inter-house meet." 
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-6"
              >
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black font-headline uppercase">{feature.title}</h3>
                <p className="text-muted-foreground font-light leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-20">
            {[
              { val: "2555", label: "Nights in Dorms" },
              { val: "100+", label: "Mess Rituals" },
              { val: "365", label: "Migration Days" },
              { val: "∞", label: "Navodayan Spirit" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <h4 className="text-5xl md:text-7xl font-headline font-black text-primary mb-2">{stat.val}</h4>
                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Migration Theme Section */}
      <section className="py-40 px-6 relative overflow-hidden bg-primary/5">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <Compass className="w-full h-full text-primary animate-pulse" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <Badge className="bg-primary/20 text-primary mb-8 px-4 py-1 border-none uppercase tracking-widest text-[10px] font-bold">The Great Exchange</Badge>
            <h2 className="text-5xl md:text-8xl font-headline font-black mb-10 leading-none">The <span className="text-primary italic">Migration</span> Year</h2>
            <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed mb-12">
              Class 9 was our window to the world. A 2000km train journey to a land with a different language, 
              where we learned that "National Integration" wasn't just a chapter in civics, but a lived reality.
            </p>
            <Link href="/gallery" className="inline-flex items-center gap-4 text-primary font-black uppercase tracking-widest text-sm hover:gap-6 transition-all">
              View Migration Memories <Compass className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Batch Journey: Class 6 to 12 */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-40">
          {YEAR_DATA.map((year, index) => (
            <div key={year.id} id={year.id} className="relative">
              <div className="mb-24">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <p className="text-primary font-black mb-6 uppercase tracking-widest text-xs flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-primary" />
                    {year.subtitle}
                  </p>
                  <h2 className="text-6xl md:text-9xl font-headline font-black mb-10 tracking-tighter">{year.title}</h2>
                  <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed font-light">
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
      </section>

      {/* Footer */}
      <footer className="py-40 px-6 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-[12rem] font-headline font-black text-white/5 mb-20 pointer-events-none select-none tracking-tighter">
            NAVODAYA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20 text-left">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-primary mb-8">The Batch 18-25</p>
              <p className="text-muted-foreground leading-relaxed font-light">
                This digital yearbook is a sacred space for the Batch of 2018-2025. 
                Thousands of shared meals, countless night preps, and a brotherhood forged in the dormitories.
              </p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-primary mb-8">Navigation</p>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="/gallery" className="hover:text-primary transition-colors">Moments Gallery</Link></li>
                <li><Link href="/auth" className="hover:text-primary transition-colors">Join the Directory</Link></li>
                <li><Link href="/profile" className="hover:text-primary transition-colors">Your Legacy</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-primary mb-8">The Anthem</p>
              <p className="italic text-muted-foreground text-sm font-light leading-relaxed">
                "Hum Navodaya Ho, Hum Navodaya Ho... <br />
                Pragatishila Hum, Hum Navodaya Ho."
              </p>
            </div>
          </div>
          <div className="mt-40 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] uppercase font-black tracking-widest text-muted-foreground/50">
            <p>© 2025 JNV MEMORIES | BATCH OF 2018-2025</p>
            <div className="flex gap-10">
              <span className="flex items-center gap-2"><MapPin className="w-3 h-3" /> All India Alumni</span>
              <span className="flex items-center gap-2"><Heart className="w-3 h-3" /> Forever Bound</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
