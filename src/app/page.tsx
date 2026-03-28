
"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { YEAR_DATA } from "@/lib/data";
import { Loader2, Database } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, writeBatch, doc } from "firebase/firestore";
import { EditJourneyDialog } from "@/components/EditJourneyDialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function Home() {
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
        imageUrl: year.students?.[0]?.memories?.[0]?.image || `https://picsum.photos/seed/${year.id}/1200/900`
      });
    });

    try {
      await batch.commit();
      toast({ title: "Timeline Initialized", description: "The 7-year legacy framework has been committed to Firestore." });
    } catch (e) {
      toast({ variant: "destructive", title: "Initialization Failed", description: "Check console for details." });
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
            <div className="flex flex-col items-center mb-12">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative w-24 h-24 mb-6 filter brightness-150"
              >
                <Image 
                  src="https://upload.wikimedia.org/wikipedia/en/d/d1/Navodaya_Vidyalaya_Samiti_logo.png"
                  alt="NVS Official Logo"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </motion.div>
              <div className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
                A Seven Year Legacy
              </div>
            </div>
            
            <h1 className="text-8xl md:text-[14rem] font-black mb-4 leading-none tracking-tighter uppercase flex flex-col items-center">
              <span className="block">BATCH</span>
              <span className="font-serif font-light text-white italic normal-case tracking-tight -mt-4 md:-mt-12 block">
                2018—2025
              </span>
            </h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mb-12"
            >
              <h2 className="text-xl md:text-3xl font-black uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-primary/60 drop-shadow-[0_0_15px_rgba(255,191,0,0.3)] px-4">
                JAWAHAR NAVODAYA VIDYALAYA RATLAM
              </h2>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* The Journey Section - Static Timeline */}
      <section id="journey" className="py-60 px-6 relative bg-background overflow-hidden">
        <div className="max-w-[1600px] mx-auto relative px-12">
          <div className="text-center mb-48 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest">
              OUR HISTORY
            </div>
            <h2 className="text-7xl md:text-[10rem] font-serif text-white tracking-tight">
              The Journey
            </h2>
            {(!journeyData || journeyData.length === 0) && (
              <Button 
                variant="outline" 
                onClick={initializeJourney}
                className="mt-8 border-primary/20 text-primary hover:bg-primary/5 uppercase font-black text-[9px] tracking-widest"
              >
                <Database className="w-3 h-3 mr-2" /> Initialize Archive Data
              </Button>
            )}
          </div>

          <div className="timeline-line" />

          <div className="space-y-[40rem] relative">
            {isLoading ? (
              <div className="flex justify-center py-40">
                <Loader2 className="w-12 h-12 animate-spin text-white/10" />
              </div>
            ) : (
              displayData.map((year: any, index: number) => {
                const isEven = index % 2 === 0;
                const academicYearRange = year.subtitle.split(' | ')[0];
                const classNum = year.subtitle.match(/Class (\d+)/)?.[1];
                
                return (
                  <div key={year.id} className="relative flex items-center justify-center">
                    <div className="timeline-marker w-28 h-28 text-[11px] leading-tight text-center px-1 flex flex-col items-center justify-center border-primary/20 shadow-[0_0_30px_rgba(255,191,0,0.1)]">
                      <span className="block opacity-40 mb-1">Class</span>
                      <span className="text-2xl font-black text-primary">{classNum}</span>
                      <span className="block text-[8px] opacity-40 mt-1">{academicYearRange}</span>
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-24 md:gap-48 w-full items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      <motion.div 
                        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className={`flex justify-center ${isEven ? 'md:justify-end' : 'md:justify-start'}`}
                      >
                        <div className="polaroid -rotate-2 transition-all hover:rotate-0 duration-700 max-w-[800px] w-full group shadow-[0_30px_100px_-20px_rgba(0,0,0,0.7)]">
                          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                            <Image 
                              src={year.imageUrl || `https://picsum.photos/seed/${year.id}/1200/900`}
                              alt={year.title}
                              fill
                              className="object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110"
                            />
                          </div>
                          <div className="polaroid-caption text-3xl py-12 tracking-tight">
                            {year.title} 🕊️
                          </div>
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className={`text-center md:text-left ${!isEven && 'md:text-right'}`}
                      >
                        <div className="max-w-4xl mx-auto md:mx-0 relative">
                          <div className="absolute -top-16 right-0 md:-left-12 z-20">
                            <EditJourneyDialog yearData={year} />
                          </div>
                          <h3 className="text-5xl md:text-8xl font-serif text-white mb-10 tracking-tighter leading-none">
                            {year.title}
                          </h3>
                          <p className="text-white/60 text-lg md:text-3xl leading-relaxed font-light font-serif italic tracking-tight max-w-4xl">
                            "{year.description}"
                          </p>
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
