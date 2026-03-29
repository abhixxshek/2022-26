"use client";

import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import Image from "next/image";
import { Camera, ArrowUpDown, X, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from "@/firebase";
import { collection, query, orderBy, where, doc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { AddPhotoDialog } from "@/components/AddPhotoDialog";
import { Button } from "@/components/ui/button";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { toast } from "@/hooks/use-toast";

function GalleryContent() {
  const db = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filterClass, setFilterClass] = useState<string | null>(null);

  const studentRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "students", user.uid);
  }, [db, user]);

  const { data: studentData } = useDoc(studentRef);

  useEffect(() => {
    const classParam = searchParams.get("class");
    if (classParam) {
      const formatted = classParam.startsWith("Class") ? classParam : `Class ${classParam}`;
      setFilterClass(formatted);
    } else {
      setFilterClass(null);
    }
  }, [searchParams]);

  const photosQuery = useMemoFirebase(() => {
    if (!db) return null;
    const baseCollection = collection(db, "photos");
    if (filterClass) {
      return query(
        baseCollection, 
        where("classYearLabel", "==", filterClass),
        orderBy("uploadedAt", "desc")
      );
    }
    return query(baseCollection, orderBy("uploadedAt", "desc"));
  }, [db, filterClass]);

  const { data: photos, isLoading } = useCollection(photosQuery);

  const clearFilter = () => {
    router.push("/gallery");
  };

  const handleDelete = (id: string) => {
    if (!id || !db) return;
    if (!confirm("Are you sure you want to permanently remove this photo from the archive?")) return;
    
    toast({ title: "Initiating Purge", description: "Connecting to the master vault..." });
    const photoRef = doc(db, "photos", id);
    deleteDocumentNonBlocking(photoRef, "Visual Purged");
  };

  const isAdmin = studentData?.role === "admin";

  return (
    <main className="pt-40 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-serif text-white mb-6">
              The Vault
            </h1>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <p className="text-lg text-white/40 max-w-xl font-light leading-relaxed">
                  A cinematic collection of fleeting moments, frozen in time. From the first lecture to the final goodbye of Batch '25.
                </p>
                {filterClass && (
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">FILTERED BY:</span>
                    <button 
                      onClick={clearFilter}
                      className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all"
                    >
                      {filterClass}
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
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

        {isLoading ? (
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
                className="relative group rounded-3xl overflow-hidden border border-white/5 bg-[#111] aspect-[4/3]"
              >
                <Image 
                  src={img.url} 
                  alt={img.caption || "Archive Photo"}
                  fill
                  className="object-cover transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                />
                
                {isAdmin && (
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(img.id);
                    }} 
                    className="absolute top-4 right-4 z-40 w-10 h-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 shadow-2xl"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 p-8 flex flex-col justify-end">
                  <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-2">
                    {img.classYearLabel || "ARCHIVE RECORD"}
                  </p>
                  <h3 className="text-xl font-bold font-headline text-white line-clamp-2">{img.caption}</h3>
                </div>
              </motion.div>
            ))}
            
            {photos?.length === 0 && !isLoading && (
              <div className="col-span-full py-40 text-center border border-dashed border-white/5 rounded-3xl">
                <Camera className="w-12 h-12 text-white/5 mx-auto mb-6" />
                <p className="text-white/20 font-black uppercase tracking-[0.5em] text-sm">
                  {filterClass ? `No photos found for ${filterClass}.` : "The archive is currently empty."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function GalleryPage() {
  return (
    <div className="bg-[#0c0c0c] text-foreground min-h-screen selection:bg-primary/20">
      <Navbar />
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      }>
        <GalleryContent />
      </Suspense>
    </div>
  );
}
