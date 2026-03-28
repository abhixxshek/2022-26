"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit3, Save, ImageIcon, Camera } from "lucide-react";
import { doc } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { toast } from "@/hooks/use-toast";

interface EditJourneyDialogProps {
  yearData: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    imageUrl?: string;
  };
}

export function EditJourneyDialog({ yearData }: EditJourneyDialogProps) {
  const [title, setTitle] = useState(yearData.title);
  const [subtitle, setSubtitle] = useState(yearData.subtitle);
  const [description, setDescription] = useState(yearData.description);
  const [imageUrl, setImageUrl] = useState(yearData.imageUrl || "");
  const db = useFirestore();

  const handlePickFromGallery = () => {
    const randomId = Math.floor(Math.random() * 2000);
    setImageUrl(`https://picsum.photos/seed/${randomId}/800/800`);
    toast({
      title: "Visual Selected",
      description: "A new record from the gallery has been queued."
    });
  };

  const handleUpdate = () => {
    if (!db) return;
    const yearRef = doc(db, "journey", yearData.id);
    
    updateDocumentNonBlocking(yearRef, {
      title,
      subtitle,
      description,
      imageUrl,
    });

    toast({
      title: "Archive Updated",
      description: `The record for ${subtitle.split('|')[0]} has been refined.`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white/20 hover:text-primary transition-colors bg-black/40 backdrop-blur-sm rounded-full w-10 h-10 border border-white/5">
          <Edit3 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/95 border-white/10 text-white backdrop-blur-2xl max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-serif italic text-2xl">Refine Journey Record</DialogTitle>
          <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-white/30">
            Edit the official historical account and visual for this class year.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Image Preview & Edit */}
          <div className="space-y-3">
            <label className="text-[9px] font-black uppercase tracking-widest text-primary">Class Visual</label>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 group">
              {imageUrl ? (
                <img src={imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="Year Preview" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10 gap-2">
                  <Camera className="w-8 h-8" />
                  <p className="text-[9px] font-black uppercase tracking-widest">No Visual Attached</p>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button onClick={handlePickFromGallery} className="bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-full hover:bg-primary">
                  <ImageIcon className="w-3 h-3 mr-2" /> Change from Gallery
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-primary">Milestone Title</label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Arrival"
                className="bg-white/5 border-white/10 h-12 text-sm focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-primary">Time Lapse (e.g. 2018-19)</label>
              <Input 
                value={subtitle} 
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="2018-19 | Class 6"
                className="bg-white/5 border-white/10 h-12 text-sm focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-primary">Historical Account</label>
            <Textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the feelings and events of this year..."
              className="bg-white/5 border-white/10 min-h-[140px] font-serif italic text-lg leading-relaxed focus:ring-primary/20"
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleUpdate} className="w-full bg-white text-black font-black uppercase tracking-[0.4em] py-8 rounded-full hover:bg-primary transition-all shadow-xl shadow-white/5">
            <Save className="w-4 h-4 mr-2" /> Commit Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}