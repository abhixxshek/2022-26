"use client";

import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import Image from "next/image";
import { Camera, Plus } from "lucide-react";
import { useEffect } from "react";
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function GalleryPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

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
                <Camera className="w-4 h-4" />
                <span>The Visual Archive</span>
              </div>
              <h1 className="text-6xl md:text-[8rem] font-black mb-8 leading-none tracking-tighter uppercase">
                Media <span className="text-gradient">Vault</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed font-light font-body">
                Every photo is a fragment of the seven years we spent together. Captured 
                and preserved in the vault forever.
              </p>
            </motion.div>

            <button className="px-12 py-5 bg-white text-black rounded-full font-black text-sm uppercase tracking-widest hover:bg-primary transition-all">
              <Plus className="w-4 h-4 inline-block mr-2" /> Upload Media
            </button>
          </div>

          {/* Masonry-like Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-12 space-y-12">
            {isLoading || isUserLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="aspect-video bg-white/5 animate-pulse rounded-2xl" />
              ))
            ) : (
              photos?.map((img: any, idx) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="relative group break-inside-avoid rounded-2xl overflow-hidden border border-white/5 cursor-pointer bg-[#111]"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 p-8 flex flex-col justify-end">
                    <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-2">ARCHIVE RECORD</p>
                    <h3 className="text-2xl font-black font-headline text-white">{img.caption}</h3>
                  </div>
                  <Image 
                    src={img.url} 
                    alt={img.caption}
                    width={800}
                    height={1200}
                    className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                </motion.div>
              ))
            )}
            {photos?.length === 0 && !isLoading && (
              <p className="col-span-full text-center py-40 text-white/20 font-black uppercase tracking-[0.5em]">The vault is currently empty.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}