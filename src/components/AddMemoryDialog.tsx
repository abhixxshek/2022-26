
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
import { useFirestore, useUser } from "@/firebase";
import { collection, serverTimestamp, doc } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { EmojiPicker } from "@/components/EmojiPicker";

export function AddMemoryDialog() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [classYear, setClassYear] = useState("");
  const [theme, setTheme] = useState("");
  const [memoryText, setMemoryText] = useState("");
  const [title, setTitle] = useState("");
  const { user } = useUser();
  const db = useFirestore();

  const handleGeneratePrompts = async () => {
    setIsGenerating(true);
    try {
      const result = await generateMemoryPrompts({ classYear, theme });
      setPrompts(result.prompts);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate prompts. Please try again."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const addEmoji = useCallback((emoji: string) => {
    setMemoryText(prev => prev + emoji);
  }, []);

  const handlePromptClick = (prompt: string) => {
    setMemoryText(prev => prev ? prev + " " + prompt : prompt);
  };

  const handlePostMemory = () => {
    if (!user || !db) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to post memories."
      });
      return;
    }

    if (!title || !memoryText || !classYear) {
      toast({
        variant: "destructive",
        title: "Incomplete Fields",
        description: "Please provide a title, class year, and your memory."
      });
      return;
    }

    const memoryRef = doc(collection(db, "memories"));
    const memoryData = {
      id: memoryRef.id,
      studentId: user.uid,
      studentName: user.displayName || user.email?.split('@')[0] || "A Navodayan",
      title,
      description: memoryText,
      classYearLabel: `Class ${classYear}`,
      uploadedAt: new Date().toISOString(),
      createdAt: serverTimestamp(),
    };

    setDocumentNonBlocking(memoryRef, memoryData, { merge: true });
    
    toast({
      title: "Memory Shared!",
      description: "Your memory has been added to the public wall."
    });
    
    // Reset fields
    setTitle("");
    setMemoryText("");
    setPrompts([]);
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
            Preserve your Navodaya journey for generations to come.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-primary">Memory Title</label>
            <Input 
              placeholder="e.g. The Night we sneaked out..." 
              className="bg-white/5 border-white/10 text-white focus:ring-primary/20 h-12"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-primary">Class Year</label>
              <Select onValueChange={setClassYear} value={classYear}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white h-12">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent className="bg-black text-white border-white/10">
                  {[6, 7, 8, 9, 10, 11, 12].map(y => (
                    <SelectItem key={y} value={y.toString()}>Class {y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-primary">Theme (Optional)</label>
              <Input 
                placeholder="e.g. Sports, Mess, Exam" 
                className="bg-white/5 border-white/10 text-white focus:ring-primary/20 h-12"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-wider text-primary">Inspiration</label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleGeneratePrompts}
                disabled={isGenerating}
                className="text-primary hover:text-primary/80 hover:bg-primary/10 h-auto py-1 text-[10px] uppercase font-black tracking-widest"
              >
                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Sparkles className="w-3 h-3 mr-2" />}
                Get AI Prompts
              </Button>
            </div>
            
            {prompts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {prompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handlePromptClick(p)}
                    className="text-left text-[11px] bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl p-3 transition-colors text-primary italic font-serif"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-wider text-primary">Your Memory</label>
              <EmojiPicker onEmojiSelect={addEmoji} />
            </div>
            <Textarea 
              className="bg-white/5 border-white/10 min-h-[150px] text-white focus:ring-primary/20 font-serif italic text-lg leading-relaxed p-6" 
              placeholder="Write your story here..."
              value={memoryText}
              onChange={(e) => setMemoryText(e.target.value)}
            />
          </div>

          <Button onClick={handlePostMemory} className="w-full bg-white text-black font-black uppercase tracking-[0.4em] py-8 rounded-full hover:bg-primary transition-all">
            Post to Reflection Wall
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
