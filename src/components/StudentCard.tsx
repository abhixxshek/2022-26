"use client";

import { Student } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Link href={`/student/${student.id}`}>
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#080808] border border-white/5 transition-all duration-700 hover:border-white/20">
          <Image
            src={student.photo}
            alt={student.name}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
          
          {/* Content Area */}
          <div className="absolute bottom-0 left-0 right-0 p-8 space-y-2">
            <h3 className="text-2xl font-serif text-white tracking-tight group-hover:text-primary transition-colors duration-500">
              {student.name}
            </h3>
            
            <div className="flex flex-col gap-1">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60 transition-colors">
                {student.house} House
              </p>
              <p className="text-[8px] font-mono text-primary uppercase tracking-[0.1em] opacity-60">
                {student.id.substring(0, 10).toUpperCase()}
              </p>
            </div>
          </div>

          {/* Subtle Hover Reveal Effect for Bio */}
          <div className="absolute top-0 left-0 right-0 p-8 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out bg-black/60 backdrop-blur-sm">
            <p className="text-[10px] text-white/60 font-light leading-relaxed italic font-serif">
              "{student.bio || "A true Navodayan at heart."}"
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
