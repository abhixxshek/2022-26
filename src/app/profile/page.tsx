"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Save, ImageIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { toast } from "@/hooks/use-toast";

const QUICK_EMOJIS = ["❤️", "😂", "😭", "✨", "🎓", "🎒", "🍱", "⚽", "📝", "🕊️"];

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const studentRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "students", user.uid);
  }, [db, user]);

  const { data: studentData, isLoading: isDocLoading } = useDoc(studentRef);

  const [name, setName] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [fullBio, setFullBio] = useState("");
  const [house, setHouse] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [batchId] = useState("batch-2018-2025");

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/auth");
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (studentData) {
      setName(studentData.name || "");
      setShortBio(studentData.shortBio || "");
      setFullBio(studentData.fullBio || "");
      setHouse(studentData.house || "");
      setProfilePhotoUrl(studentData.profilePhotoUrl || "");
    }
  }, [studentData]);

  const addEmoji = (emoji: string) => {
    setFullBio(prev => prev + emoji);
  };

  const handleSave = () => {
    if (!studentRef || !user) return;
    
    if (!name || !house) {
      toast({
        variant: "destructive",
        title: "Required Fields",
        description: "Please provide your name and house affiliation."
      });
      return;
    }

    const updatedData = {
      id: user.uid,
      batchId,
      name,
      email: user.email,
      shortBio,
      fullBio,
      house,
      profilePhotoUrl: profilePhotoUrl || `https://picsum.photos/seed/${user.uid}/400/500`,
    };

    setDocumentNonBlocking(studentRef, updatedData, { merge: true });
    toast({
      title: "Legacy Updated",
      description: "Your record has been successfully committed to the archive."
    });
  };

  const handlePhotoUploadFromGallery = () => {
    const randomId = Math.floor(Math.random() * 1000);
    setProfilePhotoUrl(`https://picsum.photos/seed/${randomId}/400/500`);
    toast({
      title: "Photo Added from Gallery",
      description: "Your selected identity photo has been queued for synchronization."
    });
  };

  if (isUserLoading || isDocLoading) return null;

  return (
    <div className="bg-[#050505] min-h-screen">
      <Navbar />
      
      <main className="pt-40 pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-5xl font-headline font-black uppercase tracking-tighter mb-2">My <span className="text-primary">Legacy</span></h1>
                <p className="text-muted-foreground font-light text-sm tracking-widest uppercase">Batch 2018—25 Student Record</p>
              </div>
              <Button onClick={handleSave} className="bg-white text-black font-black uppercase tracking-widest gap-2 h-14 px-10 rounded-full shadow-lg hover:bg-primary transition-all">
                <Save className="w-4 h-4" /> Save Record
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Photo Section */}
              <div className="md:col-span-1 space-y-6">
                <Card className="bg-black/40 backdrop-blur-xl border-white/5 overflow-hidden rounded-[2.5rem] relative group">
                  <div className="aspect-[4/5] relative bg-[#111]">
                    <img 
                      src={profilePhotoUrl || `https://picsum.photos/seed/${user?.uid}/400/500`} 
                      className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                      alt="Profile"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 p-6">
                      <Button 
                        onClick={handlePhotoUploadFromGallery}
                        className="w-full bg-white text-black hover:bg-primary transition-colors rounded-full font-black text-[10px] uppercase tracking-widest h-12"
                      >
                        <ImageIcon className="w-3 h-3 mr-2" /> Select Identity Photo
                      </Button>
                      {profilePhotoUrl && (
                        <Button 
                          variant="destructive" 
                          onClick={() => setProfilePhotoUrl("")} 
                          className="w-full rounded-full font-black text-[10px] uppercase tracking-widest h-12"
                        >
                          <Trash2 className="w-3 h-3 mr-2" /> Reset Photo
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardContent className="pt-6 pb-8 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-2">ARCHIVE IDENTITY</p>
                    <p className="text-xl font-bold text-white">{name || "Unnamed Navodayan"}</p>
                    <p className="text-[9px] text-primary font-black uppercase tracking-[0.4em] mt-2">{house ? `${house} House` : "Unassigned Dormitory"}</p>
                  </CardContent>
                </Card>
                <div className="text-center px-4">
                  <p className="text-[9px] font-bold text-white/10 uppercase tracking-[0.2em] leading-relaxed">
                    Identity photos represent your 7-year legacy. Choose a visual that defines your journey.
                  </p>
                </div>
              </div>

              {/* Data Section */}
              <div className="md:col-span-2 space-y-12">
                <section className="space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="h-[1px] w-8 bg-primary/40" />
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Identity Record</label>
                  </div>
                  <div className="space-y-4">
                    <Input 
                      placeholder="Full Name as per Register" 
                      className="bg-white/[0.03] border-white/10 h-16 rounded-2xl px-6 focus:ring-primary/20 transition-all text-white"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Select onValueChange={setHouse} value={house}>
                        <SelectTrigger className="bg-white/[0.03] border-white/10 h-16 rounded-2xl px-6 text-white">
                          <SelectValue placeholder="House Affiliation" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/10 text-white">
                          {["Aravalli", "Nilgiri", "Shivalik", "Udaygiri"].map(h => (
                            <SelectItem key={h} value={h}>{h} House</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex items-center px-6 bg-white/[0.02] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                        Batch 2018-2025
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="h-[1px] w-8 bg-primary/40" />
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">The Short Definition</label>
                  </div>
                  <Input 
                    placeholder="One line that defines your JNV life..." 
                    className="bg-white/[0.03] border-white/10 h-16 rounded-2xl px-6 focus:ring-primary/20 transition-all text-white"
                    value={shortBio}
                    onChange={(e) => setShortBio(e.target.value)}
                  />
                </section>

                <section className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <span className="h-[1px] w-8 bg-primary/40" />
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">The Full Narrative</label>
                    </div>
                    <div className="flex gap-2">
                      {QUICK_EMOJIS.map(e => (
                        <button 
                          key={e} 
                          type="button" 
                          onClick={() => addEmoji(e)}
                          className="hover:scale-125 transition-transform text-lg"
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Textarea 
                    placeholder="Tell your Navodaya story... the early morning whistles, the mess rushes, the midnight preps, and the bonds that will never break." 
                    className="bg-white/[0.03] border-white/10 min-h-[300px] rounded-[2rem] p-8 focus:ring-primary/20 transition-all text-lg leading-relaxed font-light font-serif italic text-white"
                    value={fullBio}
                    onChange={(e) => setFullBio(e.target.value)}
                  />
                </section>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
