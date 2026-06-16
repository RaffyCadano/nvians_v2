import {
  BookMarked,
  Camera,
  Dumbbell,
  Globe,
  Music,
  Users,
  type LucideIcon,
} from "lucide-react";

export type Club = {
  slug: string;
  icon: LucideIcon;
  title: string;
  description: string;
  overview: string;
  highlights: string[];
  items: string[];
  gallery: { src: string; alt: string }[];
  color: string;
  image: string;
};

export const CLUBS: Club[] = [
  {
    slug: "academic-clubs",
    icon: BookMarked,
    title: "Academic Clubs",
    description:
      "Sharpen skills in math, science, language, and critical thinking through competitions and workshops.",
    overview:
      "Academic clubs give students a space to go beyond the classroom — preparing for contests, building study habits, and working with peers who share the same goals.",
    highlights: [
      "Prepare for quizzes, contests, and academic competitions",
      "Get guidance from teachers and upperclass mentors",
      "Build study habits that carry over to the classroom",
    ],
    items: ["Math Club", "Science Society", "English Club", "Debate Team"],
    gallery: [
      { src: "/event-science.jpg", alt: "Students at the science fair" },
      { src: "/track-academic.jpg", alt: "Academic track students in class" },
    ],
    color: "text-blue-600",
    image: "/club-academic.jpg",
  },
  {
    slug: "arts-culture",
    icon: Music,
    title: "Arts & Culture",
    description:
      "Express creativity through music, dance, theater, and visual arts while building confidence on stage.",
    overview:
      "From rehearsals to performances, arts and culture groups help students discover their talents and represent Nueva Vizcaya Institute in school programs and community events.",
    highlights: [
      "Perform in school programs, festivals, and special events",
      "Learn from faculty advisers and guest artists",
      "Grow confidence through music, dance, theater, or visual arts",
    ],
    items: ["Choir", "Dance Troupe", "Theater Guild", "Art Club"],
    gallery: [
      { src: "/event-cultural.jpg", alt: "Cultural night performance" },
      { src: "/track-arts.jpg", alt: "Arts and design students at work" },
    ],
    color: "text-purple-600",
    image: "/club-arts.jpg",
  },
  {
    slug: "sports-organizations",
    icon: Dumbbell,
    title: "Sports Organizations",
    description:
      "Develop teamwork, discipline, and athletic excellence through school teams and fitness activities.",
    overview:
      "Sports organizations train student-athletes for intramurals, league play, and school-wide events while promoting health, fair play, and school spirit.",
    highlights: [
      "Train with coaches and team captains after class",
      "Compete in intramurals and inter-school meets",
      "Build discipline, teamwork, and school pride",
    ],
    items: ["Basketball Team", "Volleyball Team", "Swimming Club", "Athletics"],
    gallery: [
      { src: "/event-sports.jpg", alt: "Students competing at sports fest" },
      { src: "/facility-sports.jpg", alt: "School sports facilities" },
    ],
    color: "text-green-600",
    image: "/club-sports.jpg",
  },
  {
    slug: "student-government",
    icon: Users,
    title: "Student Government",
    description:
      "Lead fellow students, represent class concerns, and help shape a positive campus community.",
    overview:
      "Student leaders plan activities, voice student concerns, and work with faculty to create a respectful and active school environment for everyone.",
    highlights: [
      "Represent classmates and bring concerns to school leaders",
      "Help plan activities, assemblies, and campus initiatives",
      "Develop leadership, public speaking, and organization skills",
    ],
    items: ["Supreme Student Government", "Class Officers", "Grade Level Reps"],
    gallery: [
      { src: "/event-leadership.jpg", alt: "Student leadership summit" },
      { src: "/event-recognition.jpg", alt: "Recognition day ceremony" },
    ],
    color: "text-orange-600",
    image: "/club-government.jpg",
  },
  {
    slug: "community-service",
    icon: Globe,
    title: "Community Service",
    description:
      "Give back through outreach programs, environmental initiatives, and youth-led community projects.",
    overview:
      "Community service clubs connect students with real needs around them — from relief efforts to clean-up drives — while building compassion and civic responsibility.",
    highlights: [
      "Join outreach drives and environmental clean-ups",
      "Partner with local groups and school-wide service projects",
      "Learn empathy, teamwork, and civic responsibility",
    ],
    items: ["Red Cross Youth", "Environmental Club", "Outreach Program"],
    gallery: [
      { src: "/students-events.jpg", alt: "Students at a community event" },
      { src: "/event-foundation.jpg", alt: "School foundation day celebration" },
    ],
    color: "text-teal-600",
    image: "/club-community.jpg",
  },
  {
    slug: "campus-press-media",
    icon: Camera,
    title: "Campus Press & Media",
    description:
      "Tell school stories through journalism, photography, broadcasting, and digital media production.",
    overview:
      "Campus press and media teams document school life, share news with the community, and give students hands-on experience in writing, design, and broadcasting.",
    highlights: [
      "Cover school news, events, and student achievements",
      "Practice writing, photography, design, and broadcasting",
      "Share stories with the school and wider community",
    ],
    items: ["School Newspaper", "Photography Club", "Broadcast Journalism", "Social Media Team"],
    gallery: [
      { src: "/students-events.jpg", alt: "Campus press covering a school event" },
      { src: "/event-recognition.jpg", alt: "Awarding student achievements" },
    ],
    color: "text-rose-600",
    image: "/club-media.jpg",
  },
];

export function getClubBySlug(slug: string) {
  return CLUBS.find((club) => club.slug === slug);
}
