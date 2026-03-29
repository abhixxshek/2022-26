
"use client";

import { Student } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { toast } from "@/hooks/use-toast";

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  const { user } = useUser();
  const db = useFirestore();

  const studentRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "students", user.uid);
  }, [db, user]);

  const { data: studentData } = useDoc(studentRef);

  const houseColorClass = {
    Aravalli: "text-aravalli",
    Nilgiri: "text-nilgiri",
    Shivalik: "text-shivalik",
    Udaygiri: "text-udaygiri",
  }[student.house];

  const houseBgClass = {
    Aravalli: "bg-aravalli",
    Nilgiri: "bg-nilgiri",
    Shivalik: "bg-shivalik",
    Udaygiri: "bg-udaygiri",
  }[student.house];

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Are you sure you want to remove ${student.name}'s record from the yearbook?`)) return;
    
    const docRef = doc(db, "students", student.id);
    deleteDocumentNonBlocking(docRef);
    toast({ 
      title: "Record Removed", 
      description: "The student record has been deleted by administrator." 
    });
  };

  const isAdmin = studentData?.role === "admin";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative"
    >
      {/* Admin Delete Button */}
      {isAdmin && (
        <Button 
          variant="destructive" 
          size="icon" 
          onClick={handleDelete}
          className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}

      <Link href={`/student/${student.id}`}>
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#080808] border border-white/5 transition-all duration-700 hover:border-white/20">
          <Image
            src={student.photo}
            alt={student.name}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          
          <div className={cn("absolute top-0 left-0 w-full h-1 z-20 opacity-60 group-hover:opacity-100 transition-opacity", houseBgClass)} />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 space-y-2">
            <h3 className="text-2xl font-serif text-white tracking-tight group-hover:text-primary transition-colors duration-500">
              {student.name}
            </h3>
            
            <div className="flex flex-col gap-1">
              <p className={cn("text-[9px] font-black uppercase tracking-[0.2em] transition-colors", houseColorClass)}>
                {student.house} House
              </p>
              <p className="text-[8px] font-mono text-white/20 uppercase tracking-[0.1em]">
                {student.id.substring(0, 10).toUpperCase()}
              </p>
            </div>
          </div>

          <div className="absolute top-0 left-0 right-0 p-8 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out bg-black/60 backdrop-blur-sm border-b border-white/10">
            <p className="text-[10px] text-white/60 font-light leading-relaxed italic font-serif">
              "{student.bio || "A true Navodayan at heart."}"
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
