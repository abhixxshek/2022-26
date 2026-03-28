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
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#080808] border border-white/5 transition-all duration-700 group-hover:border-primary/40 group-hover:shadow-[0_20px_60px_-15px_rgba(255,215,0,0.1)]">
          <Image
            src={student.photo}
            alt={student.name}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700" />
          
          <div className="absolute bottom-0 left-0 right-0 p-10 z-10">
            <div className="flex items-center gap-4 mb-6 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-6 group-hover:translate-y-0">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                CL. {student.classYear}
              </span>
              <div className="flex items-center gap-2 text-[9px] text-white/60 font-black uppercase tracking-[0.3em]">
                <Home className="w-3 h-3 text-primary" />
                {student.house}
              </div>
            </div>
            
            <h3 className="text-3xl font-serif italic text-white mb-3 tracking-tight group-hover:text-primary transition-colors duration-500">
              {student.name}
            </h3>
            
            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] line-clamp-1 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-6 group-hover:translate-y-0 delay-100">
              {student.bio}
            </p>
          </div>

          <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-700 transform scale-50 group-hover:scale-100">
            <div className="bg-primary text-black p-4 rounded-full shadow-2xl">
              <Quote className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
