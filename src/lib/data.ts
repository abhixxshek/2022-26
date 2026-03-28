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
    id: "juniors",
    title: "The Genesis",
    subtitle: "2018-2020 | Class 6 & 7",
    description: "The sound of oversized trunks hitting the dormitory floor. We were small children lost in a massive campus, crying for home, eventually finding it in each other.",
    students: [
      {
        id: "aryan-sharma",
        name: "Aryan Sharma",
        bio: "The kid who always managed to get extra paneer from the mess. Our unofficial Aravalli House strategist.",
        photo: "https://picsum.photos/seed/student1/400/500",
        classYear: "6",
        house: "Aravalli",
        quote: "We didn't know we were making memories, we just thought we were having fun.",
        highlights: ["Best Bedmaker Award", "Inter-House Debate 2018", "Morning PT Captain"],
        memories: [
          { title: "First Night", description: "30 kids in one hall, all pretending to be asleep while actually sobbing for home.", image: "https://picsum.photos/seed/m1/800/600" }
        ]
      },
      {
        id: "priya-verma",
        name: "Priya Verma",
        bio: "Nilgiri's silent powerhouse. Her track records from Class 7 still stand today.",
        photo: "https://picsum.photos/seed/student2/400/500",
        classYear: "7",
        house: "Nilgiri",
        quote: "The gates of JNV open to a world you never want to leave.",
        highlights: ["100m Sprint Gold", "Science Exhibition Runner-up"],
        memories: [
          { title: "Sunday Specials", description: "The collective rush to the mess when the smell of Puri-Sabji hit the dorms.", image: "https://picsum.photos/seed/m2/800/600" }
        ]
      }
    ]
  },
  {
    id: "migration",
    title: "The Great Migration",
    subtitle: "2021-2022 | Class 9",
    description: "Leaving our home JNV to stay in another state for a year. Learning a new language, surviving a 40-hour train journey, and becoming true Indians.",
    students: [
      {
        id: "rahul-das",
        name: "Rahul Das",
        bio: "Shivalik's best singer. He learned to sing in three different regional languages during the Migration year.",
        photo: "https://picsum.photos/seed/student3/400/500",
        classYear: "9",
        house: "Shivalik",
        quote: "Migration is the soul of Navodaya.",
        highlights: ["Cultural Ambassador", "Best Singer 2021"],
        memories: [
          { title: "The Train Journey", description: "Singing 'Hum Navodaya Ho' at 2 AM in a sleeper coach while passing through the Ghats.", image: "https://picsum.photos/seed/m3/800/600" }
        ]
      }
    ]
  },
  {
    id: "legends",
    title: "The Last Salute",
    subtitle: "2023-2025 | Class 11 & 12",
    description: "The transition from being the 'babies' to the 'Legends'. Late-night studies, farewell tears, and the realization that the seven years are finally ending.",
    students: [
      {
        id: "sneha-reddy",
        name: "Sneha Reddy",
        bio: "Udaygiri's Head Girl. From the first roll call to the last, she led the batch with grace and strength.",
        photo: "https://picsum.photos/seed/student4/400/500",
        classYear: "12",
        house: "Udaygiri",
        quote: "Seven years, one home, a lifetime of bonds.",
        highlights: ["School Captain", "National Volleyball Player"],
        memories: [
          { title: "The Final Walk", description: "Looking back at the academic block one last time after the last exam.", image: "https://picsum.photos/seed/m4/800/600" }
        ]
      }
    ]
  }
];

export const ALL_STUDENTS = YEAR_DATA.flatMap(y => y.students);