
"use client";

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Crop, ZoomIn, Check } from "lucide-react";

interface Point {
  x: number;
  y: number;
}

interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface ImageAdjusterProps {
  image: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedImage: string) => void;
  aspectRatio?: number;
}

export function ImageAdjuster({ image, isOpen, onClose, onSave, aspectRatio = 4 / 3 }: ImageAdjusterProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return '';

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return canvas.toDataURL('image/jpeg', 0.9);
  };

  const handleSave = async () => {
    if (croppedAreaPixels) {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onSave(croppedImage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-black/95 border-white/10 text-white backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif italic flex items-center gap-4">
            <Crop className="w-6 h-6 text-primary" />
            Adjust Frame
          </DialogTitle>
        </DialogHeader>

        <div className="relative h-[400px] w-full bg-[#0a0a0a] rounded-xl overflow-hidden mt-6">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div className="py-8 space-y-6">
          <div className="flex items-center gap-6">
            <ZoomIn className="w-4 h-4 text-white/20" />
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(vals) => setZoom(vals[0])}
              className="flex-1"
            />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 text-center">
            DRAG TO POSITION • SLIDER TO ZOOM
          </p>
        </div>

        <DialogFooter className="gap-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 h-14 rounded-full font-black uppercase tracking-widest text-[10px]"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="flex-1 bg-white text-black hover:bg-primary h-14 rounded-full font-black uppercase tracking-widest text-[10px]"
          >
            <Check className="w-4 h-4 mr-2" /> Apply Adjustment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
