
export interface Student {
  id: string;
  name: string;
  bio: string;
  photo: string;
  classYear: string;
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
    title: "Class 6: The Beginning",
    description: "Leaving home for the first time, wide-eyed and nervous. The start of a 7-year brotherhood.",
    students: [
      {
        id: "aryan-sharma",
        name: "Aryan Sharma",
        bio: "The quiet dreamer who always had a book hidden under the desk.",
        photo: "https://picsum.photos/seed/student1/400/500",
        classYear: "6",
        quote: "Home is not a place, it's a feeling we built here.",
        highlights: ["First House Trophy", "Midnight snacks", "Navodaya Entrance Day"],
        memories: [
          { title: "First Day Jitters", description: "Crying in the dorm but finding a friend in the next bunk.", image: "https://picsum.photos/seed/m1/800/600" }
        ]
      },
      {
        id: "priya-verma",
        name: "Priya Verma",
        bio: "The girl who could outrun anyone on the PT field.",
        photo: "https://picsum.photos/seed/student2/400/500",
        classYear: "6",
        quote: "Run like you own the ground.",
        highlights: ["100m Sprint Gold", "Drama Club Lead"],
        memories: [
          { title: "Rainy Football", description: "Playing in the mud until the warden caught us.", image: "https://picsum.photos/seed/m2/800/600" }
        ]
      }
    ]
  },
  {
    id: "class-10",
    title: "Class 10: The Turning Point",
    description: "Board exams, teenage rebellions, and the realization that half our journey was over.",
    students: [
      {
        id: "rahul-das",
        name: "Rahul Das",
        bio: "Known for his guitar and his ability to sleep through math.",
        photo: "https://picsum.photos/seed/student3/400/500",
        classYear: "10",
        quote: "Music was our only escape from the trigonometry.",
        highlights: ["School Band Founder", "Best Dorm Decoration"],
        memories: [
          { title: "The Farewell Party", description: "Singing 'Yaaron' until we all cried.", image: "https://picsum.photos/seed/m3/800/600" }
        ]
      }
    ]
  },
  {
    id: "class-12",
    title: "Class 12: Final Chapter",
    description: "The hardest goodbyes. Dreams of the future mixed with the pain of leaving our second home.",
    students: [
      {
        id: "sneha-reddy",
        name: "Sneha Reddy",
        bio: "Head Girl, topper, and the one who kept the group together.",
        photo: "https://picsum.photos/seed/student4/400/500",
        classYear: "12",
        quote: "Once a Navodayan, always a Navodayan.",
        highlights: ["National Debate Winner", "Academic Excellence Award"],
        memories: [
          { title: "Last Night in Campus", description: "Walking through the silence of the corridors one last time.", image: "https://picsum.photos/seed/m4/800/600" }
        ]
      }
    ]
  }
];

export const ALL_STUDENTS = YEAR_DATA.flatMap(y => y.students);
