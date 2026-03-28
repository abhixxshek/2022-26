"use client";

import { Student } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group"
    >
      <Link href={`/student/${student.id}`}>
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-muted border border-white/5 group-hover:border-primary/50 transition-all duration-500 shadow-lg">
          <Image
            src={student.photo}
            alt={student.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="bg-primary/20 text-primary border-none text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">
                Class {student.classYear}
              </Badge>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                <Home className="w-3 h-3" />
                {student.house}
              </div>
            </div>
            <h3 className="text-2xl font-bold font-headline mb-3 text-white group-hover:text-primary transition-colors">{student.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 font-light">
              {student.bio}
            </p>
          </div>

          <div className="absolute top-6 right-6 bg-primary text-primary-foreground p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 rotate-12 group-hover:rotate-0 shadow-xl">
            <Quote className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
