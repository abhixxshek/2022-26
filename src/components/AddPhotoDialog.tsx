
"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Camera, ImageIcon, Loader2, Trash2, Crop, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useUser } from "@/firebase";
import { collection, serverTimestamp, doc } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { EmojiPicker } from "@/components/EmojiPicker";
import { ImageAdjuster } from "@/components/ImageAdjuster";
import Image from "next/image";

interface PendingPhoto {
  id: string;
  url: string;
  caption: string;
}

export function AddPhotoDialog() {
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [adjustingPhotoId, setAdjustingPhotoId] = useState<string | null>(null);
  const [isAdjusterOpen, setIsAdjusterOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const db = useFirestore();

  const compressImage = (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new (window as any).Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsReading(true);
    const newPhotos: PendingPhoto[] = [];

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: `${file.name} exceeds the 10MB limit.`
        });
        continue;
      }

      let currentFile = file;

      if (file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif")) {
        try {
          const heic2anyModule = await import("heic2any");
          const heic2any = heic2anyModule.default || heic2anyModule;
          
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.8
          });
          
          const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          currentFile = new File(
            [finalBlob], 
            file.name.replace(/\.[^/.]+$/, "") + ".jpg", 
            { type: "image/jpeg" }
          );
        } catch (err) {
          toast({
            variant: "destructive",
            title: "Conversion Failed",
            description: `Your browser couldn't process ${file.name}. Please upload a standard JPG/PNG.`
          });
          continue;
        }
      }

      const reader = new FileReader();
      const promise = new Promise<string>((resolve) => {
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.readAsDataURL(currentFile);
      });

      const dataUri = await promise;
      const compressedUri = await compressImage(dataUri);
      
      newPhotos.push({
        id: Math.random().toString(36).substr(2, 9),
        url: compressedUri,
        caption: ""
      });
    }

    setPendingPhotos(prev => [...prev, ...newPhotos]);
    setIsReading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemovePhoto = (id: string) => {
    setPendingPhotos(prev => prev.filter(p => p.id !== id));
  };

  const updateCaption = (id: string, newCaption: string) => {
    setPendingPhotos(prev => prev.map(p => p.id === id ? { ...p, caption: newCaption } : p));
  };

  const appendEmoji = (id: string, emoji: string) => {
    setPendingPhotos(prev => 
      prev.map(p => p.id === id ? { ...p, caption: p.caption + emoji } : p)
    );
  };

  const openAdjuster = (id: string) => {
    setAdjustingPhotoId(id);
    setIsAdjusterOpen(true);
  };

  const handleSaveAdjustedImage = (adjustedImage: string) => {
    setPendingPhotos(prev => prev.map(p => p.id === adjustingPhotoId ? { ...p, url: adjustedImage } : p));
    setIsAdjusterOpen(false);
    setAdjustingPhotoId(null);
    toast({
      title: "Visual Refined",
      description: "Photo has been perfectly framed for the vault."
    });
  };

  const handleBulkUpload = async () => {
    if (!user || !db) return;
    if (pendingPhotos.length === 0) {
      toast({
        variant: "destructive",
        title: "Incomplete Batch",
        description: "Please select images before archiving."
      });
      return;
    }

    setIsUploading(true);

    try {
      pendingPhotos.forEach((photo) => {
        const photoRef = doc(collection(db, "photos"));
        const photoData = {
          id: photoRef.id,
          url: photo.url,
          caption: photo.caption || "Archive Record",
          classYearLabel: "GALLERY RECORD",
          uploadedByStudentId: user.uid,
          uploadedAt: new Date().toISOString(),
          createdAt: serverTimestamp(),
        };
        setDocumentNonBlocking(photoRef, photoData, { merge: true });
      });

      toast({
        title: "Batch Committed",
        description: `${pendingPhotos.length} records have been added to the master vault.`
      });

      setPendingPhotos([]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "An error occurred during archival commitment."
      });
    } finally {
      setIsUploading(false);
    }
  };

  const currentAdjustingUrl = pendingPhotos.find(p => p.id === adjustingPhotoId)?.url;

  return (
    <>
      {currentAdjustingUrl && (
        <ImageAdjuster
          image={currentAdjustingUrl}
          isOpen={isAdjusterOpen}
          onClose={() => {
            setIsAdjusterOpen(false);
            setAdjustingPhotoId(null);
          }}
          onSave={handleSaveAdjustedImage}
          aspectRatio={4 / 3}
        />
      )}

      <Dialog>
        <DialogTrigger asChild>
          <button className="px-12 py-5 bg-white text-black rounded-full font-black text-sm uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-white/5">
            <Plus className="w-4 h-4 inline-block mr-2" /> Bulk Upload
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] w-[95vw] bg-black/95 border-white/10 text-white max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-[2.5rem]">
          <div className="p-8 border-b border-white/5 shrink-0 bg-black/40 backdrop-blur-md z-10">
            <DialogHeader>
              <DialogTitle className="text-3xl font-serif italic text-white">Archive Vault Entry</DialogTitle>
              <DialogDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mt-2">
                Commit multiple memories to the master vault.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <div className="space-y-12 pb-4">


              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary">Media Selection ({pendingPhotos.length})</label>
                  <Button 
                    onClick={() => fileInputRef.current?.click()} 
                    disabled={isReading || isUploading}
                    className="bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-full h-10 px-6 text-[9px] font-black uppercase tracking-widest"
                  >
                    <ImageIcon className="w-3 h-3 mr-2" /> Select Files
                  </Button>
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  multiple
                  onChange={handleFileChange} 
                />

                {pendingPhotos.length === 0 ? (
                  <div className="aspect-[2/1] border border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-4 text-white/10">
                    {isReading ? <Loader2 className="w-10 h-10 animate-spin" /> : <Camera className="w-10 h-10" />}
                    <p className="text-[10px] font-black uppercase tracking-widest">No Media in Queue</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {pendingPhotos.map((photo) => (
                      <div key={photo.id} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row gap-6 group transition-all hover:border-white/10">
                        <div className="relative w-full md:w-48 aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 shrink-0">
                          <Image src={photo.url} alt="Preview" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => openAdjuster(photo.id)}
                              className="w-10 h-10 rounded-full bg-white text-black hover:bg-primary shadow-lg"
                            >
                              <Crop className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="destructive" 
                              onClick={() => handleRemovePhoto(photo.id)}
                              className="w-10 h-10 rounded-full shadow-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Archival Caption</span>
                            <EmojiPicker onEmojiSelect={(emoji) => appendEmoji(photo.id, emoji)} />
                          </div>
                          <Textarea 
                            placeholder="Describe this moment..." 
                            className="bg-black/20 border-white/5 h-24 rounded-2xl text-sm font-serif italic text-white/60 focus:text-white transition-colors focus:ring-primary/20"
                            value={photo.caption}
                            onChange={(e) => updateCaption(photo.id, e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>

          <div className="p-8 border-t border-white/5 bg-black/60 backdrop-blur-md shrink-0">
            <Button 
              onClick={handleBulkUpload} 
              disabled={isUploading || isReading || pendingPhotos.length === 0}
              className="w-full bg-white text-black font-black uppercase tracking-[0.4em] py-7 rounded-full hover:bg-primary transition-all disabled:opacity-50 shadow-2xl"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-3" />
                  ARCHIVING BATCH...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-3" />
                  COMMIT {pendingPhotos.length} RECORDS
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
