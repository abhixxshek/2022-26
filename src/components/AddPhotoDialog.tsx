"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, Camera, ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useUser } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const QUICK_EMOJIS = ["❤️", "📸", "🎒", "🏠", "🏫", "🍱", "⚽", "✨", "🕊️", "🎓"];

export function AddPhotoDialog() {
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const { user } = useUser();
  const db = useFirestore();

  const handlePickFromGallery = () => {
    const randomId = Math.floor(Math.random() * 2000);
    setPreviewUrl(`https://picsum.photos/seed/${randomId}/1200/800`);
    toast({
      title: "Gallery Photo Selected",
      description: "Visual record identified. Add a caption to commit it to the vault."
    });
  };

  const addEmoji = (emoji: string) => {
    setCaption(prev => prev + emoji);
  };

  const handleUpload = () => {
    if (!user) return;
    if (!previewUrl || !caption) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "A visual record requires both a photo and a caption."
      });
      return;
    }

    const photosRef = collection(db, "photos");
    const photoData = {
      url: previewUrl,
      caption,
      uploadedByStudentId: user.uid,
      uploadedAt: new Date().toISOString(),
      createdAt: serverTimestamp(),
    };

    addDocumentNonBlocking(photosRef, photoData);
    
    toast({
      title: "Archived!",
      description: "Photo successfully committed to the Media Vault."
    });
    
    setCaption("");
    setPreviewUrl("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-12 py-5 bg-white text-black rounded-full font-black text-sm uppercase tracking-widest hover:bg-primary transition-all">
          <Plus className="w-4 h-4 inline-block mr-2" /> Upload Media
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-black/90 backdrop-blur-2xl border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif italic">Add to Vault</DialogTitle>
          <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-white/30">
            Contribute to the Batch 2018—25 visual archive.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="aspect-video relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 group">
            {previewUrl ? (
              <img src={previewUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="Preview" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 gap-4">
                <Camera className="w-10 h-10" />
                <p className="text-[10px] font-black uppercase tracking-widest">No Record Selected</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button onClick={handlePickFromGallery} className="bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-full">
                <ImageIcon className="w-3 h-3 mr-2" /> Select from Gallery
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-wider text-primary">Caption & Expression</label>
              <div className="flex gap-2">
                {QUICK_EMOJIS.map(e => (
                  <button 
                    key={e} 
                    type="button" 
                    onClick={() => addEmoji(e)}
                    className="hover:scale-125 transition-transform text-lg"
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <Textarea 
              placeholder="Describe this moment..." 
              className="bg-white/5 border-white/10 h-24 rounded-xl p-4 focus:ring-primary/20 text-white font-serif italic"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <Button onClick={handleUpload} className="w-full bg-white text-black font-black uppercase tracking-[0.4em] py-8 rounded-full hover:bg-primary transition-all">
            Commit to Archive
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
