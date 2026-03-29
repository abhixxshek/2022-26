
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("Archival System Error:", error);
  }, [error]);

  const isPermissionError = error.message?.includes("Missing or insufficient permissions");

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 selection:bg-primary/20">
      <div className="max-w-md w-full text-center space-y-12">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-red-600/10 flex items-center justify-center text-red-600 mb-6">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-serif italic text-white mb-2">
            {isPermissionError ? "Access Denied" : "System Anomaly"}
          </h1>
          <p className="text-[10px] uppercase font-black tracking-[0.4em] text-white/30">
            {isPermissionError ? "Archival Entry Restricted" : "Master Record Processing Failed"}
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] space-y-4">
          <p className="text-white/60 text-sm leading-relaxed font-light font-serif italic">
            {isPermissionError 
              ? "Your current authority level does not allow access to this archival record. Please ensure you are authorized via the Batch '25 Entry Key."
              : "We encountered a fragmentation in the digital vault. This record could not be retrieved at this time."}
          </p>
          {process.env.NODE_ENV === 'development' && (
             <div className="p-4 bg-black/40 rounded-xl text-left overflow-auto max-h-40">
               <code className="text-[10px] text-red-400 font-mono break-all">{error.message}</code>
             </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => reset()}
            className="flex-1 bg-white text-black hover:bg-primary transition-all rounded-full h-16 text-[10px] font-black uppercase tracking-widest gap-2"
          >
            <RefreshCcw className="w-4 h-4" /> Retry Retrieval
          </Button>
          <Button 
            asChild
            variant="outline"
            className="flex-1 border-white/10 text-white hover:bg-white/5 rounded-full h-16 text-[10px] font-black uppercase tracking-widest gap-2"
          >
            <Link href="/">
              <Home className="w-4 h-4" /> Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
