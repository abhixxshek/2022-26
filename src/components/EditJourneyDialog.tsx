
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit3, Save } from "lucide-react";
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
  const db = useFirestore();

  const handleUpdate = () => {
    if (!db) return;
    const yearRef = doc(db, "journey", yearData.id);
    
    updateDocumentNonBlocking(yearRef, {
      title,
      subtitle,
      description,
    });

    toast({
      title: "Archive Updated",
      description: `The record for ${subtitle.split('|')[0]} has been refined.`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white/20 hover:text-primary transition-colors">
          <Edit3 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 border-white/10 text-white backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="font-serif italic text-2xl">Refine Journey Record</DialogTitle>
          <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-white/30">
            Edit the official historical account for this class year.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-primary">Milestone Title</label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/5 border-white/10 h-12"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-primary">Academic Range / Class</label>
            <Input 
              value={subtitle} 
              onChange={(e) => setSubtitle(e.target.value)}
              className="bg-white/5 border-white/10 h-12"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-primary">Historical Account</label>
            <Textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white/5 border-white/10 min-h-[120px] font-serif italic"
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleUpdate} className="w-full bg-white text-black font-black uppercase tracking-[0.4em] py-8 rounded-full hover:bg-primary transition-all">
            <Save className="w-4 h-4 mr-2" /> Commit Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
