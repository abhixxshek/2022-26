"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Camera, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useUser } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { EmojiPicker } from "@/components/EmojiPicker";

export function AddPhotoDialog() {
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isReading, setIsReading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const db = useFirestore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { // 1MB limit for Firestore Base64 strings
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Please select an image smaller than 1MB for the archive."
      });
      return;
    }

    setIsReading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
      setIsReading(false);
      toast({
        title: "Visual Identified",
        description: "Your photo has been prepared for the archive."
      });
    };
    reader.readAsDataURL(file);
  };

  const handlePickFromGallery = () => {
    fileInputRef.current?.click();
  };

  const addEmoji = (emoji: string) => {
    setCaption(prev => prev + emoji);
  };

  const handleUpload = () => {
    if (!user) return;
    if (!previewUrl || !caption) {
      toast({
        variant: "destructive",
        title: "Incomplete Record",
        description: "Please select a photo and add a caption."
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
      title: "Committed to Vault",
      description: "Your visual record has been successfully archived."
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
            Select a photo from your gallery to contribute to the archive.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
          
          <div className="aspect-video relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 group">
            {previewUrl ? (
              <img src={previewUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="Preview" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 gap-4">
                {isReading ? <Loader2 className="w-10 h-10 animate-spin" /> : <Camera className="w-10 h-10" />}
                <p className="text-[10px] font-black uppercase tracking-widest">
                  {isReading ? "Analyzing Image..." : "No Record Selected"}
                </p>
              </div>
            )}
            {!isReading && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button onClick={handlePickFromGallery} className="bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-full">
                  <ImageIcon className="w-3 h-3 mr-2" /> Open Gallery
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-wider text-primary">Caption & Expression</label>
              <EmojiPicker onEmojiSelect={addEmoji} />
            </div>
            <Textarea 
              placeholder="Describe this moment..." 
              className="bg-white/5 border-white/10 h-24 rounded-xl p-4 focus:ring-primary/20 text-white font-serif italic"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleUpload} 
            disabled={isReading || !previewUrl}
            className="w-full bg-white text-black font-black uppercase tracking-[0.4em] py-8 rounded-full hover:bg-primary transition-all disabled:opacity-50"
          >
            Commit to Archive
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
