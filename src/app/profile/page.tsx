
"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Save, ImageIcon, Trash2, Loader2, Camera, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { toast } from "@/hooks/use-toast";
import { EmojiPicker } from "@/components/EmojiPicker";

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [isReading, setIsReading] = useState(false);
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

  const isNewStudent = !studentData;

  const addEmojiToShortBio = (emoji: string) => {
    setShortBio(prev => prev + emoji);
  };

  const addEmojiToFullBio = (emoji: string) => {
    setFullBio(prev => prev + emoji);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Please select an identity photo smaller than 1MB."
      });
      return;
    }

    setIsReading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setProfilePhotoUrl(event.target?.result as string);
      setIsReading(false);
      toast({
        title: "Identity Photo Selected",
        description: "Your new visual identity has been queued."
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!studentRef || !user) return;
    
    if (!name || !house) {
      toast({
        variant: "destructive",
        title: "Incomplete Record",
        description: "Your Name and House affiliation are mandatory for the yearbook."
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
      profilePhotoUrl: profilePhotoUrl || "",
    };

    setDocumentNonBlocking(studentRef, updatedData, { merge: true });
    toast({
      title: isNewStudent ? "Registration Complete" : "Legacy Updated",
      description: isNewStudent 
        ? "Welcome to the family. Your record is now part of the archive." 
        : "Your changes have been committed to the archive."
    });
    
    if (isNewStudent) {
      router.push("/yearbook");
    }
  };

  const handleTriggerFilePicker = () => {
    fileInputRef.current?.click();
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
            {isNewStudent && (
              <div className="mb-12 p-8 rounded-3xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center gap-8 shadow-[0_0_50px_rgba(255,191,0,0.05)]">
                <div className="p-4 rounded-full bg-primary/10 text-primary">
                  <UserPlus className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-widest text-white mb-2">Complete Your Enrollment</h2>
                  <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.3em] leading-relaxed">
                    Welcome to the Batch '25 Archive. Please fill in your identity details to be visible to your classmates in the digital yearbook.
                  </p>
                </div>
              </div>
            )}

            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
              <div>
                <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">
                  My <span className="text-primary">{isNewStudent ? "Enrollment" : "Legacy"}</span>
                </h1>
                <p className="text-muted-foreground font-light text-[10px] tracking-[0.4em] uppercase">
                  {isNewStudent ? "First-time Identity Record" : "Batch 2018—25 Student Record"}
                </p>
              </div>
              <Button onClick={handleSave} className="w-full md:w-auto bg-white text-black font-black uppercase tracking-widest gap-2 h-14 px-10 rounded-full shadow-lg hover:bg-primary transition-all">
                <Save className="w-4 h-4" /> {isNewStudent ? "Finalize Enrollment" : "Save Changes"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-1 space-y-6">
                <Card className="bg-black/40 backdrop-blur-xl border-white/5 overflow-hidden rounded-[2.5rem] relative group">
                  <div className="aspect-[4/5] relative bg-[#111]">
                    {profilePhotoUrl ? (
                      <img 
                        src={profilePhotoUrl} 
                        className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                        alt="Profile"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white/10 gap-4">
                        {isReading ? <Loader2 className="w-10 h-10 animate-spin" /> : <Camera className="w-10 h-10" />}
                        <p className="text-[10px] font-black uppercase tracking-widest">No Identity Photo</p>
                      </div>
                    )}
                    {!isReading && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 p-6">
                        <Button 
                          onClick={handleTriggerFilePicker}
                          className="w-full bg-white text-black hover:bg-primary transition-colors rounded-full font-black text-[10px] uppercase tracking-widest h-12"
                        >
                          <ImageIcon className="w-3 h-3 mr-2" /> Select Photo
                        </Button>
                        {profilePhotoUrl && (
                          <Button 
                            variant="destructive" 
                            onClick={() => setProfilePhotoUrl("")} 
                            className="w-full rounded-full font-black text-[10px] uppercase tracking-widest h-12"
                          >
                            <Trash2 className="w-3 h-3 mr-2" /> Remove
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  <CardContent className="pt-6 pb-8 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-2">ARCHIVE IDENTITY</p>
                    <p className="text-xl font-bold text-white">{name || "Unnamed Navodayan"}</p>
                    <p className="text-[9px] text-primary font-black uppercase tracking-[0.4em] mt-2">{house ? `${house} House` : "Unassigned House"}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2 space-y-12">
                <section className="space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="h-[1px] w-8 bg-primary/40" />
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Core Identity (Required)</label>
                  </div>
                  <div className="space-y-4">
                    <Input 
                      placeholder="Your Full Name (As per school records)" 
                      className="bg-white/[0.03] border-white/10 h-16 rounded-2xl px-6 focus:ring-primary/20 transition-all text-white"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <div className="flex items-center px-6 bg-white/[0.02] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-white/20 h-16">
                        Batch 2018-2025
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <span className="h-[1px] w-8 bg-primary/40" />
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Identity Statement</label>
                    </div>
                    <EmojiPicker onEmojiSelect={addEmojiToShortBio} />
                  </div>
                  <Input 
                    placeholder="Describe your JNV journey in one sentence..." 
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
                    <EmojiPicker onEmojiSelect={addEmojiToFullBio} />
                  </div>
                  <Textarea 
                    placeholder="Share your favorite school memories, achievements, and final thoughts..." 
                    className="bg-white/[0.03] border-white/10 min-h-[300px] rounded-[2rem] p-8 focus:ring-primary/20 transition-all text-base leading-relaxed font-light font-serif italic text-white"
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
