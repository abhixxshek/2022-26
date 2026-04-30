
"use client";

import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Quote, Star, BookOpen, Home, Loader2, Share2, MessageCircle, User, UserCheck, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useFirestore, useDoc, useMemoFirebase, useCollection, useUser } from "@/firebase";
import { doc, collection, query, orderBy, serverTimestamp } from "firebase/firestore";
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { EmojiPicker } from "@/components/EmojiPicker";
import { useState, useCallback, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function StudentProfile() {
  const { id } = useParams();
  const router = useRouter();
  const db = useFirestore();

  const studentRef = useMemoFirebase(() => {
    if (!db || !id) return null;
    return doc(db, "students", id as string);
  }, [db, id]);

  const { data: student, isLoading } = useDoc(studentRef);

  const { user } = useUser();
  const currentUserRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "students", user.uid);
  }, [db, user]);
  const { data: currentUserData } = useDoc(currentUserRef);

  const messagesQuery = useMemoFirebase(() => {
    if (!db || !id) return null;
    return query(collection(db, `students/${id}/messages`), orderBy("createdAt", "desc"));
  }, [db, id]);
  const { data: messages } = useCollection(messagesQuery);

  const [messageText, setMessageText] = useState("");
  const [archiveKey, setArchiveKey] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Archive is unlocked if user is logged in OR if they have the local storage key
  const isArchiveUnlocked = !!user || isUnlocked;

  useEffect(() => {
    const unlocked = localStorage.getItem("archive_unlocked") === "true";
    setIsUnlocked(unlocked);
  }, []);

  const handleUnlock = () => {
    if (archiveKey === "GEC26") {
      localStorage.setItem("archive_unlocked", "true");
      setIsUnlocked(true);
      setArchiveKey("");
      toast({ title: "Archive Unlocked", description: "You now have access to the permanent record." });
    } else {
      toast({ variant: "destructive", title: "Invalid Key", description: "The archival key is incorrect." });
    }
  };

  const addEmoji = useCallback((emoji: string) => {
    setMessageText(prev => prev + emoji);
  }, []);

  const handlePostMessage = async () => {
    if (!user || !db) {
      toast({ variant: "destructive", title: "Authentication Required", description: "Sign in to leave a message." });
      return;
    }
    if (!messageText.trim()) {
      toast({ variant: "destructive", title: "Empty Message", description: "Please write a message first." });
      return;
    }
    if (!isArchiveUnlocked) {
      toast({ variant: "destructive", title: "Archive Locked", description: "Please enter the access key first." });
      return;
    }

    setIsSubmitting(true);
    try {
      const messageRef = doc(collection(db, `students/${id}/messages`));
      const messageData = {
        id: messageRef.id,
        senderId: user.uid,
        senderName: currentUserData?.name || "A Classmate",
        content: messageText.trim(),
        createdAt: serverTimestamp(),
      };
      await setDocumentNonBlocking(messageRef, messageData);

      toast({ title: "Message Delivered", description: "Your note has been added to their guestbook." });
      setMessageText("");
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to Post", description: "Could not deliver your message." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!db || !id) return;
    const messageRef = doc(db, `students/${id}/messages`, messageId);
    deleteDocumentNonBlocking(messageRef, "Note Removed");
  };

  const isAdmin = currentUserData?.role === "admin";

  const copyProfileLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Archival Link Copied",
      description: "The legacy record is ready to be shared.",
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#050505]">
        <div className="text-center">
          <h1 className="text-2xl mb-8 font-headline font-black uppercase tracking-widest text-white/20">Archive record not found</h1>
          <button onClick={() => router.back()} className="text-primary hover:underline flex items-center gap-4 font-black uppercase tracking-[0.4em] text-[10px]">
            <ArrowLeft className="w-4 h-4" /> Return to directory
          </button>
        </div>
      </div>
    );
  }

  const houseColorClass = "text-primary border-primary/30 bg-primary/5";

  return (
    <div className="bg-[#050505] text-foreground min-h-screen">
      <Navbar />

      <main className="pt-24 md:pt-20 pb-32 px-3 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl md:rounded-[3rem] p-4 md:p-8 lg:p-16 shadow-2xl backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-start md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4 md:gap-8"
            >
              <button
                onClick={() => router.back()}
                className="group flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-primary transition-all"
              >
                <div className="p-4 rounded-full border border-white/5 group-hover:border-primary/40 transition-all">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                Back to Archive
              </button>

              <div className="flex flex-wrap items-center justify-start md:justify-center gap-3 md:gap-6">
                <Button
                  onClick={copyProfileLink}
                  className="bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-full px-4 md:px-6 h-10 md:h-12 text-[9px] font-black uppercase tracking-widest gap-2"
                >
                  <Share2 className="w-3 h-3" /> Share Record
                </Button>
                <Badge variant="outline" className="border-primary/20 text-primary px-6 py-2 uppercase font-black text-[9px] tracking-[0.5em] rounded-full">BATCH 2022-2026</Badge>
                <div className={cn("hidden md:flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.5em] px-6 py-2 rounded-full border", houseColorClass)}>
                  <Home className="w-4 h-4" />
                  Information Technology
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 lg:gap-24">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-4 lg:sticky lg:top-8 lg:self-start"
              >
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] bg-[#080808]">
                  <Image
                    src={student.profilePhotoUrl || `https://picsum.photos/seed/${student.id}/400/500`}
                    alt={student.name}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  />
                </div>

                <div className="mt-12 relative">
                  <Quote className="absolute -top-12 -left-8 w-24 h-24 text-primary/5 -rotate-12 pointer-events-none" />
                  <h3 className="text-[8px] font-black flex items-center gap-4 text-primary uppercase tracking-[0.6em] mb-6">
                    <span className="w-8 h-[1px] bg-primary/40" /> Archive Identity
                  </h3>
                  <p className="text-3xl md:text-5xl font-serif italic font-light leading-[1.1] text-white tracking-tight">
                    "{student.shortBio || "A true GECian at heart."}"
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-8 space-y-8 md:space-y-16"
              >
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row items-baseline justify-between gap-8">
                    <h1 className="text-4xl md:text-6xl font-black mb-0 leading-none tracking-tighter uppercase text-gradient">
                      {student.name}
                    </h1>
                    <div className="flex items-center gap-4">
                      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 whitespace-nowrap">Archive Entry</span>
                      <EmojiPicker onEmojiSelect={addEmoji} />
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-1000" />
                    <div className="relative flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-6 bg-white/[0.03] border border-white/5 p-3 rounded-2xl backdrop-blur-md transition-all group-focus-within:border-primary/20">
                      <Textarea 
                        className="bg-transparent border-none focus-visible:ring-0 min-h-[60px] h-[60px] text-white font-serif italic text-lg leading-tight p-4 placeholder:text-white/10 resize-none flex-1" 
                        placeholder={`Commit your entry to the permanent record of ${student.name.split(' ')[0]}...`}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                      />
                      <div className="flex items-center gap-2 md:gap-3 md:pr-2">
                        {!isArchiveUnlocked ? (
                          <>
                            <Input 
                              type="password"
                              placeholder="ARCHIVE KEY"
                              className="w-24 bg-white/5 border-white/10 h-10 rounded-xl text-[10px] font-black tracking-widest placeholder:text-white/10 text-center"
                              value={archiveKey}
                              onChange={(e) => setArchiveKey(e.target.value)}
                            />
                            <Button 
                              onClick={handleUnlock}
                              disabled={!archiveKey.trim()}
                              className="bg-primary text-black hover:bg-primary/80 font-black uppercase tracking-widest px-8 h-12 rounded-xl transition-all text-[10px] whitespace-nowrap"
                            >
                              Unlock Archive
                            </Button>
                          </>
                        ) : (
                          <Button 
                            onClick={handlePostMessage}
                            disabled={isSubmitting || !messageText.trim()}
                            className="bg-white text-black hover:bg-primary font-black uppercase tracking-widest px-8 h-12 rounded-xl transition-all text-[10px] whitespace-nowrap"
                          >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign Archive"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <section className="pb-8 mb-8 border-b border-white/5 space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      <h2 className="text-[9px] font-black uppercase tracking-[0.6em] text-white/40">Classmate Messages</h2>
                    </div>

                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-6">
                        {messages?.map((msg: any) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl relative overflow-hidden group"
                          >
                            <Quote className="absolute -top-4 -left-4 w-16 h-16 text-white/5 -rotate-12" />
                            <div className="relative z-10 space-y-4">
                              <div className="flex justify-between items-start gap-4">
                                <p className="text-white/80 text-lg font-serif italic leading-relaxed flex-1">"{msg.content}"</p>
                                {(isAdmin || user?.uid === msg.senderId || user?.uid === id) && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white/10 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-black/90 border-white/10 text-white backdrop-blur-2xl rounded-[2rem]">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle className="font-serif italic text-2xl text-center">Delete Message?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-white/40 text-[10px] uppercase font-black tracking-widest text-center mt-2">
                                          This memory will be permanently removed from the archive.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter className="mt-8 gap-4">
                                        <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-full h-12 uppercase font-black text-[9px] tracking-widest px-6 flex-1">
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteMessage(msg.id)}
                                          className="bg-red-600 hover:bg-red-700 text-white rounded-full h-12 uppercase font-black text-[9px] tracking-widest px-6 flex-1"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </div>
                              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">
                                  {msg.senderName}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        {(!messages || messages.length === 0) && (
                          <div className="p-12 rounded-3xl border border-dashed border-white/5 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10">Their guestbook is empty. Be the first to leave a message!</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>

                  </section>

                </div>





              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
