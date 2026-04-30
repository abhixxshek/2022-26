
"use client";

import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import Image from "next/image";
import { Camera, ArrowUpDown, X, Loader2, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from "@/firebase";
import { collection, query, orderBy, where, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { AddPhotoDialog } from "@/components/AddPhotoDialog";
import { Button } from "@/components/ui/button";
import { updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function GalleryContent() {
  const db = useFirestore();
  const { user } = useUser();
  const router = useRouter();


  const studentRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "students", user.uid);
  }, [db, user]);

  const { data: studentData } = useDoc(studentRef);



  const photosQuery = useMemoFirebase(() => {
    if (!db) return null;
    const baseCollection = collection(db, "photos");
    return query(baseCollection, orderBy("uploadedAt", "desc"));
  }, [db]);

  const { data: photos, isLoading } = useCollection(photosQuery);

  const clearFilter = () => {
    router.push("/gallery");
  };

  const handleConfirmDelete = (id: string) => {
    if (!id || !db) return;
    toast({ title: "Initiating Purge", description: "Connecting to the master vault..." });
    const photoRef = doc(db, "photos", id);
    deleteDocumentNonBlocking(photoRef);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    if (!photos || !db) return;
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= photos.length) return;

    const photoA = photos[index];
    const photoB = photos[newIndex];

    // Swap timestamps to effectively reorder in the "uploadedAt desc" query
    const timeA = photoA.uploadedAt;
    const timeB = photoB.uploadedAt;

    updateDocumentNonBlocking(doc(db, "photos", photoA.id), { uploadedAt: timeB });
    updateDocumentNonBlocking(doc(db, "photos", photoB.id), { uploadedAt: timeA });
    
    toast({ title: "Archive Reordered", description: "The visual flow has been updated." });
  };

  const isAdmin = studentData?.role === "admin";

  return (
    <main className="pt-28 md:pt-40 pb-32 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif text-white mb-6">
              The Vault
            </h1>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
              <div className="space-y-4">
                <p className="text-lg text-white/40 max-w-xl font-light leading-relaxed">
                  A cinematic collection of fleeting moments, frozen in time. From the first lecture to the final goodbye of Batch '22.
                </p>

              </div>
              <div className="flex flex-wrap items-center gap-3 md:gap-4">
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
                <img
                  src={img.url}
                  alt={img.caption || "Archive Photo"}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                />

                {isAdmin && (
                  <div className="absolute top-4 inset-x-4 z-40 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        disabled={idx === 0}
                        onClick={() => handleMove(idx, 'left')}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-white disabled:opacity-20"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        disabled={idx === (photos?.length || 0) - 1}
                        onClick={() => handleMove(idx, 'right')}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-white disabled:opacity-20"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 shadow-2xl"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-black/90 border-white/10 text-white backdrop-blur-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-serif italic text-2xl">Purge Visual from Vault?</AlertDialogTitle>
                          <AlertDialogDescription className="text-white/40 text-[10px] uppercase font-black tracking-widest">
                            This action will permanently remove this visual record from the master vault.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-8 gap-4">
                          <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-full h-12 uppercase font-black text-[9px] tracking-widest px-8">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleConfirmDelete(img.id)}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-full h-12 uppercase font-black text-[9px] tracking-widest px-8"
                          >
                            Confirm Purge
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 p-8 flex flex-col justify-end">

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
