
"use client";

import { Student } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

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
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted border border-white/10 group-hover:border-primary/50 transition-colors">
          <Image
            src={student.photo}
            alt={student.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Class {student.classYear}</p>
            <h3 className="text-xl font-bold font-headline mb-2">{student.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {student.bio}
            </p>
          </div>

          <div className="absolute top-4 right-4 bg-primary/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Quote className="w-4 h-4 text-primary" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
