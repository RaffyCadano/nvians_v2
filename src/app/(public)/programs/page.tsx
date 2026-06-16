import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import {
  GraduationCap,
  Trophy,
  BookOpen,
  Languages,
  Calculator,
  FlaskConical,
  Globe,
  Heart,
  Wrench,
  Music,
  Atom,
  BarChart3,
  Users,
  Cog,
  Medal,
  Palette,
  FileText,
  Scale,
  Lightbulb,
  Briefcase,
  Leaf,
  Monitor,
  Home,
  Hammer,
} from "lucide-react";

const JHS_SUBJECTS = [
  {
    name: "English",
    icon: BookOpen,
    description:
      "Develops reading comprehension, writing, grammar, and oral communication skills through literature and composition.",
  },
  {
    name: "Filipino",
    icon: Languages,
    description:
      "Strengthens Filipino language proficiency through panitikan, gramatika, and creative expression.",
  },
  {
    name: "Mathematics",
    icon: Calculator,
    description:
      "Covers algebra, geometry, statistics, and problem-solving to build strong quantitative reasoning.",
  },
  {
    name: "Science",
    icon: FlaskConical,
    description:
      "Explores Earth science, biology, chemistry, and physics with hands-on laboratory activities.",
  },
  {
    name: "Araling Panlipunan (AP)",
    icon: Globe,
    description:
      "Studies Philippine and world history, geography, economics, and governance for civic awareness.",
  },
  {
    name: "Edukasyon sa Pagpapakatao (EsP)",
    icon: Heart,
    description:
      "Develops moral character, ethical decision-making, and values formation for responsible citizenship.",
  },
  {
    name: "Technology & Livelihood Education (TLE)",
    icon: Wrench,
    description:
      "Introduces practical skills in ICT, home economics, agriculture, and industrial arts.",
  },
  {
    name: "MAPEH",
    icon: Music,
    description:
      "Integrates Music, Arts, Physical Education, and Health for well-rounded personal development.",
  },
];

const SHS_CORE = [
  {
    name: "Oral Communication",
    icon: Users,
    description:
      "Builds effective speaking, listening, and presentation skills for academic and professional settings.",
  },
  {
    name: "Reading & Writing Skills",
    icon: BookOpen,
    description:
      "Enhances critical reading and academic writing through various text types and rhetorical strategies.",
  },
  {
    name: "Komunikasyon at Pananaliksik",
    icon: Languages,
    description:
      "Develops Filipino communication skills and introduces research methodologies in the Filipino language.",
  },
  {
    name: "General Mathematics",
    icon: Calculator,
    description:
      "Covers functions, business math, logic, and statistics for real-world problem solving.",
  },
  {
    name: "Earth & Life Science",
    icon: Leaf,
    description:
      "Explores geology, ecology, genetics, and biodiversity to understand our natural world.",
  },
  {
    name: "Physical Science",
    icon: Atom,
    description:
      "Introduces fundamental concepts in chemistry and physics with practical applications.",
  },
  {
    name: "Personal Development",
    icon: Heart,
    description:
      "Guides self-awareness, emotional intelligence, and goal setting for adolescent growth.",
  },
  {
    name: "Understanding Culture, Society & Politics",
    icon: Globe,
    description:
      "Examines cultural diversity, social structures, and political systems in Philippine and global contexts.",
  },
  {
    name: "Contemporary Philippine Arts",
    icon: Palette,
    description:
      "Appreciates Philippine art forms across regions and explores creative expression.",
  },
  {
    name: "Media & Information Literacy",
    icon: Monitor,
    description:
      "Develops critical evaluation of media content and responsible use of information technology.",
  },
  {
    name: "Physical Education & Health",
    icon: Medal,
    description:
      "Promotes active lifestyles, fitness, and wellness through sports and health education.",
  },
];

