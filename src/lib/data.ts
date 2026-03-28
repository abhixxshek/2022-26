export interface Student {
  id: string;
  name: string;
  bio: string;
  photo: string;
  classYear: string;
  house: "Aravalli" | "Nilgiri" | "Shivalik" | "Udaygiri";
  quote: string;
  highlights: string[];
  memories: {
    title: string;
    description: string;
    image?: string;
  }[];
}

export interface YearSectionData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  students: Student[];
}

export const YEAR_DATA: YearSectionData[] = [
  {
    id: "class-6-2018",
    title: "2018: The Awakening",
    subtitle: "Class 6 - Entry into the Gates",
    description: "The year of the heavy steel Trunk Box and the oversized uniforms. From crying for home to finding a second family in the dormitories.",
    students: [
      {
        id: "aryan-sharma",
        name: "Aryan Sharma",
        bio: "The boy who carried the smallest trunk but the biggest dreams. Aravalli House's first chess champion.",
        photo: "https://picsum.photos/seed/student1/400/500",
        classYear: "6",
        house: "Aravalli",
        quote: "We came as strangers with trunk boxes; we left as brothers with memories.",
        highlights: ["First House Trophy", "Midnight snacks", "Navodaya Entrance Day"],
        memories: [
          { title: "The First Night", description: "30 boys in one hall. The sound of muffled sobs turned into whispers of friendship by midnight.", image: "https://picsum.photos/seed/m1/800/600" }
        ]
      },
      {
        id: "priya-verma",
        name: "Priya Verma",
        bio: "Nilgiri's star athlete. She never missed a morning PT in seven years.",
        photo: "https://picsum.photos/seed/student2/400/500",
        classYear: "6",
        house: "Nilgiri",
        quote: "The whistle at 5:30 AM was our alarm for life.",
        highlights: ["100m Sprint Gold", "Morning PT Captain"],
        memories: [
          { title: "Mess Rituals", description: "The struggle for the extra piece of paneer on Sundays. Mess food is a vibe.", image: "https://picsum.photos/seed/m2/800/600" }
        ]
      }
    ]
  },
  {
    id: "class-9-2021",
    title: "2021: The Great Migration",
    subtitle: "Class 9 - Crossing Borders",
    description: "Packing bags for a different state. Learning a new language, tasting different spices, and proving that JNV spirit knows no borders.",
    students: [
      {
        id: "rahul-das",
        name: "Rahul Das",
        bio: "The musician who bridged the gap between states through his guitar during the Migration year.",
        photo: "https://picsum.photos/seed/student3/400/500",
        classYear: "9",
        house: "Shivalik",
        quote: "Migration taught me that 'home' is a feeling, not a place.",
        highlights: ["Migration Award", "Cultural Exchange Lead"],
        memories: [
          { title: "The 36-Hour Train", description: "Singing songs across the sleeper coach. Migration was the best lesson in geography.", image: "https://picsum.photos/seed/m3/800/600" }
        ]
      }
    ]
  },
  {
    id: "class-12-2025",
    title: "2025: The Final Salute",
    subtitle: "Class 12 - Seniority & Farewell",
    description: "The transition from being the 'juniors' to the 'pillars of the school'. Final preps, late-night tea in the dorm, and the emotional walk through the gates.",
    students: [
      {
        id: "sneha-reddy",
        name: "Sneha Reddy",
        bio: "Udaygiri's Head Girl. From the first roll call to the last, she led with grace.",
        photo: "https://picsum.photos/seed/student4/400/500",
        classYear: "12",
        house: "Udaygiri",
        quote: "JNV didn't just give us education; it gave us a backbone.",
        highlights: ["National Debate Winner", "School Captain"],
        memories: [
          { title: "The Last Night", description: "We didn't sleep. We sat on the dormitory roof, watching the campus lights one last time.", image: "https://picsum.photos/seed/m4/800/600" }
        ]
      }
    ]
  }
];

export const ALL_STUDENTS = YEAR_DATA.flatMap(y => y.students);
