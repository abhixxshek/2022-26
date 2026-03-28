
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateMemoryPrompts } from "@/ai/flows/generate-memory-prompts";
import { Sparkles, Plus, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function AddMemoryDialog() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [classYear, setClassYear] = useState("");
  const [theme, setTheme] = useState("");
  const [memoryText, setMemoryText] = useState("");

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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
          <Plus className="w-4 h-4" /> Add Memory
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] glass border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline font-bold">Share a Memory</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preserve your Navodaya journey for generations to come.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Class Year</label>
              <Select onValueChange={setClassYear} value={classYear}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent className="glass">
                  {[6, 7, 8, 9, 10, 11, 12].map(y => (
                    <SelectItem key={y} value={y.toString()}>Class {y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Theme</label>
              <Input 
                placeholder="e.g. Sports, Mess, Exam" 
                className="bg-white/5 border-white/10"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Inspiration</label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleGeneratePrompts}
                disabled={isGenerating}
                className="text-primary hover:text-primary/80 h-auto py-1"
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
                    onClick={() => setMemoryText(p)}
                    className="text-left text-xs bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg p-3 transition-colors text-primary"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Memory</label>
            <Textarea 
              className="bg-white/5 border-white/10 min-h-[120px]" 
              placeholder="Write your story here..."
              value={memoryText}
              onChange={(e) => setMemoryText(e.target.value)}
            />
          </div>

          <Button className="w-full bg-primary text-primary-foreground font-bold py-6">
            Post Memory
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
