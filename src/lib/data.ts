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
  description: string;
  students: Student[];
}

export const YEAR_DATA: YearSectionData[] = [
  {
    id: "class-6",
    title: "Class 6: The New Journey",
    description: "Leaving the warmth of home to find a new family. Those oversized uniforms and the first night in the massive dorm.",
    students: [
      {
        id: "aryan-sharma",
        name: "Aryan Sharma",
        bio: "The quiet dreamer from Aravalli House who mastered the art of hidden reading.",
        photo: "https://picsum.photos/seed/student1/400/500",
        classYear: "6",
        house: "Aravalli",
        quote: "Navodaya isn't just a school, it's the place where we truly learned to live.",
        highlights: ["First House Trophy", "Midnight snacks", "Navodaya Entrance Day"],
        memories: [
          { title: "The Trunk Box", description: "Loading everything I owned into one steel box. The beginning of independence.", image: "https://picsum.photos/seed/m1/800/600" }
        ]
      },
      {
        id: "priya-verma",
        name: "Priya Verma",
        bio: "The Nilgiri sprinter who made morning PT look like a breeze.",
        photo: "https://picsum.photos/seed/student2/400/500",
        classYear: "6",
        house: "Nilgiri",
        quote: "Running through the morning mist, we found ourselves.",
        highlights: ["100m Sprint Gold", "Morning PT Captain"],
        memories: [
          { title: "Mess Fun", description: "Sharing the last bit of pickle from home with the whole table.", image: "https://picsum.photos/seed/m2/800/600" }
        ]
      }
    ]
  },
  {
    id: "class-9",
    title: "Class 9: Migration Year",
    description: "Packing bags for a different state. New language, new food, but the same Navodaya brotherhood across borders.",
    students: [
      {
        id: "rahul-das",
        name: "Rahul Das",
        bio: "The Shivalik musician who spent his migration year learning Marathi folk songs.",
        photo: "https://picsum.photos/seed/student3/400/500",
        classYear: "9",
        house: "Shivalik",
        quote: "Distance only made the bond stronger.",
        highlights: ["Migration Award", "Cultural Exchange Lead"],
        memories: [
          { title: "Train Journey", description: "36 hours on a train with the best people. Migration was a life lesson.", image: "https://picsum.photos/seed/m3/800/600" }
        ]
      }
    ]
  },
  {
    id: "class-12",
    title: "Class 12: Final Roll Call",
    description: "The hardest 'Thank You'. Seven years distilled into one final evening at the canteen and the last walk to the dorm.",
    students: [
      {
        id: "sneha-reddy",
        name: "Sneha Reddy",
        bio: "Udaygiri's pride, Head Girl, and the one who made JNV feel like a legacy.",
        photo: "https://picsum.photos/seed/student4/400/500",
        classYear: "12",
        house: "Udaygiri",
        quote: "Once a Navodayan, Always a Navodayan. It's in the DNA.",
        highlights: ["National Debate Winner", "School Captain"],
        memories: [
          { title: "Last Roll Call", description: "Hearing my name called out for the last time. Tears were real.", image: "https://picsum.photos/seed/m4/800/600" }
        ]
      }
    ]
  }
];

export const ALL_STUDENTS = YEAR_DATA.flatMap(y => y.students);