const SHS_TRACKS = [
  {
    name: "STEM",
    fullName: "Science, Technology, Engineering & Mathematics",
    color: "text-blue-600",
    bg: "bg-blue-50",
    badge: "bg-blue-100 text-blue-700",
    subjects: [
      { name: "Pre-Calculus & Basic Calculus", icon: Calculator, description: "Advanced mathematical concepts including limits, derivatives, and integrals." },
      { name: "General Biology 1 & 2", icon: Leaf, description: "In-depth study of cell biology, genetics, evolution, and ecology." },
      { name: "General Chemistry 1 & 2", icon: FlaskConical, description: "Atomic structure, chemical reactions, stoichiometry, and organic chemistry." },
      { name: "General Physics 1 & 2", icon: Atom, description: "Mechanics, thermodynamics, waves, electricity, and modern physics." },
      { name: "Research / Capstone Project", icon: Lightbulb, description: "Conduct original scientific research and present findings." },
    ],
  },
  {
    name: "ABM",
    fullName: "Accountancy, Business & Management",
    color: "text-green-600",
    bg: "bg-green-50",
    badge: "bg-green-100 text-green-700",
    subjects: [
      { name: "Applied Economics", icon: BarChart3, description: "Economic principles applied to business and everyday decision-making." },
      { name: "Business Ethics & Social Responsibility", icon: Scale, description: "Ethical frameworks and corporate social responsibility in business." },
      { name: "Fundamentals of ABM 1 & 2", icon: Briefcase, description: "Introduction to accounting, financial statements, and business operations." },
      { name: "Business Math", icon: Calculator, description: "Mathematical tools for business: interest, annuities, and financial analysis." },
      { name: "Organization & Management", icon: Users, description: "Principles of planning, organizing, leading, and controlling organizations." },
    ],
  },
  {
    name: "HUMSS",
    fullName: "Humanities & Social Sciences",
    color: "text-amber-600",
    bg: "bg-amber-50",
    badge: "bg-amber-100 text-amber-700",
    subjects: [
      { name: "Creative Writing / Malikhaing Pagsulat", icon: FileText, description: "Develops creative expression through fiction, poetry, and literary non-fiction." },
      { name: "Introduction to World Religions", icon: Globe, description: "Comparative study of major world religions and belief systems." },
      { name: "Philippine Politics & Governance", icon: Scale, description: "Studies Philippine political systems, governance structures, and civic participation." },
      { name: "Disciplines & Ideas in Social Sciences", icon: Lightbulb, description: "Explores sociology, psychology, anthropology, and political science frameworks." },
      { name: "Community Engagement & Social Research", icon: Users, description: "Hands-on research and community-based projects addressing social issues." },
    ],
  },
  {
    name: "TVL",
    fullName: "Technical-Vocational Livelihood",
    color: "text-orange-600",
    bg: "bg-orange-50",
    badge: "bg-orange-100 text-orange-700",
    subjects: [
      { name: "ICT (Computer Systems Servicing)", icon: Monitor, description: "Computer hardware, networking, and system troubleshooting with TESDA certification." },
      { name: "Home Economics (Cookery / Bread & Pastry)", icon: Home, description: "Culinary arts, food preparation, and kitchen management skills." },
      { name: "Industrial Arts (Electrical / Welding)", icon: Hammer, description: "Hands-on training in electrical installation, welding, and construction." },
      { name: "Agri-Fishery Arts", icon: Leaf, description: "Crop production, aquaculture, and sustainable agricultural practices." },
      { name: "Entrepreneurship", icon: Briefcase, description: "Business plan development, marketing, and venture creation." },
    ],
  },
  {
    name: "Sports",
    fullName: "Sports Track",
    color: "text-red-600",
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-700",
    subjects: [
      { name: "Individual & Dual Sports", icon: Medal, description: "Competitive training in athletics, swimming, martial arts, and racket sports." },
      { name: "Team Sports", icon: Users, description: "Basketball, volleyball, football, and other team-based sports development." },
      { name: "Sports Officiating & Coaching", icon: Cog, description: "Rules, officiating techniques, and coaching methodologies for various sports." },
      { name: "Fitness & Sports Science", icon: Heart, description: "Exercise physiology, nutrition, injury prevention, and sports psychology." },
    ],
  },
  {
    name: "Arts & Design",
    fullName: "Arts & Design Track",
    color: "text-pink-600",
    bg: "bg-pink-50",
    badge: "bg-pink-100 text-pink-700",
    subjects: [
      { name: "Visual Arts (Drawing & Painting)", icon: Palette, description: "Fundamental techniques in drawing, painting, and visual composition." },
      { name: "Media Arts (Photography & Film)", icon: Monitor, description: "Digital photography, videography, editing, and multimedia production." },
      { name: "Performing Arts (Dance & Theater)", icon: Music, description: "Stage performance, choreography, acting, and theatrical production." },
      { name: "Creative Industries", icon: Lightbulb, description: "Design thinking, branding, and creative entrepreneurship opportunities." },
    ],
  },
];

