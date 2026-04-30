
export interface Student {
  id: string;
  name: string;
  bio: string;
  photo: string;
  shortBio: string;
  department: string;
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
  imageUrl?: string;
}

export const YEAR_DATA: YearSectionData[] = [
  {
    id: "year-1",
    title: "The Fresh Start",
    subtitle: "2022-23 | Year 1",
    description: "Our first steps into college life. From orientation to finding our footing in the department, these were the days of new beginnings and building the foundation of our bond.",
    students: [],
    imageUrl: "/assets/journey/year-1.png"
  },
  {
    id: "year-2",
    title: "Building Bonds",
    subtitle: "2023-24 | Year 2",
    description: "Diving deeper into our academics and extracurriculars. The year where friendships solidified and we truly started calling this place home.",
    students: [],
    imageUrl: "/assets/journey/year-2.png"
  },
  {
    id: "year-3",
    title: "The Growth",
    subtitle: "2024-25 | Year 3",
    description: "Taking on more responsibilities and exploring our passions. A year of challenges, achievements, and realizing how far we've come together.",
    students: [],
    imageUrl: "/assets/journey/year-3.png"
  },
  {
    id: "year-4",
    title: "The Final Chapter",
    subtitle: "2025-26 | Year 4",
    description: "The culmination of our journey. Preparing for the future while cherishing every last moment with the people who became family.",
    students: [],
    imageUrl: "/assets/journey/year-4.png"
  }
];

export const ALL_STUDENTS = YEAR_DATA.flatMap(y => y.students);
