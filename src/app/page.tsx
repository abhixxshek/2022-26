"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { YEAR_DATA } from "@/lib/data";
import { Zap, Coffee, Users, ScrollText, Camera, ChevronRight, Loader2, Database } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, orderBy, writeBatch, doc } from "firebase/firestore";
import { EditJourneyDialog } from "@/components/EditJourneyDialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  const { user } = useUser();
  const db = useFirestore();

  const journeyQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "journey"), orderBy("order", "asc"));
  }, [db]);

  const { data: journeyData, isLoading } = useCollection(journeyQuery);

  const initializeJourney = async () => {
    if (!db) return;
    const batch = writeBatch(db);
    
    YEAR_DATA.forEach((year, index) => {
      const yearRef = doc(db, "journey", year.id);
      batch.set(yearRef, {
        id: year.id,
        order: index,
        title: year.title,
        subtitle: year.subtitle,
        description: year.description,
        imageUrl: year.students?.[0]?.memories?.[0]?.image || `https://picsum.photos/seed/${year.id}/800/800`
      });
    });

    try {
      await batch.commit();
      toast({ title: "Timeline Initialized", description: "The 7-year legacy framework has been committed to Firestore." });
    } catch (e) {
      toast({ variant: "destructive", title: "Initialization Failed", description: "Check permissions." });
    }
  };

  const displayData = journeyData && journeyData.length > 0 ? journeyData : YEAR_DATA;

  return (
    <div className="bg-[#050505] text-foreground min-h-screen selection:bg-primary/30 overflow-x-hidden font-body">
      <Navbar />
      
      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://picsum.photos/seed/navodaya-road/1920/1080" 
            alt="The Road Ahead"
            fill
            className="object-cover grayscale opacity-20"
            priority
            data-ai-hint="cinematic road"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
          <div className="absolute inset-0 hero-radial-gradient" />
        </div>

        <div className="relative z-20 text-center px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-12">
              A Seven Year Legacy
            </div>
            
            <h1 className="text-8xl md:text-[14rem] font-black mb-4 leading-none tracking-tighter uppercase flex flex-col items-center">
              <span className="block">BATCH</span>
              <span className="font-serif font-light text-white italic normal-case tracking-tight -mt-4 md:-mt-12 block">
                2018—2025
              </span>
            </h1>

            {/* School Name with Beautiful Colors */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mb-12"
            >
              <h2 className="text-xl md:text-3xl font-black uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-primary/60 drop-shadow-[0_0_15px_rgba(255,191,0,0.3)] px-4">
                JAWAHAR NAVODAYA VIDHYALAYA KALUKHEDA , RATLAM-1
              </h2>
            </motion.div>

            <p className="text-white/30 text-[10px] md:text-xs max-w-md mx-auto leading-relaxed font-black uppercase tracking-[0.5em] mb-20">
              The Digital Archive of the Navodaya Family.
              <br />
              Once a Navodayan, Always a Navodayan.
            </p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              <button 
                onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex flex-col items-center gap-4 text-[9px] uppercase font-black tracking-[0.6em] text-white/20 hover:text-primary transition-colors cursor-pointer"
              >
                Scroll to Explore
                <div className="relative w-[1px] h-12 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-primary translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000" />
                  <div className="w-full h-full bg-white/10" />
                </div>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-6 bg-[#020202] border-y border-white/5">
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
                <div className="text-primary/40 group-hover:text-primary transition-colors flex justify-center mb-4">{item.icon}</div>
                <h4 className="text-4xl font-serif italic text-white mb-2">{item.count}</h4>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/20">{item.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Journey Section - Timeline Layout */}
      <section id="journey" className="py-60 px-6 relative bg-background overflow-hidden">
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-32 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest">
              OUR HISTORY
            </div>
            <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tight">
              The Journey: 2018–2025
            </h2>
            {user && (!journeyData || journeyData.length === 0) && (
              <Button 
                variant="outline" 
                onClick={initializeJourney}
                className="mt-8 border-primary/20 text-primary hover:bg-primary/5 uppercase font-black text-[9px] tracking-widest"
              >
                <Database className="w-3 h-3 mr-2" /> Initialize Archive Data
              </Button>
            )}
          </div>

          {/* Vertical Line */}
          <div className="timeline-line" />

          <div className="space-y-64 relative">
            {isLoading ? (
              <div className="flex justify-center py-40">
                <Loader2 className="w-12 h-12 animate-spin text-white/10" />
              </div>
            ) : (
              displayData.map((year: any, index: number) => {
                const isEven = index % 2 === 0;
                const academicYearRange = year.subtitle.split(' | ')[0];
                
                return (
                  <div key={year.id} className="relative flex items-center justify-center">
                    {/* Year Range Marker (Time Lapse) */}
                    <div className="timeline-marker w-20 h-20 text-[11px] leading-tight text-center px-1">
                      {academicYearRange}
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-32 w-full items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      {/* Image Side */}
                      <motion.div 
                        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className={`flex justify-center ${isEven ? 'md:justify-end' : 'md:justify-start'}`}
                      >
                        <div className="polaroid -rotate-3 transition-transform hover:rotate-0 duration-500 max-w-[320px]">
                          <div className="relative aspect-square w-full overflow-hidden bg-muted">
                            <Image 
                              src={year.imageUrl || `https://picsum.photos/seed/${year.id}/800/800`}
                              alt={year.title}
                              fill
                              className="object-cover grayscale"
                            />
                          </div>
                          <div className="polaroid-caption">
                            {year.title} 🕊️
                          </div>
                        </div>
                      </motion.div>

                      {/* Text Side */}
                      <motion.div 
                        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className={`text-center md:text-left ${!isEven && 'md:text-right'}`}
                      >
                        <div className="max-w-sm mx-auto md:mx-0 relative">
                          {user && (
                            <div className="absolute -top-12 right-0 md:-left-12">
                              <EditJourneyDialog yearData={year} />
                            </div>
                          )}
                          <h3 className="text-3xl md:text-4xl font-serif text-white mb-6">
                            {year.title}
                          </h3>
                          <p className="text-white/40 text-sm leading-relaxed font-light font-serif italic">
                            "{year.description}"
                          </p>
                          <div className="mt-4 text-[9px] font-black uppercase tracking-widest text-primary/40">
                            {year.subtitle}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Gallery Teaser */}
      <section className="py-60 px-6 text-center bg-[#020202]">
        <div className="max-w-4xl mx-auto">
          <Camera className="w-10 h-10 text-primary mx-auto mb-12 opacity-30" />
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-12">
            Captured In Time.
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
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="font-serif italic text-lg text-white">Batch '25</span>
            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-white/10 italic">Once a Navodayan, Always a Navodayan</p>
          </div>
          <div className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">
            © 2025 BATCH 2018—2025
          </div>
        </div>
      </footer>
    </div>
  );
}
