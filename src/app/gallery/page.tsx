"use client";

import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import Image from "next/image";
import { Camera, Filter, Compass, History } from "lucide-react";
import { AddMemoryDialog } from "@/components/AddMemoryDialog";
import { useState } from "react";

const GALLERY_IMAGES = [
  { id: 1, title: "Migration Train", url: "https://picsum.photos/seed/g1/800/1200", category: "Migration" },
  { id: 2, title: "Sunday Mess Rush", url: "https://picsum.photos/seed/g2/1000/800", category: "Daily" },
  { id: 3, title: "House Assembly", url: "https://picsum.photos/seed/g3/800/800", category: "Daily" },
  { id: 4, title: "Board Exam Prep", url: "https://picsum.photos/seed/g4/800/1000", category: "Academic" },
  { id: 5, title: "Farewell 2025", url: "https://picsum.photos/seed/g5/1200/800", category: "Farewell" },
  { id: 6, title: "First Day 2018", url: "https://picsum.photos/seed/g6/800/1200", category: "Daily" },
  { id: 7, title: "Sports Meet", url: "https://picsum.photos/seed/g7/800/800", category: "Sports" },
  { id: 8, title: "Mess Rituals", url: "https://picsum.photos/seed/g8/1000/800", category: "Daily" },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Migration", "Daily", "Farewell", "Sports", "Academic"];

  const filteredImages = filter === "All" 
    ? GALLERY_IMAGES 
    : GALLERY_IMAGES.filter(img => img.category === filter);

  return (
    <div className="bg-[#050505] text-foreground min-h-screen">
      <Navbar />

      <main className="pt-40 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 text-primary font-black mb-6 uppercase tracking-[0.4em] text-[10px]">
                <History className="w-4 h-4" />
                <span>Captured Moments</span>
              </div>
              <h1 className="text-6xl md:text-[8rem] font-headline font-black mb-8 leading-none tracking-tighter">
                The <span className="text-gradient">Gallery</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed font-light font-body">
                Every photo is a fragment of the seven years we spent together. From the 
                first day we entered the gates to the last walk out.
              </p>
            </motion.div>

            <div className="flex flex-wrap gap-4">
              <AddMemoryDialog />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-16 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-[10px] uppercase font-black tracking-widest transition-all border ${
                  filter === cat 
                    ? "bg-primary border-primary text-black" 
                    : "bg-transparent border-white/10 text-muted-foreground hover:border-primary/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry-like Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-12 space-y-12">
            {filteredImages.map((img, idx) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="relative group break-inside-avoid rounded-2xl overflow-hidden border border-white/5 cursor-pointer bg-[#111]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 p-8 flex flex-col justify-end">
                  <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-2">{img.category}</p>
                  <h3 className="text-2xl font-black font-headline text-white">{img.title}</h3>
                </div>
                <Image 
                  src={img.url} 
                  alt={img.title}
                  width={800}
                  height={1200}
                  className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
              </motion.div>
            ))}
          </div>

          {/* Bottom Call to Action */}
          <div className="mt-40 text-center py-20 border-t border-white/5">
            <h4 className="text-2xl font-headline font-black mb-6">Missing a moment?</h4>
            <AddMemoryDialog />
          </div>
        </div>
      </main>
    </div>
  );
}