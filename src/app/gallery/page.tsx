"use client";

import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import Image from "next/image";
import { Camera, ArrowUpDown, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { AddPhotoDialog } from "@/components/AddPhotoDialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const FILTERS = [
  "All Memories",
  "1st yr",
  "2nd yr",
  "3rd yr",
  "4th yr",
  "Fiesta'25"
];

export default function GalleryPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All Memories");

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/auth");
    }
  }, [user, isUserLoading, router]);

  const photosQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, "photos"), orderBy("uploadedAt", "desc"));
  }, [db, user]);

  const { data: photos, isLoading } = useCollection(photosQuery);

  if (isUserLoading) return null;

  return (
    <div className="bg-[#0c0c0c] text-foreground min-h-screen selection:bg-primary/20">
      <Navbar />

      <main className="pt-40 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-8xl font-serif text-white mb-6">
                The Archive
              </h1>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <p className="text-lg text-white/40 max-w-xl font-light leading-relaxed">
                  A cinematic collection of fleeting moments, frozen in time. From the first lecture to the final goodbye.
                </p>
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    className="bg-transparent border-white/10 text-white/60 hover:text-white hover:bg-white/5 rounded-full px-6 h-12 text-[10px] font-black uppercase tracking-widest gap-3"
                  >
                    <ArrowUpDown className="w-4 h-4 text-primary" />
                    Newest First
                  </Button>
                  <AddPhotoDialog />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filter Pills */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-3 mb-16"
          >
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                  activeFilter === filter
                    ? "bg-primary text-black border-primary shadow-lg shadow-primary/20"
                    : "bg-white/5 text-white/40 border-white/10 hover:border-white/20"
                )}
              >
                {filter}
              </button>
            ))}
          </motion.div>

          {/* Visual Grid */}
          {isLoading || isUserLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-white/5 animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {photos?.map((img: any, idx) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className="relative group rounded-3xl overflow-hidden border border-white/5 bg-[#111] aspect-[4/3] cursor-pointer"
                >
                  <Image 
                    src={img.url} 
                    alt={img.caption || "Archive Photo"}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 p-8 flex flex-col justify-end">
                    <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-2">ARCHIVE RECORD</p>
                    <h3 className="text-xl font-bold font-headline text-white line-clamp-2">{img.caption}</h3>
                  </div>
                </motion.div>
              ))}
              
              {photos?.length === 0 && !isLoading && (
                <div className="col-span-full py-40 text-center border border-dashed border-white/5 rounded-3xl">
                  <Camera className="w-12 h-12 text-white/5 mx-auto mb-6" />
                  <p className="text-white/20 font-black uppercase tracking-[0.5em] text-sm">
                    The archive is currently empty.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
