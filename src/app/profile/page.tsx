"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Save, Loader2, Home as HomeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

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
    }
  }, [studentData]);

  const handleSave = () => {
    if (!studentRef || !user) return;
    
    const updatedData = {
      id: user.uid,
      batchId,
      name,
      email: user.email,
      shortBio,
      fullBio,
      house,
      profilePhotoUrl: `https://picsum.photos/seed/${user.uid}/400/500`,
    };

    setDocumentNonBlocking(studentRef, updatedData, { merge: true });
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
                <p className="text-muted-foreground font-light">Craft your profile for the digital yearbook.</p>
              </div>
              <Button onClick={handleSave} className="bg-primary text-black font-black uppercase tracking-widest gap-2">
                <Save className="w-4 h-4" /> Save Profile
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-1">
                <Card className="glass border-white/10 overflow-hidden">
                  <div className="aspect-[4/5] relative bg-[#111]">
                    <img 
                      src={`https://picsum.photos/seed/${user?.uid}/400/500`} 
                      className="w-full h-full object-cover grayscale"
                      alt="Profile"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Live Preview</CardTitle>
                    <p className="text-xl font-headline font-bold text-white mt-2">{name || "Your Name"}</p>
                    <p className="text-xs text-primary font-bold uppercase tracking-widest">{house ? `${house} House` : "House Selection"}</p>
                  </CardHeader>
                </Card>
              </div>

              <div className="md:col-span-2 space-y-8">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-primary">Personal Details</label>
                  <Input 
                    placeholder="Full Name" 
                    className="bg-white/5 border-white/10 py-6"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Select onValueChange={setHouse} value={house}>
                      <SelectTrigger className="bg-white/5 border-white/10 py-6">
                        <SelectValue placeholder="Select House" />
                      </SelectTrigger>
                      <SelectContent className="glass">
                        {["Aravalli", "Nilgiri", "Shivalik", "Udaygiri"].map(h => (
                          <SelectItem key={h} value={h}>{h} House</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input 
                      disabled 
                      value="Batch 2018-2025" 
                      className="bg-white/5 border-white/10 py-6 opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-primary">Introductory Bio (Card View)</label>
                  <Input 
                    placeholder="e.g. The unofficial house strategist of Aravalli..." 
                    className="bg-white/5 border-white/10 py-6"
                    value={shortBio}
                    onChange={(e) => setShortBio(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-primary">Detailed Bio (Profile Page)</label>
                  <Textarea 
                    placeholder="Tell your 7-year story... from Class 6 to 12." 
                    className="bg-white/5 border-white/10 min-h-[200px]"
                    value={fullBio}
                    onChange={(e) => setFullBio(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
