
"use client";

import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import Image from "next/image";
import { Camera, Filter } from "lucide-react";
import { AddMemoryDialog } from "@/components/AddMemoryDialog";

const GALLERY_IMAGES = [
  { id: 1, title: "Sports Meet 2024", url: "https://picsum.photos/seed/g1/800/800", class: "12" },
  { id: 2, title: "Farewell Night", url: "https://picsum.photos/seed/g2/800/1000", class: "12" },
  { id: 3, title: "Morning PT", url: "https://picsum.photos/seed/g3/800/800", class: "6" },
  { id: 4, title: "Mess Fun", url: "https://picsum.photos/seed/g4/1000/800", class: "10" },
  { id: 5, title: "Exam Prep", url: "https://picsum.photos/seed/g5/800/800", class: "10" },
  { id: 6, title: "Drama Practice", url: "https://picsum.photos/seed/g6/800/1200", class: "8" },
  { id: 7, title: "Campus Sunset", url: "https://picsum.photos/seed/g7/1200/800", class: "All" },
  { id: 8, title: "Teacher's Day", url: "https://picsum.photos/seed/g8/800/800", class: "11" },
];

export default function GalleryPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 text-primary font-bold mb-4 uppercase tracking-widest text-sm">
                <Camera className="w-4 h-4" />
                <span>Captured Moments</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-headline font-bold mb-6">Gallery of <span className="text-primary">Life</span></h1>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                A visual journey through seven years of laughter, tears, and growth. 
                Every picture tells a story of the halls we called home.
              </p>
            </motion.div>

            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/10 transition-all">
                <Filter className="w-4 h-4" /> Filter
              </button>
              <AddMemoryDialog />
            </div>
          </div>

          {/* Masonry-like Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {GALLERY_IMAGES.map((img, idx) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative group break-inside-avoid rounded-3xl overflow-hidden border border-white/5 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 p-6 flex flex-col justify-end">
                  <p className="text-primary text-xs font-bold uppercase mb-1">Class {img.class}</p>
                  <h3 className="text-xl font-bold font-headline">{img.title}</h3>
                </div>
                <Image 
                  src={img.url} 
                  alt={img.title}
                  width={800}
                  height={1200}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-20 text-center">
            <button className="px-10 py-4 rounded-full border border-white/10 hover:border-primary/50 transition-colors font-bold uppercase tracking-widest text-sm text-muted-foreground hover:text-primary">
              Load More Memories
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
