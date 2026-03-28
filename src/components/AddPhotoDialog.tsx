
"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Camera, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useUser } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { EmojiPicker } from "@/components/EmojiPicker";

export function AddPhotoDialog() {
  const [caption, setCaption] = useState("");
  const [classYear, setClassYear] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isReading, setIsReading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const db = useFirestore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Increased to 5MB
    if (file.size > 5 * 1024 * 1024) { 
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Please select an image smaller than 5MB for the archive."
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
    if (!previewUrl || !caption || !classYear) {
      toast({
        variant: "destructive",
        title: "Incomplete Record",
        description: "Please select a photo, choose a class, and add a caption."
      });
      return;
    }

    const photosRef = collection(db, "photos");
    const photoData = {
      url: previewUrl,
      caption,
      classYearLabel: `Class ${classYear}`,
      uploadedByStudentId: user.uid,
      uploadedAt: new Date().toISOString(),
      createdAt: serverTimestamp(),
    };

    addDocumentNonBlocking(photosRef, photoData);
    
    toast({
      title: "Committed to Vault",
      description: `Your record for Class ${classYear} has been archived.`
    });
    
    setCaption("");
    setClassYear("");
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
            Select a photo and identify which class year it belongs to.
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
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-primary">Class Identification</label>
              <Select onValueChange={setClassYear} value={classYear}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white h-12">
                  <SelectValue placeholder="Which class year?" />
                </SelectTrigger>
                <SelectContent className="bg-black text-white border-white/10">
                  {[6, 7, 8, 9, 10, 11, 12].map(y => (
                    <SelectItem key={y} value={y.toString()}>Class {y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
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
