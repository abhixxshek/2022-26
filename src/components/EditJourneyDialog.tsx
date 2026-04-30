
"use client";

import { useState, useRef, ReactNode, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit3, Save, ImageIcon, Camera, Loader2, ShieldAlert } from "lucide-react";
import { doc } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { setDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { toast } from "@/hooks/use-toast";
import { EmojiPicker } from "@/components/EmojiPicker";
import { ImageAdjuster } from "@/components/ImageAdjuster";
import heic2any from "heic2any";

interface EditJourneyDialogProps {
  yearData: {
    id: string;
    order: number;
    title: string;
    subtitle: string;
    description: string;
    imageUrl?: string;
  };
  trigger?: ReactNode;
}

export function EditJourneyDialog({ yearData, trigger }: EditJourneyDialogProps) {
  const [title, setTitle] = useState(yearData.title);
  const [subtitle, setSubtitle] = useState(yearData.subtitle);
  const [description, setDescription] = useState(yearData.description);
  const [imageUrl, setImageUrl] = useState(yearData.imageUrl || "");
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [isAdjusterOpen, setIsAdjusterOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const db = useFirestore();
  const [isCompressing, setIsCompressing] = useState(false);

  const compressImage = (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new (window as any).Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1280; // Optimized for 16:9 cinematic display
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = (height / width) * maxDim;
            width = maxDim;
          } else {
            width = (width / height) * maxDim;
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = dataUrl;
    });
  };


  useEffect(() => {
    if (isOpen) {
      setTitle(yearData.title);
      setSubtitle(yearData.subtitle);
      setDescription(yearData.description);
      setImageUrl(yearData.imageUrl || "");
    }
  }, [isOpen, yearData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Please select an archival visual smaller than 5MB."
      });
      return;
    }

    setIsReading(true);

    let currentFile = file;
    // Handle HEIC/HEIF files
    if (file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif")) {
      try {
        const heic2any = (await import("heic2any")).default;
        const blob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8
        });
        currentFile = new File([Array.isArray(blob) ? blob[0] : blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: "image/jpeg" });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Conversion Failed",
          description: `Could not convert HEIC file: ${file.name}`
        });
        setIsReading(false);
        return;
      }
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      setTempImageUrl(dataUri);
      setIsAdjusterOpen(true);
      setIsReading(false);
    };
    reader.readAsDataURL(currentFile);
    e.target.value = '';
  };

  const handleSaveAdjustedImage = async (adjustedImage: string) => {
    setIsCompressing(true);
    try {
      const compressed = await compressImage(adjustedImage);
      setImageUrl(compressed);
      setIsAdjusterOpen(false);
      setTempImageUrl(null);
      toast({
        title: "Historical Frame Adjusted",
        description: "The cinematic record has been perfectly captured and optimized."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Compression Failed",
        description: "Could not optimize the image for the vault."
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const handleUpdate = () => {
    if (!db) return;
    const yearRef = doc(db, "journey", yearData.id);
    
    setDocumentNonBlocking(yearRef, {
      title,
      subtitle,
      description,
      imageUrl,
      order: yearData.order,
    }, { merge: true });

    toast({
      title: "Archive Committed",
      description: `The history for ${subtitle.split('|')[0]} has been updated in the master vault.`,
    });
    
    setIsOpen(false);
  };

  return (
    <>
      {tempImageUrl && (
        <ImageAdjuster
          image={tempImageUrl}
          isOpen={isAdjusterOpen}
          onClose={() => {
            setIsAdjusterOpen(false);
            setTempImageUrl(null);
          }}
          onSave={handleSaveAdjustedImage}
          aspectRatio={16 / 9}
        />
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button 
              className="bg-[#FFBF00] text-black hover:bg-white transition-all rounded-full h-12 px-8 gap-3 font-black uppercase text-[10px] tracking-[0.2em] shadow-[0_0_30px_rgba(255,191,0,0.6)] border-2 border-white/20 animate-pulse hover:animate-none scale-110"
            >
              <Edit3 className="w-4 h-4" /> EDIT HISTORY
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="bg-black/95 border-white/10 text-white backdrop-blur-2xl max-w-2xl rounded-[2.5rem] p-0 overflow-hidden">
          <div className="p-10 border-b border-white/5 bg-white/[0.02]">
            <DialogHeader>
              <DialogTitle className="font-serif italic text-3xl flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-primary" />
                Refine Journey Record
              </DialogTitle>
              <DialogDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mt-2">
                Curate the official historical account and cinematic visual for this milestone.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-10 space-y-10">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Cinematic Visual (16:9)</label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-white/40 hover:text-primary text-[9px] uppercase font-black tracking-widest"
                >
                  <Camera className="w-3 h-3 mr-2" /> Replace Photo
                </Button>
              </div>
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/10 group shadow-2xl">
                {imageUrl ? (
                  <img src={imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Year Preview" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10 gap-4">
                    {(isReading || isCompressing) ? <Loader2 className="w-10 h-10 animate-spin" /> : <ImageIcon className="w-10 h-10" />}
                    <p className="text-[10px] font-black uppercase tracking-widest">
                      {isReading ? "Processing Visual..." : isCompressing ? "Optimizing Visual..." : "No Archival Visual"}
                    </p>
                  </div>
                )}
                {!isReading && imageUrl && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Button onClick={() => fileInputRef.current?.click()} className="bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-full h-12 px-8 hover:bg-primary">
                      <Camera className="w-4 h-4 mr-2" /> Update Visual
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Milestone Title</label>
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Arrival"
                  className="bg-white/5 border-white/10 h-14 rounded-2xl text-base focus:ring-primary/20"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Academic Range</label>
                <Input 
                  value={subtitle} 
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="2018-19 | Class 6"
                  className="bg-white/5 border-white/10 h-14 rounded-2xl text-base focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Historical Narrative</label>
                <EmojiPicker onEmojiSelect={(e) => setDescription(p => p + e)} />
              </div>
              <Textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share the official account of this year..."
                className="bg-white/5 border-white/10 min-h-[160px] rounded-3xl font-serif italic text-xl leading-relaxed focus:ring-primary/20 p-8"
              />
            </div>
          </div>

          <div className="p-10 border-t border-white/5 bg-black/40">
            <Button 
              onClick={handleUpdate} 
              disabled={isReading || isCompressing}
              className="w-full bg-white text-black font-black uppercase tracking-[0.4em] py-8 rounded-full hover:bg-primary transition-all shadow-2xl disabled:opacity-50"
            >
              {(isReading || isCompressing) ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Save className="w-5 h-5 mr-3" />}
              Commit to History
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