export default function ProgramsPage() {
  return (
    <div>
      {/* Header */}
      <section className="relative flex min-h-[40vh] items-center overflow-hidden text-white sm:min-h-[45vh]">
        <Image
          src="/programs-cover.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%]"
          aria-hidden
        />
        <div className="absolute inset-0 bg-blue-950/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-indigo-900/30" />
        <div className="container relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="text-3xl font-bold mb-3 sm:text-4xl lg:text-5xl sm:mb-4">Academic Programs</h1>
          <p className="text-blue-200 max-w-2xl text-sm sm:text-base lg:text-lg">
            Junior and senior high school programs for Grades 7–12, aligned with the K–12 curriculum.
          </p>
        </div>
      </section>

      {/* Junior High School */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Junior High School</h2>
                <p className="text-sm font-medium text-blue-600">Grades 7 – 10</p>
              </div>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Junior High develops critical thinking, core academic competencies, and exposure to career pathways
              through a well-rounded curriculum spanning eight learning areas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
            {JHS_SUBJECTS.map((subj) => {
              const Icon = subj.icon;
              return (
                <Card key={subj.name} className="group border bg-white transition-all hover:border-blue-200 hover:shadow-md">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 transition-colors group-hover:bg-blue-100">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-gray-900">{subj.name}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-gray-500 sm:text-sm">{subj.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Senior High School */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Senior High School</h2>
                <p className="text-sm font-medium text-purple-600">Grades 11 – 12</p>
              </div>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Senior High offers specialized tracks preparing students for college, employment, entrepreneurship,
              and middle-level skills development through core and applied subjects.
            </p>
          </div>

          {/* Core Subjects */}
          <div className="mb-10 sm:mb-14">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl">Core Subjects</h3>
            <p className="mb-6 text-sm text-gray-500 sm:text-base">
              Required subjects taken by all Senior High students regardless of track.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
              {SHS_CORE.map((subj) => {
                const Icon = subj.icon;
                return (
                  <div key={subj.name} className="flex items-start gap-3 rounded-xl border bg-gray-50 p-4 transition-colors hover:bg-purple-50 hover:border-purple-200">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                      <Icon className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">{subj.name}</p>
                      <p className="mt-0.5 text-xs leading-snug text-gray-500">{subj.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Specialized Tracks */}
          <div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl">Specialized Tracks</h3>
            <p className="mb-6 text-sm text-gray-500 sm:text-base">
              Choose a track that aligns with your interests, strengths, and career goals.
            </p>
            <div className="space-y-6">
              {SHS_TRACKS.map((track) => (
                <Card key={track.name} className="overflow-hidden border">
                  <CardHeader className={`${track.bg} py-5 sm:py-6`}>
                    <div>
                      <CardTitle className="text-lg text-gray-900 sm:text-xl">
                        <span className={`font-bold ${track.color}`}>{track.name}</span>
                        <span className="ml-2 text-gray-700">— {track.fullName}</span>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
                      {track.subjects.map((subj) => {
                        const Icon = subj.icon;
                        return (
                          <div key={subj.name} className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${track.bg}`}>
                              <Icon className={`h-4 w-4 ${track.color}`} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900">{subj.name}</p>
                              <p className="mt-0.5 text-xs leading-snug text-gray-500">{subj.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
