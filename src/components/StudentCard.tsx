
"use client";

import { Student } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Trash2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
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

interface StudentCardProps {
  student: Student & { nickname?: string };
}

export function StudentCard({ student }: StudentCardProps) {
  const { user } = useUser();
  const db = useFirestore();

  const currentUserRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "students", user.uid);
  }, [db, user]);

  const { data: currentUserData } = useDoc(currentUserRef);

  const houseColorClass = "text-primary";

  const houseBgClass = "bg-primary";

  const handleConfirmDelete = () => {
    if (!student.id || !db) return;
    toast({ title: "Initiating Purge", description: "Expunging record from the master archive..." });
    const recordRef = doc(db, "students", student.id);
    deleteDocumentNonBlocking(recordRef, "Record Removed");
  };

  const isAdmin = currentUserData?.role === "admin";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative"
    >
      {isAdmin && (
        <div className="absolute top-4 right-4 z-40 opacity-100 transition-opacity">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="w-12 h-12 rounded-full bg-red-600 hover:bg-primary hover:text-black shadow-2xl border-2 border-white/20 animate-pulse hover:animate-none"
                title="PURGE RECORD"
              >
                <Trash2 className="w-6 h-6" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-black/90 border-white/10 text-white backdrop-blur-2xl rounded-[2rem]">
              <AlertDialogHeader>
                <div className="flex justify-center mb-4">
                  <ShieldAlert className="w-16 h-16 text-red-600" />
                </div>
                <AlertDialogTitle className="font-serif italic text-3xl text-center">Master Purge Confirmation</AlertDialogTitle>
                <AlertDialogDescription className="text-white/40 text-[10px] uppercase font-black tracking-widest text-center mt-2 leading-relaxed">
                  You are about to permanently delete {student.name}'s identity and history from the Batch '22 digital archive. This action is irreversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-10 gap-4">
                <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-full h-14 uppercase font-black text-[10px] tracking-widest px-8 flex-1">
                  Abadon Purge
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-red-600 hover:bg-primary hover:text-black text-white rounded-full h-14 uppercase font-black text-[10px] tracking-widest px-8 flex-1 transition-all"
                >
                  Confirm Removal
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <Link href={`/student/${student.id}`}>
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#080808] border border-white/5 transition-all duration-700 hover:border-white/20">
          <Image
            src={student.photo || `https://picsum.photos/seed/${student.id}/400/500`}
            alt={student.name}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          <div className={cn("absolute top-0 left-0 w-full h-1 z-20 opacity-60 group-hover:opacity-100 transition-opacity", houseBgClass)} />

          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700" />

          <div className="absolute bottom-0 left-0 right-0 p-8 space-y-2">
            <h3 className="text-xl font-serif text-white tracking-tight group-hover:text-primary transition-colors duration-500">
              {student.name}
            </h3>

            <div className="flex flex-col gap-1">
              <p className={cn("text-[9px] font-black uppercase tracking-[0.2em] transition-colors", houseColorClass)}>
                INFORMATION TECHNOLOGY
              </p>
              <p className="text-[8px] font-mono text-white/20 uppercase tracking-[0.1em]">
                {student.id.substring(0, 10).toUpperCase()}
              </p>
            </div>
          </div>

          <div className="absolute top-0 left-0 right-0 p-8 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out bg-black/80 backdrop-blur-md border-b border-white/10">
            <p className="text-[10px] text-white/80 font-light leading-relaxed italic font-serif line-clamp-4">
              "{student.bio || "A true GECian at heart."}"
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
