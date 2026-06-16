import {
  Building2,
  Dumbbell,
  FlaskConical,
  Library,
  Monitor,
  Wifi,
  type LucideIcon,
} from "lucide-react";

export type Facility = {
  slug: string;
  icon: LucideIcon;
  name: string;
  description: string;
  overview: string;
  highlights: string[];
  features: string[];
  gallery: { src: string; alt: string }[];
  color: string;
  bg: string;
  image: string;
};

export const FACILITIES: Facility[] = [
  {
    slug: "computer-laboratories",
    icon: Monitor,
    name: "Computer Laboratories",
    description:
      "Modern computer labs with high-speed internet and industry-standard software for every program.",
    overview:
      "Our computer laboratories give students hands-on experience with the tools they use in class and in the workplace — from productivity suites to specialized software for technical and creative tracks.",
    highlights: [
      "Four dedicated labs across the campus",
      "Updated workstations with licensed software",
      "Guided lab sessions with faculty supervision",
      "Open hours for projects and research work",
    ],
    features: ["100+ workstations", "High-speed fiber internet", "Latest software", "Air-conditioned"],
    gallery: [
      { src: "/facility-computer.jpg", alt: "Computer laboratory workstations" },
      { src: "/track-tvl.jpg", alt: "Students in a technology class" },
    ],
    color: "text-blue-600",
    bg: "bg-blue-50",
    image: "/facility-computer.jpg",
  },
  {
    slug: "science-laboratories",
    icon: FlaskConical,
    name: "Science Laboratories",
    description:
      "Fully equipped Biology, Chemistry, and Physics labs for safe, hands-on science learning.",
    overview:
      "Science laboratories support inquiry-based learning through experiments, demonstrations, and research activities aligned with the junior and senior high school curriculum.",
    highlights: [
      "Separate labs for Biology, Chemistry, and Physics",
      "Complete apparatus and safety equipment on site",
      "Supervised experiments during class and club activities",
      "Supports science fair and research projects",
    ],
    features: ["Biology Lab", "Chemistry Lab", "Physics Lab", "Safety equipment"],
    gallery: [
      { src: "/facility-science.jpg", alt: "Science laboratory equipment" },
      { src: "/event-science.jpg", alt: "Students at the science fair" },
    ],
    color: "text-green-600",
    bg: "bg-green-50",
    image: "/facility-science.jpg",
  },
  {
    slug: "library",
    icon: Library,
    name: "Library",
    description:
      "A quiet hub for reading, research, and study with books, e-resources, and study spaces.",
    overview:
      "The school library supports academic work and independent reading with a growing collection of print and digital materials, plus comfortable areas for individual and group study.",
    highlights: [
      "Over 10,000 books and reference materials",
      "Digital catalog and e-resource access",
      "Quiet zones and collaborative study tables",
      "Librarian support for research assignments",
    ],
    features: ["10,000+ books", "Digital catalog", "E-resources", "Study areas"],
    gallery: [
      { src: "/facility-library.jpg", alt: "School library reading area" },
      { src: "/junior-high-class.jpg", alt: "Students studying in class" },
    ],
    color: "text-purple-600",
    bg: "bg-purple-50",
    image: "/facility-library.jpg",
  },
  {
    slug: "sports-facilities",
    icon: Dumbbell,
    name: "Sports Facilities",
    description:
      "Gymnasium, courts, and fields for basketball, volleyball, swimming, and track & field.",
    overview:
      "Sports facilities give student-athletes space to train, compete, and stay active — supporting PE classes, varsity teams, intramurals, and school-wide athletic events.",
    highlights: [
      "Multi-purpose gymnasium for indoor sports",
      "Outdoor courts and athletic field",
      "Venues for intramurals and league play",
      "Supports varsity teams and PE programs",
    ],
    features: ["Gymnasium", "Basketball courts", "Volleyball courts", "Athletic field"],
    gallery: [
      { src: "/facility-sports.jpg", alt: "School sports facilities" },
      { src: "/event-sports.jpg", alt: "Students at sports fest" },
    ],
    color: "text-orange-600",
    bg: "bg-orange-50",
    image: "/facility-sports.jpg",
  },
  {
    slug: "campus-wifi",
    icon: Wifi,
    name: "Campus Wi-Fi",
    description:
      "Reliable wireless internet across campus for students, teachers, and school operations.",
    overview:
      "Campus-wide Wi-Fi keeps classrooms, labs, and common areas connected so students can access learning platforms, research online, and collaborate on digital projects.",
    highlights: [
      "Coverage in classrooms, labs, and common areas",
      "Fiber-optic backbone for stable speeds",
      "Secure network for school devices and accounts",
      "Supports blended and research-based learning",
    ],
    features: ["Campus-wide coverage", "Fiber-optic backbone", "Secure network"],
    gallery: [
      { src: "/facility-wifi.jpg", alt: "Students using campus Wi-Fi" },
      { src: "/facility-classroom.jpg", alt: "Connected classroom environment" },
    ],
    color: "text-teal-600",
    bg: "bg-teal-50",
    image: "/facility-wifi.jpg",
  },
  {
    slug: "classrooms",
    icon: Building2,
    name: "Classrooms",
    description:
      "Spacious, well-ventilated rooms with projectors, whiteboards, and modern teaching aids.",
    overview:
      "Classrooms are designed for focused learning — with comfortable seating, clear sightlines, and technology that helps teachers deliver engaging lessons every day.",
    highlights: [
      "Air-conditioned and well-ventilated rooms",
      "Projectors, screens, and whiteboards in every room",
      "Ergonomic furniture for long class periods",
      "CCTV monitoring for campus safety",
    ],
    features: ["Projectors & screens", "Air-conditioned", "Ergonomic furniture", "CCTV monitored"],
    gallery: [
      { src: "/facility-classroom.jpg", alt: "Modern classroom setup" },
      { src: "/senior-high-class.jpg", alt: "Senior high students in class" },
    ],
    color: "text-red-600",
    bg: "bg-red-50",
    image: "/facility-classroom.jpg",
  },
];

export function getFacilityBySlug(slug: string) {
  return FACILITIES.find((facility) => facility.slug === slug);
}
