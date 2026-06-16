import {
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Heart,
  Languages,
  Music,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type JhsSubject = {
  slug: string;
  name: string;
  icon: LucideIcon;
  description: string;
  overview: string;
  highlights: string[];
  gallery: { src: string; alt: string }[];
};

export const JHS_SUBJECTS: JhsSubject[] = [
  {
    slug: "english",
    name: "English",
    icon: BookOpen,
    description:
      "Develops reading comprehension, writing, grammar, and oral communication skills through literature and composition.",
    overview:
      "The English program builds strong literacy across Grades 7–10 through literature, composition, grammar, and oral communication — preparing students for senior high, college, and professional settings.",
    highlights: [
      "Reading and analyzing fiction, non-fiction, and poetry",
      "Writing essays, reports, and creative pieces",
      "Grammar, vocabulary, and oral communication practice",
      "Preparation for academic and workplace communication",
    ],
    gallery: [
      { src: "/junior-high-class.jpg", alt: "Junior high students in class" },
      { src: "/facility-library.jpg", alt: "Students reading in the library" },
    ],
  },
  {
    slug: "filipino",
    name: "Filipino",
    icon: Languages,
    description:
      "Strengthens Filipino language proficiency through panitikan, gramatika, and creative expression.",
    overview:
      "Filipino develops students' mastery of the national language through literature, grammar, and creative writing — fostering appreciation for Philippine culture and identity.",
    highlights: [
      "Panitikan and critical reading in Filipino",
      "Grammar, composition, and oral presentation",
      "Creative writing and cultural expression",
      "Appreciation of Philippine language and heritage",
    ],
    gallery: [
      { src: "/junior-high-class.jpg", alt: "Students in a Filipino class" },
      { src: "/event-cultural.jpg", alt: "Cultural program at school" },
    ],
  },
  {
    slug: "mathematics",
    name: "Mathematics",
    icon: Calculator,
    description:
      "Covers algebra, geometry, statistics, and problem-solving to build strong quantitative reasoning.",
    overview:
      "Mathematics develops logical thinking and problem-solving from foundational arithmetic through algebra, geometry, and statistics — skills essential for STEM tracks and everyday life.",
    highlights: [
      "Algebra, geometry, and statistics across grade levels",
      "Step-by-step problem-solving and reasoning",
      "Applications to real-world and career contexts",
      "Foundation for STEM and business pathways",
    ],
    gallery: [
      { src: "/junior-high-class.jpg", alt: "Students solving math problems" },
      { src: "/track-academic.jpg", alt: "Academic track classroom" },
    ],
  },
  {
    slug: "science",
    name: "Science",
    icon: FlaskConical,
    description:
      "Explores Earth science, biology, chemistry, and physics with hands-on laboratory activities.",
    overview:
      "Science introduces students to the natural world through inquiry, experiments, and lab work — covering Earth science, biology, chemistry, and physics aligned with the K–12 curriculum.",
    highlights: [
      "Earth science, biology, chemistry, and physics topics",
      "Hands-on laboratory and investigation activities",
      "Scientific method and evidence-based reasoning",
      "Preparation for science fair and STEM tracks",
    ],
    gallery: [
      { src: "/facility-science.jpg", alt: "Science laboratory" },
      { src: "/event-science.jpg", alt: "Students at the science fair" },
    ],
  },
  {
    slug: "araling-panlipunan",
    name: "Araling Panlipunan (AP)",
    icon: Globe,
    description:
      "Studies Philippine and world history, geography, economics, and governance for civic awareness.",
    overview:
      "Araling Panlipunan helps students understand Philippine and world history, geography, economics, and government — building informed, engaged citizens.",
    highlights: [
      "Philippine history and contemporary issues",
      "World history and geography",
      "Economics and governance concepts",
      "Civic awareness and social responsibility",
    ],
    gallery: [
      { src: "/junior-high-class.jpg", alt: "Social studies discussion in class" },
      { src: "/about-school.jpg", alt: "Nueva Vizcaya Institute campus" },
    ],
  },
  {
    slug: "edukasyon-sa-pagpapakatao",
    name: "Edukasyon sa Pagpapakatao (EsP)",
    icon: Heart,
    description:
      "Develops moral character, ethical decision-making, and values formation for responsible citizenship.",
    overview:
      "EsP guides students in values formation, ethical decision-making, and responsible citizenship — supporting holistic development alongside academic learning.",
    highlights: [
      "Values education and character development",
      "Ethical decision-making in daily life",
      "Respect, responsibility, and community awareness",
      "Integration with school guidance programs",
    ],
    gallery: [
      { src: "/students-events.jpg", alt: "Students at a school event" },
      { src: "/event-leadership.jpg", alt: "Student leadership activity" },
    ],
  },
  {
    slug: "technology-livelihood-education",
    name: "Technology & Livelihood Education (TLE)",
    icon: Wrench,
    description:
      "Introduces practical skills in ICT, home economics, agriculture, and industrial arts.",
    overview:
      "TLE gives students practical, livelihood-oriented skills in ICT, home economics, agriculture, and industrial arts — connecting classroom learning to real-world work.",
    highlights: [
      "ICT and computer literacy fundamentals",
      "Home economics and everyday life skills",
      "Agriculture and industrial arts exposure",
      "Early career and entrepreneurship awareness",
    ],
    gallery: [
      { src: "/facility-computer.jpg", alt: "Computer laboratory" },
      { src: "/track-tvl.jpg", alt: "TVL track students at work" },
    ],
  },
  {
    slug: "mapeh",
    name: "MAPEH",
    icon: Music,
    description:
      "Integrates Music, Arts, Physical Education, and Health for well-rounded personal development.",
    overview:
      "MAPEH combines Music, Arts, Physical Education, and Health to support creativity, fitness, and wellness — helping students grow physically, artistically, and emotionally.",
    highlights: [
      "Music and arts appreciation and performance",
      "Physical education and sports activities",
      "Health education and wellness habits",
      "Creative expression and active lifestyles",
    ],
    gallery: [
      { src: "/track-arts.jpg", alt: "Arts and design students" },
      { src: "/event-sports.jpg", alt: "Students at sports fest" },
    ],
  },
];

export function getJhsSubjectBySlug(slug: string) {
  return JHS_SUBJECTS.find((subject) => subject.slug === slug);
}
