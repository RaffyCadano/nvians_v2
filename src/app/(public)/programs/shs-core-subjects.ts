import {
  Atom,
  BookOpen,
  Calculator,
  Globe,
  Heart,
  Languages,
  Leaf,
  Medal,
  Monitor,
  Palette,
  Users,
  type LucideIcon,
} from "lucide-react";

export type ShsCoreSubject = {
  slug: string;
  name: string;
  icon: LucideIcon;
  description: string;
  overview: string;
  highlights: string[];
  gallery: { src: string; alt: string }[];
};

export const SHS_CORE_SUBJECTS: ShsCoreSubject[] = [
  {
    slug: "oral-communication",
    name: "Oral Communication",
    icon: Users,
    description:
      "Builds effective speaking, listening, and presentation skills for academic and professional settings.",
    overview:
      "Oral Communication develops confident speakers and attentive listeners through presentations, discussions, and performance tasks — essential skills for college, work, and leadership.",
    highlights: [
      "Public speaking and presentation techniques",
      "Active listening and thoughtful response",
      "Formal and informal communication contexts",
      "Preparation for reports, interviews, and teamwork",
    ],
    gallery: [
      { src: "/senior-high-class.jpg", alt: "Senior high students in class" },
      { src: "/event-leadership.jpg", alt: "Student presentation activity" },
    ],
  },
  {
    slug: "reading-writing-skills",
    name: "Reading & Writing Skills",
    icon: BookOpen,
    description:
      "Enhances critical reading and academic writing through various text types and rhetorical strategies.",
    overview:
      "This subject strengthens literacy for senior high through close reading, analysis, and academic writing across genres — supporting success in all tracks and future college work.",
    highlights: [
      "Critical reading of academic and literary texts",
      "Essays, summaries, and research-based writing",
      "Rhetorical strategies and text organization",
      "Foundation for capstone and research projects",
    ],
    gallery: [
      { src: "/senior-high-class.jpg", alt: "Students reading and writing" },
      { src: "/facility-library.jpg", alt: "Library research area" },
    ],
  },
  {
    slug: "komunikasyon-at-pananaliksik",
    name: "Komunikasyon at Pananaliksik",
    icon: Languages,
    description:
      "Develops Filipino communication skills and introduces research methodologies in the Filipino language.",
    overview:
      "Komunikasyon at Pananaliksik builds proficiency in Filipino while introducing research skills — helping students communicate clearly and conduct inquiry in the national language.",
    highlights: [
      "Oral and written communication in Filipino",
      "Research methods and source evaluation",
      "Pananaliksik papers and presentations",
      "Appreciation of Filipino scholarly discourse",
    ],
    gallery: [
      { src: "/senior-high-class.jpg", alt: "Filipino class discussion" },
      { src: "/event-cultural.jpg", alt: "School cultural program" },
    ],
  },
  {
    slug: "general-mathematics",
    name: "General Mathematics",
    icon: Calculator,
    description:
      "Covers functions, business math, logic, and statistics for real-world problem solving.",
    overview:
      "General Mathematics applies quantitative reasoning to everyday and business contexts — covering functions, logic, statistics, and financial math for all senior high tracks.",
    highlights: [
      "Functions, logic, and mathematical reasoning",
      "Business mathematics and financial literacy",
      "Statistics and data interpretation",
      "Real-world problem solving across tracks",
    ],
    gallery: [
      { src: "/senior-high-class.jpg", alt: "Mathematics class" },
      { src: "/track-academic.jpg", alt: "Academic track students" },
    ],
  },
  {
    slug: "earth-life-science",
    name: "Earth & Life Science",
    icon: Leaf,
    description:
      "Explores geology, ecology, genetics, and biodiversity to understand our natural world.",
    overview:
      "Earth and Life Science examines how living things and Earth systems interact — from geology and ecology to genetics and biodiversity — with lab work and inquiry activities.",
    highlights: [
      "Geology, ecology, and environmental systems",
      "Genetics, evolution, and biodiversity",
      "Laboratory investigations and field concepts",
      "Preparation for STEM and science-related tracks",
    ],
    gallery: [
      { src: "/facility-science.jpg", alt: "Science laboratory" },
      { src: "/event-science.jpg", alt: "Science fair projects" },
    ],
  },
  {
    slug: "physical-science",
    name: "Physical Science",
    icon: Atom,
    description:
      "Introduces fundamental concepts in chemistry and physics with practical applications.",
    overview:
      "Physical Science introduces core chemistry and physics concepts with demonstrations and experiments — building the scientific foundation needed for STEM and related pathways.",
    highlights: [
      "Fundamental chemistry and physics concepts",
      "Experiments, demonstrations, and lab safety",
      "Applications to technology and daily life",
      "Bridge to specialized STEM subjects in Grade 12",
    ],
    gallery: [
      { src: "/facility-science.jpg", alt: "Physical science lab" },
      { src: "/track-academic.jpg", alt: "STEM students in class" },
    ],
  },
  {
    slug: "personal-development",
    name: "Personal Development",
    icon: Heart,
    description:
      "Guides self-awareness, emotional intelligence, and goal setting for adolescent growth.",
    overview:
      "Personal Development supports senior high students through self-awareness, emotional intelligence, career exploration, and goal setting during a critical stage of growth.",
    highlights: [
      "Self-awareness and emotional intelligence",
      "Goal setting and decision-making skills",
      "Career exploration and life planning",
      "Integration with guidance and counseling programs",
    ],
    gallery: [
      { src: "/senior-high-class.jpg", alt: "Guidance session in class" },
      { src: "/students-events.jpg", alt: "Students at a school activity" },
    ],
  },
  {
    slug: "understanding-culture-society-politics",
    name: "Understanding Culture, Society & Politics",
    icon: Globe,
    description:
      "Examines cultural diversity, social structures, and political systems in Philippine and global contexts.",
    overview:
      "UCSP explores how culture, society, and politics shape Filipino and global life — helping students think critically about identity, institutions, and civic participation.",
    highlights: [
      "Cultural diversity and social structures",
      "Philippine and global political systems",
      "Critical analysis of contemporary issues",
      "Foundation for HUMSS and civic engagement",
    ],
    gallery: [
      { src: "/senior-high-class.jpg", alt: "Social sciences discussion" },
      { src: "/about-school.jpg", alt: "Nueva Vizcaya Institute campus" },
    ],
  },
  {
    slug: "contemporary-philippine-arts",
    name: "Contemporary Philippine Arts",
    icon: Palette,
    description:
      "Appreciates Philippine art forms across regions and explores creative expression.",
    overview:
      "Contemporary Philippine Arts introduces students to regional and modern Filipino art forms — fostering appreciation, analysis, and creative expression across media.",
    highlights: [
      "Philippine art forms across regions and eras",
      "Analysis and appreciation of contemporary works",
      "Creative projects and cultural expression",
      "Connection to Arts & Design and HUMSS tracks",
    ],
    gallery: [
      { src: "/track-arts.jpg", alt: "Arts and design students" },
      { src: "/event-cultural.jpg", alt: "Cultural night performance" },
    ],
  },
  {
    slug: "media-information-literacy",
    name: "Media & Information Literacy",
    icon: Monitor,
    description:
      "Develops critical evaluation of media content and responsible use of information technology.",
    overview:
      "Media and Information Literacy equips students to evaluate sources, use technology responsibly, and navigate digital media — skills essential in school, work, and daily life.",
    highlights: [
      "Critical evaluation of media and online content",
      "Responsible use of information technology",
      "Research, citation, and digital citizenship",
      "Preparation for academic and workplace literacy",
    ],
    gallery: [
      { src: "/facility-computer.jpg", alt: "Computer laboratory" },
      { src: "/club-media.jpg", alt: "Campus media activities" },
    ],
  },
  {
    slug: "physical-education-health",
    name: "Physical Education & Health",
    icon: Medal,
    description:
      "Promotes active lifestyles, fitness, and wellness through sports and health education.",
    overview:
      "Physical Education and Health promotes fitness, sports skills, and wellness habits — supporting active lifestyles and health literacy for all senior high students.",
    highlights: [
      "Sports skills, fitness, and team activities",
      "Health education and wellness practices",
      "Active lifestyle and injury prevention basics",
      "Supports Sports track and general well-being",
    ],
    gallery: [
      { src: "/facility-sports.jpg", alt: "Sports facilities" },
      { src: "/event-sports.jpg", alt: "Sports fest competition" },
    ],
  },
];

export function getShsCoreSubjectBySlug(slug: string) {
  return SHS_CORE_SUBJECTS.find((subject) => subject.slug === slug);
}
