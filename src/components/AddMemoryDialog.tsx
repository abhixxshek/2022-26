
"use client";

import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateMemoryPrompts } from "@/ai/flows/generate-memory-prompts";
import { Sparkles, Plus, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { collection, serverTimestamp, doc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { EmojiPicker } from "@/components/EmojiPicker";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User, UserCheck } from "lucide-react";

export function AddMemoryDialog() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [memoryText, setMemoryText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { user } = useUser();
  const db = useFirestore();

  const studentRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "students", user.uid);
  }, [db, user]);

  const { data: studentData } = useDoc(studentRef);



  const addEmoji = useCallback((emoji: string) => {
    setMemoryText(prev => prev + emoji);
  }, []);



  const handlePostMemory = () => {
    if (!user || !db) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to post memories."
      });
      return;
    }

    if (!memoryText) {
      toast({
        variant: "destructive",
        title: "Empty Memory",
        description: "Please share your story before posting."
      });
      return;
    }

    const memoryRef = doc(collection(db, "memories"));
    const memoryData = {
      id: memoryRef.id,
      studentId: user.uid,
      studentName: isAnonymous ? "someone❤️" : (studentData?.name || "A GECian"),
      description: memoryText,
      uploadedAt: new Date().toISOString(),
      createdAt: serverTimestamp(),
    };

    setDocumentNonBlocking(memoryRef, memoryData, { merge: true });
    
    toast({
      title: "Memory Shared!",
      description: "Your memory has been added to the public wall."
    });
    
    // Reset fields
    setMemoryText("");
    setIsAnonymous(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-12 py-5 border border-white/20 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/5 transition-all">
          <Plus className="w-4 h-4 inline-block mr-2" /> Share a Memory
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-black/90 backdrop-blur-2xl border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif italic text-white">Share a Memory</DialogTitle>
          <DialogDescription className="text-white/40 text-[10px] uppercase font-black tracking-widest">
            Preserve your GEC journey for generations to come.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black uppercase tracking-wider text-primary">Your Story</label>
              <EmojiPicker onEmojiSelect={addEmoji} />
            </div>
            <Textarea 
              className="bg-white/5 border-white/10 min-h-[220px] text-white focus:ring-primary/20 font-serif italic text-xl leading-relaxed p-8 rounded-3xl" 
              placeholder="What do you want to be remembered?"
              value={memoryText}
              onChange={(e) => setMemoryText(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-full transition-colors",
                isAnonymous ? "bg-white/5 text-white/20" : "bg-primary/10 text-primary"
              )}>
                {isAnonymous ? <User className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  {isAnonymous ? "Posting Anonymously" : `Post as ${studentData?.name || "GECian"}`}
                </p>
                <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">
                  {isAnonymous ? "Your name will be hidden" : "Your name will be attached"}
                </p>
              </div>
            </div>
            <Switch 
              checked={isAnonymous} 
              onCheckedChange={setIsAnonymous}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <Button onClick={handlePostMemory} className="w-full bg-white text-black font-black uppercase tracking-[0.4em] py-10 rounded-full hover:bg-primary transition-all text-sm shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)]">
            Post to Reflection Wall
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
