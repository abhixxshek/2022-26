
"use client";

import { ShieldAlert } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-[#050505] text-white font-serif selection:bg-primary/20">
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-8">
            <div className="mx-auto w-24 h-24 rounded-full bg-red-600/10 flex items-center justify-center text-red-600">
              <ShieldAlert className="w-12 h-12" />
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-black uppercase tracking-tighter">Critical Failure</h1>
              <p className="text-[10px] uppercase font-black tracking-[0.4em] text-white/30">Master Archive Connection Lost</p>
              <p className="text-white/60 italic font-light leading-relaxed">
                A root-level system error has occurred. The digital archive cannot be initialized.
              </p>
            </div>
            <button 
              onClick={() => reset()}
              className="px-12 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all"
            >
              Reboot Archive
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
