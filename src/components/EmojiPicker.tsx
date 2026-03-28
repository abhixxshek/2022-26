"use client";

import { Smile } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const EMOJI_CATEGORIES = [
  { 
    label: "Smileys", 
    emojis: ["😀", "😂", "🤣", "😊", "😇", "🙂", "😉", "😍", "😘", "😜", "😎", "🥺", "😭", "😤", "🤯", "😴", "🤔", "🤫", "🫠", "🫡", "🤨", "😐", "😑", "😶", "🫥", "😏", "😒", "🙄", "😬", "😮‍💨", "🤥", "🫨"] 
  },
  { 
    label: "Batch Life", 
    emojis: ["🎓", "🎒", "📚", "📝", "🍱", "⚽", "🏀", "🎸", "🎨", "🎬", "🏫", "🚌", "☕", "🍕", "🍦", "🏆", "🎖️", "🫂", "🤝", "🧑‍🎓", "👩‍🎓", "🧑‍🏫", "👩‍🏫", "🔬", "💻", "🖋️", "📏", "📐", "🧠", "💡"] 
  },
  { 
    label: "Expression", 
    emojis: ["❤️", "✨", "🌟", "🔥", "🌈", "🕊️", "💯", "👏", "🙌", "🙏", "💪", "🚀", "🎈", "🎉", "📸", "🍀", "🌍", "🌙", "☀️", "⚡", "💎", "🧿", "🌸", "🍃", "🍂", "🌊", "🕯️", "⌛", "🗝️"] 
  },
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 text-white/40 hover:text-primary hover:bg-white/5 rounded-full transition-all"
          title="Add Emoji"
        >
          <Smile className="w-6 h-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-black/95 border-white/10 p-0 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden" side="top" align="end">
        <div className="p-4 border-b border-white/5 bg-white/[0.02]">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Expression Archive</p>
        </div>
        <ScrollArea className="h-72">
          <div className="p-5 space-y-6">
            {EMOJI_CATEGORIES.map((cat) => (
              <div key={cat.label} className="space-y-3">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">{cat.label}</p>
                <div className="grid grid-cols-7 gap-2">
                  {cat.emojis.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => onEmojiSelect(e)}
                      className="text-2xl hover:scale-125 active:scale-95 transition-transform p-1 rounded-lg hover:bg-white/5 flex items-center justify-center"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
