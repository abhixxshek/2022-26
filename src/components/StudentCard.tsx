"use client";

import { Student } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, Home } from "lucide-react";

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/student/${student.id}`}>
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#111] border border-white/5 transition-all duration-500 group-hover:border-primary/50">
          <Image
            src={student.photo}
            alt={student.name}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-3 mb-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">
                Class {student.classYear}
              </span>
              <div className="flex items-center gap-2 text-[10px] text-white/60 font-black uppercase tracking-widest">
                <Home className="w-3 h-3 text-primary" />
                {student.house}
              </div>
            </div>
            
            <h3 className="text-2xl font-headline font-black text-white mb-2 tracking-tight group-hover:text-primary transition-colors">
              {student.name}
            </h3>
            
            <p className="text-xs text-white/60 font-light line-clamp-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 delay-75">
              {student.bio}
            </p>
          </div>

          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-50 group-hover:scale-100">
            <div className="bg-primary text-black p-3 rounded-full shadow-2xl">
              <Quote className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}