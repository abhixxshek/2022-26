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
    id: "class-6",
    title: "The Arrival",
    subtitle: "2018-2019 | Class 6",
    description: "The sound of oversized trunks hitting the dormitory floor. We were small children lost in a massive campus, crying for home, eventually finding it in each other. From the first 'Roll Call' to the first 'Mess' meal.",
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
      }
    ]
  },
  {
    id: "class-7",
    title: "The Bond",
    subtitle: "2019-2020 | Class 7",
    description: "No longer the 'newbies', we started owning the corridors. First house matches, the first time we sneaked into the mess for an extra cup of tea, and the birth of friendships that would last a lifetime.",
    students: []
  },
  {
    id: "class-8",
    title: "The Middle Path",
    subtitle: "2020-2021 | Class 8",
    description: "The transition year. We became 'Middles'. Late night whispers in dormitories and the first realizations of how big our world really was within these JNV gates.",
    students: []
  },
  {
    id: "class-9",
    title: "The Great Migration",
    subtitle: "2021-2022 | Class 9",
    description: "A 2000km train journey to a land with a different language. We learned that 'National Integration' wasn't just a chapter in civics, but a lived reality. Mini-India in a sleeper coach.",
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
    id: "class-10",
    title: "The Board Prep",
    subtitle: "2022-2023 | Class 10",
    description: "The pressure of first boards, the 'Night Prep' rituals, and the library becoming our second home. Biscuits shared during study breaks and the fear of the future starting to creep in.",
    students: [
      {
        id: "priya-verma",
        name: "Priya Verma",
        bio: "Nilgiri's silent powerhouse. Her track records from Class 7 still stand today, even as she prepped for boards.",
        photo: "https://picsum.photos/seed/student2/400/500",
        classYear: "10",
        house: "Nilgiri",
        quote: "The gates of JNV open to a world you never want to leave.",
        highlights: ["100m Sprint Gold", "Science Exhibition Runner-up"],
        memories: [
          { title: "Board Night Prep", description: "Sneaking biscuits into the library during 11 PM study sessions.", image: "https://picsum.photos/seed/m2/800/600" }
        ]
      }
    ]
  },
  {
    id: "class-11",
    title: "The Seniority",
    subtitle: "2023-2024 | Class 11",
    description: "The Golden Year. Seniors but without the immediate board pressure. Exploring our talents, winning trophies for the house, and realizing we only had two years left of this magic.",
    students: []
  },
  {
    id: "class-12",
    title: "The Final Salute",
    subtitle: "2024-2025 | Class 12",
    description: "The transition to 'Legends'. Farewell tears, writing on each other's shirts, and the long walk out of the main gate. Once a Navodayan, Always a Navodayan.",
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
