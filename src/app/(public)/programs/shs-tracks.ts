import {
  Atom,
  BarChart3,
  Briefcase,
  Calculator,
  Cog,
  FileText,
  FlaskConical,
  Globe,
  Hammer,
  Heart,
  Home,
  Leaf,
  Lightbulb,
  Medal,
  Monitor,
  Music,
  Palette,
  Scale,
  Users,
  type LucideIcon,
} from "lucide-react";

export type ShsTrackSubject = {
  slug: string;
  name: string;
  icon: LucideIcon;
  description: string;
  overview: string;
  highlights: string[];
  gallery: { src: string; alt: string }[];
};

export type ShsTrack = {
  slug: string;
  name: string;
  fullName: string;
  color: string;
  bg: string;
  badge: string;
  heroImage: string;
  subjects: ShsTrackSubject[];
};

export const SHS_TRACKS: ShsTrack[] = [
  {
    slug: "stem",
    name: "STEM",
    fullName: "Science, Technology, Engineering & Mathematics",
    color: "text-blue-600",
    bg: "bg-blue-50",
    badge: "bg-blue-100 text-blue-700",
    heroImage: "/track-academic.jpg",
    subjects: [
      {
        slug: "pre-calculus-basic-calculus",
        name: "Pre-Calculus & Basic Calculus",
        icon: Calculator,
        description: "Advanced mathematical concepts including limits, derivatives, and integrals.",
        overview:
          "Pre-Calculus and Basic Calculus prepare STEM students for college-level math and science through functions, limits, derivatives, and integrals with practical applications.",
        highlights: [
          "Functions, limits, and continuity",
          "Derivatives and applications",
          "Integrals and area under curves",
          "Foundation for engineering and science degrees",
        ],
        gallery: [
          { src: "/track-academic.jpg", alt: "STEM students in class" },
          { src: "/facility-science.jpg", alt: "Science laboratory" },
        ],
      },
      {
        slug: "general-biology",
        name: "General Biology 1 & 2",
        icon: Leaf,
        description: "In-depth study of cell biology, genetics, evolution, and ecology.",
        overview:
          "General Biology explores life at cellular and organism levels — covering genetics, evolution, ecology, and biodiversity through lectures and lab work.",
        highlights: [
          "Cell structure, genetics, and evolution",
          "Ecology and biodiversity",
          "Laboratory investigations",
          "Preparation for pre-med and life sciences",
        ],
        gallery: [
          { src: "/facility-science.jpg", alt: "Biology laboratory" },
          { src: "/event-science.jpg", alt: "Science fair projects" },
        ],
      },
      {
        slug: "general-chemistry",
        name: "General Chemistry 1 & 2",
        icon: FlaskConical,
        description: "Atomic structure, chemical reactions, stoichiometry, and organic chemistry.",
        overview:
          "General Chemistry builds understanding of matter and reactions — from atomic structure and stoichiometry to organic chemistry with hands-on experiments.",
        highlights: [
          "Atomic structure and periodic trends",
          "Chemical reactions and stoichiometry",
          "Organic chemistry fundamentals",
          "Lab safety and experimental techniques",
        ],
        gallery: [
          { src: "/facility-science.jpg", alt: "Chemistry laboratory" },
          { src: "/event-science.jpg", alt: "Student science research" },
        ],
      },
      {
        slug: "general-physics",
        name: "General Physics 1 & 2",
        icon: Atom,
        description: "Mechanics, thermodynamics, waves, electricity, and modern physics.",
        overview:
          "General Physics covers mechanics, thermodynamics, waves, electricity, and modern physics — connecting theory to real-world engineering and technology problems.",
        highlights: [
          "Mechanics, forces, and motion",
          "Thermodynamics and waves",
          "Electricity and magnetism",
          "Problem-solving for STEM careers",
        ],
        gallery: [
          { src: "/track-academic.jpg", alt: "Physics class discussion" },
          { src: "/facility-science.jpg", alt: "Science lab equipment" },
        ],
      },
      {
        slug: "research-capstone-project",
        name: "Research / Capstone Project",
        icon: Lightbulb,
        description: "Conduct original scientific research and present findings.",
        overview:
          "The STEM capstone guides students through original research — from proposal and methodology to data collection, analysis, and presentation of findings.",
        highlights: [
          "Research proposal and literature review",
          "Data collection and analysis",
          "Written report and oral defense",
          "Preparation for college research work",
        ],
        gallery: [
          { src: "/event-science.jpg", alt: "Science research presentation" },
          { src: "/senior-high-class.jpg", alt: "Senior high students" },
        ],
      },
    ],
  },
  {
    slug: "abm",
    name: "ABM",
    fullName: "Accountancy, Business & Management",
    color: "text-green-600",
    bg: "bg-green-50",
    badge: "bg-green-100 text-green-700",
    heroImage: "/senior-high-class.jpg",
    subjects: [
      {
        slug: "applied-economics",
        name: "Applied Economics",
        icon: BarChart3,
        description: "Economic principles applied to business and everyday decision-making.",
        overview:
          "Applied Economics connects economic theory to business and daily life — covering supply and demand, market structures, and policy impacts on decisions.",
        highlights: [
          "Supply, demand, and market behavior",
          "Business and consumer decision-making",
          "Philippine and global economic issues",
          "Foundation for business and finance paths",
        ],
        gallery: [
          { src: "/senior-high-class.jpg", alt: "ABM class discussion" },
          { src: "/track-academic.jpg", alt: "Students in academic session" },
        ],
      },
      {
        slug: "business-ethics-social-responsibility",
        name: "Business Ethics & Social Responsibility",
        icon: Scale,
        description: "Ethical frameworks and corporate social responsibility in business.",
        overview:
          "This subject examines ethical decision-making in business and the role of corporate social responsibility in building trustworthy organizations.",
        highlights: [
          "Ethical frameworks for business decisions",
          "Corporate social responsibility practices",
          "Case studies on real-world dilemmas",
          "Preparation for leadership and governance roles",
        ],
        gallery: [
          { src: "/senior-high-class.jpg", alt: "Business ethics class" },
          { src: "/event-leadership.jpg", alt: "Leadership summit" },
        ],
      },
      {
        slug: "fundamentals-abm",
        name: "Fundamentals of ABM 1 & 2",
        icon: Briefcase,
        description: "Introduction to accounting, financial statements, and business operations.",
        overview:
          "Fundamentals of ABM introduces accounting principles, financial statements, and basic business operations — the core toolkit for accountancy and management tracks.",
        highlights: [
          "Accounting cycle and bookkeeping basics",
          "Financial statements and analysis",
          "Business operations and documentation",
          "Gateway to accountancy and management courses",
        ],
        gallery: [
          { src: "/senior-high-class.jpg", alt: "ABM fundamentals class" },
          { src: "/facility-computer.jpg", alt: "Computer lab for business tools" },
        ],
      },
      {
        slug: "business-math",
        name: "Business Math",
        icon: Calculator,
        description: "Mathematical tools for business: interest, annuities, and financial analysis.",
        overview:
          "Business Math applies mathematics to finance and operations — including interest, annuities, investments, and data analysis for business settings.",
        highlights: [
          "Simple and compound interest",
          "Annuities and loan calculations",
          "Investment and break-even analysis",
          "Practical tools for business careers",
        ],
        gallery: [
          { src: "/senior-high-class.jpg", alt: "Business math class" },
          { src: "/track-academic.jpg", alt: "Academic track students" },
        ],
      },
      {
        slug: "organization-management",
        name: "Organization & Management",
        icon: Users,
        description: "Principles of planning, organizing, leading, and controlling organizations.",
        overview:
          "Organization and Management covers planning, organizing, leading, and controlling — giving students a practical introduction to how businesses and teams operate.",
        highlights: [
          "Management functions and leadership styles",
          "Organizational structure and teamwork",
          "Planning and decision-making",
          "Preparation for management and entrepreneurship",
        ],
        gallery: [
          { src: "/event-leadership.jpg", alt: "Leadership training" },
          { src: "/senior-high-class.jpg", alt: "Management class" },
        ],
      },
    ],
  },
  {
    slug: "humss",
    name: "HUMSS",
    fullName: "Humanities & Social Sciences",
    color: "text-amber-600",
    bg: "bg-amber-50",
    badge: "bg-amber-100 text-amber-700",
    heroImage: "/senior-high-class.jpg",
    subjects: [
      {
        slug: "creative-writing",
        name: "Creative Writing / Malikhaing Pagsulat",
        icon: FileText,
        description: "Develops creative expression through fiction, poetry, and literary non-fiction.",
        overview:
          "Creative Writing develops voice and craft through fiction, poetry, and literary non-fiction — in English and Filipino — building skills for communication and the arts.",
        highlights: [
          "Fiction, poetry, and creative non-fiction",
          "Workshops and peer feedback",
          "Writing in English and Filipino",
          "Foundation for journalism and liberal arts",
        ],
        gallery: [
          { src: "/track-arts.jpg", alt: "Creative writing workshop" },
          { src: "/event-cultural.jpg", alt: "Cultural arts program" },
        ],
      },
      {
        slug: "introduction-world-religions",
        name: "Introduction to World Religions",
        icon: Globe,
        description: "Comparative study of major world religions and belief systems.",
        overview:
          "Introduction to World Religions offers a comparative look at major faiths and belief systems — fostering respect, understanding, and critical reflection.",
        highlights: [
          "Major world religions and traditions",
          "Comparative beliefs and practices",
          "Respectful dialogue and critical analysis",
          "Supports HUMSS and pre-law pathways",
        ],
        gallery: [
          { src: "/senior-high-class.jpg", alt: "Humanities class discussion" },
          { src: "/about-school.jpg", alt: "School community" },
        ],
      },
      {
        slug: "philippine-politics-governance",
        name: "Philippine Politics & Governance",
        icon: Scale,
        description: "Studies Philippine political systems, governance structures, and civic participation.",
        overview:
          "Philippine Politics and Governance examines institutions, policy, and civic life — preparing students to understand and participate in democratic society.",
        highlights: [
          "Philippine government and constitution",
          "Elections, policy, and public service",
          "Civic participation and rights",
          "Preparation for political science and pre-law",
        ],
        gallery: [
          { src: "/senior-high-class.jpg", alt: "Politics and governance class" },
          { src: "/event-leadership.jpg", alt: "Student leadership activity" },
        ],
      },
      {
        slug: "disciplines-ideas-social-sciences",
        name: "Disciplines & Ideas in Social Sciences",
        icon: Lightbulb,
        description: "Explores sociology, psychology, anthropology, and political science frameworks.",
        overview:
          "This subject introduces key frameworks from sociology, psychology, anthropology, and political science — tools for analyzing people, culture, and society.",
        highlights: [
          "Core concepts from social science disciplines",
          "Research and inquiry in the social sciences",
          "Analysis of social issues and behavior",
          "Foundation for college liberal arts programs",
        ],
        gallery: [
          { src: "/senior-high-class.jpg", alt: "Social sciences class" },
          { src: "/students-events.jpg", alt: "Community school event" },
        ],
      },
      {
        slug: "community-engagement-social-research",
        name: "Community Engagement & Social Research",
        icon: Users,
        description: "Hands-on research and community-based projects addressing social issues.",
        overview:
          "Community Engagement and Social Research combines field work with research methods — connecting classroom learning to real community needs and social issues.",
        highlights: [
          "Community-based research projects",
          "Interview, survey, and field methods",
          "Service learning and civic action",
          "Capstone-style social research experience",
        ],
        gallery: [
          { src: "/students-events.jpg", alt: "Community engagement activity" },
          { src: "/club-community.jpg", alt: "Community service club" },
        ],
      },
    ],
  },
  {
    slug: "tvl",
    name: "TVL",
    fullName: "Technical-Vocational Livelihood",
    color: "text-orange-600",
    bg: "bg-orange-50",
    badge: "bg-orange-100 text-orange-700",
    heroImage: "/track-tvl.jpg",
    subjects: [
      {
        slug: "ict-computer-systems-servicing",
        name: "ICT (Computer Systems Servicing)",
        icon: Monitor,
        description: "Computer hardware, networking, and system troubleshooting with TESDA certification.",
        overview:
          "ICT Computer Systems Servicing trains students in hardware assembly, networking, and troubleshooting — with pathways toward TESDA certification and IT careers.",
        highlights: [
          "Computer hardware and assembly",
          "Networking and system configuration",
          "Troubleshooting and maintenance",
          "TESDA certification pathway",
        ],
        gallery: [
          { src: "/facility-computer.jpg", alt: "Computer systems lab" },
          { src: "/track-tvl.jpg", alt: "TVL students at work" },
        ],
      },
      {
        slug: "home-economics-cookery",
        name: "Home Economics (Cookery / Bread & Pastry)",
        icon: Home,
        description: "Culinary arts, food preparation, and kitchen management skills.",
        overview:
          "Home Economics in cookery and bread & pastry develops kitchen skills, food safety, and culinary techniques for hospitality and food service careers.",
        highlights: [
          "Cookery and pastry fundamentals",
          "Food safety and sanitation",
          "Kitchen management and plating",
          "Preparation for culinary and hospitality jobs",
        ],
        gallery: [
          { src: "/track-tvl.jpg", alt: "Culinary training" },
          { src: "/students-events.jpg", alt: "School food event" },
        ],
      },
      {
        slug: "industrial-arts-electrical-welding",
        name: "Industrial Arts (Electrical / Welding)",
        icon: Hammer,
        description: "Hands-on training in electrical installation, welding, and construction.",
        overview:
          "Industrial Arts provides practical training in electrical installation, welding, and construction trades — building job-ready skills for technical careers.",
        highlights: [
          "Electrical wiring and installation basics",
          "Welding and fabrication techniques",
          "Workplace safety and tool handling",
          "Pathway to skilled trades employment",
        ],
        gallery: [
          { src: "/track-tvl.jpg", alt: "Industrial arts workshop" },
          { src: "/facility-sports.jpg", alt: "Hands-on training facility" },
        ],
      },
      {
        slug: "agri-fishery-arts",
        name: "Agri-Fishery Arts",
        icon: Leaf,
        description: "Crop production, aquaculture, and sustainable agricultural practices.",
        overview:
          "Agri-Fishery Arts introduces crop production, aquaculture, and sustainable farming — connecting students to agriculture and fisheries livelihoods.",
        highlights: [
          "Crop production and farm management",
          "Aquaculture and fisheries basics",
          "Sustainable agricultural practices",
          "Careers in agribusiness and food systems",
        ],
        gallery: [
          { src: "/track-tvl.jpg", alt: "Agri-fishery training" },
          { src: "/club-community.jpg", alt: "Environmental outreach" },
        ],
      },
      {
        slug: "entrepreneurship",
        name: "Entrepreneurship",
        icon: Briefcase,
        description: "Business plan development, marketing, and venture creation.",
        overview:
          "Entrepreneurship guides students through business planning, marketing, and venture creation — whether they pursue employment or start their own enterprise.",
        highlights: [
          "Business plan writing and pitching",
          "Marketing, costing, and operations",
          "Small business and social enterprise ideas",
          "Skills for self-employment and innovation",
        ],
        gallery: [
          { src: "/senior-high-class.jpg", alt: "Entrepreneurship class" },
          { src: "/event-leadership.jpg", alt: "Student business presentation" },
        ],
      },
    ],
  },
  {
    slug: "sports",
    name: "Sports",
    fullName: "Sports Track",
    color: "text-red-600",
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-700",
    heroImage: "/facility-sports.jpg",
    subjects: [
      {
        slug: "individual-dual-sports",
        name: "Individual & Dual Sports",
        icon: Medal,
        description: "Competitive training in athletics, swimming, martial arts, and racket sports.",
        overview:
          "Individual and Dual Sports develops technique and competition readiness in athletics, swimming, martial arts, racket sports, and related disciplines.",
        highlights: [
          "Technique training for individual sports",
          "Competition rules and scoring",
          "Fitness and conditioning programs",
          "Pathway to varsity and league play",
        ],
        gallery: [
          { src: "/facility-sports.jpg", alt: "Sports training facility" },
          { src: "/event-sports.jpg", alt: "Sports fest competition" },
        ],
      },
      {
        slug: "team-sports",
        name: "Team Sports",
        icon: Users,
        description: "Basketball, volleyball, football, and other team-based sports development.",
        overview:
          "Team Sports builds cooperation, strategy, and athletic skill in basketball, volleyball, football, and other team disciplines through drills and game play.",
        highlights: [
          "Basketball, volleyball, and team game skills",
          "Team strategy and communication",
          "Coaching drills and scrimmages",
          "Preparation for intramurals and leagues",
        ],
        gallery: [
          { src: "/event-sports.jpg", alt: "Team sports competition" },
          { src: "/club-sports.jpg", alt: "School sports teams" },
        ],
      },
      {
        slug: "sports-officiating-coaching",
        name: "Sports Officiating & Coaching",
        icon: Cog,
        description: "Rules, officiating techniques, and coaching methodologies for various sports.",
        overview:
          "Sports Officiating and Coaching teaches rules, officiating signals, and coaching methods — preparing students for leadership roles in athletics.",
        highlights: [
          "Officiating rules and procedures",
          "Coaching fundamentals and practice planning",
          "Game management and fair play",
          "Careers in coaching and sports administration",
        ],
        gallery: [
          { src: "/facility-sports.jpg", alt: "Sports coaching session" },
          { src: "/event-sports.jpg", alt: "School athletic event" },
        ],
      },
      {
        slug: "fitness-sports-science",
        name: "Fitness & Sports Science",
        icon: Heart,
        description: "Exercise physiology, nutrition, injury prevention, and sports psychology.",
        overview:
          "Fitness and Sports Science covers exercise physiology, nutrition, injury prevention, and sports psychology — the science behind athletic performance and wellness.",
        highlights: [
          "Exercise physiology and training principles",
          "Nutrition for athletes and active lifestyles",
          "Injury prevention and recovery basics",
          "Sports psychology and performance mindset",
        ],
        gallery: [
          { src: "/facility-sports.jpg", alt: "Fitness training" },
          { src: "/club-sports.jpg", alt: "Student athletes" },
        ],
      },
    ],
  },
  {
    slug: "arts-design",
    name: "Arts & Design",
    fullName: "Arts & Design Track",
    color: "text-pink-600",
    bg: "bg-pink-50",
    badge: "bg-pink-100 text-pink-700",
    heroImage: "/track-arts.jpg",
    subjects: [
      {
        slug: "visual-arts",
        name: "Visual Arts (Drawing & Painting)",
        icon: Palette,
        description: "Fundamental techniques in drawing, painting, and visual composition.",
        overview:
          "Visual Arts develops drawing, painting, and composition skills — building a portfolio foundation for design, fine arts, and creative industries.",
        highlights: [
          "Drawing, shading, and perspective",
          "Painting techniques and color theory",
          "Composition and portfolio development",
          "Preparation for design and fine arts programs",
        ],
        gallery: [
          { src: "/track-arts.jpg", alt: "Visual arts studio" },
          { src: "/club-arts.jpg", alt: "Arts club activities" },
        ],
      },
      {
        slug: "media-arts-photography-film",
        name: "Media Arts (Photography & Film)",
        icon: Monitor,
        description: "Digital photography, videography, editing, and multimedia production.",
        overview:
          "Media Arts covers photography, videography, editing, and multimedia production — skills for broadcasting, content creation, and digital media careers.",
        highlights: [
          "Digital photography and lighting",
          "Videography and video editing",
          "Multimedia and short-form content",
          "Pathway to media and communication fields",
        ],
        gallery: [
          { src: "/club-media.jpg", alt: "Media arts production" },
          { src: "/track-arts.jpg", alt: "Creative media class" },
        ],
      },
      {
        slug: "performing-arts-dance-theater",
        name: "Performing Arts (Dance & Theater)",
        icon: Music,
        description: "Stage performance, choreography, acting, and theatrical production.",
        overview:
          "Performing Arts trains students in dance, theater, choreography, and stage production — building confidence and craft for performance careers.",
        highlights: [
          "Acting, voice, and stage presence",
          "Dance and choreography fundamentals",
          "Theater production and rehearsal work",
          "Performances in school and community events",
        ],
        gallery: [
          { src: "/club-arts.jpg", alt: "Performing arts rehearsal" },
          { src: "/event-cultural.jpg", alt: "Cultural night performance" },
        ],
      },
      {
        slug: "creative-industries",
        name: "Creative Industries",
        icon: Lightbulb,
        description: "Design thinking, branding, and creative entrepreneurship opportunities.",
        overview:
          "Creative Industries connects art and design to business — exploring branding, design thinking, and entrepreneurship in the creative economy.",
        highlights: [
          "Design thinking and creative problem-solving",
          "Branding and visual identity basics",
          "Creative entrepreneurship and freelancing",
          "Careers in design, media, and creative services",
        ],
        gallery: [
          { src: "/track-arts.jpg", alt: "Creative industries class" },
          { src: "/club-media.jpg", alt: "Student creative project" },
        ],
      },
    ],
  },
];

export function getTrackBySlug(trackSlug: string) {
  return SHS_TRACKS.find((track) => track.slug === trackSlug);
}

export function getTrackSubject(trackSlug: string, subjectSlug: string) {
  const track = getTrackBySlug(trackSlug);
  if (!track) return null;

  const subject = track.subjects.find((item) => item.slug === subjectSlug);
  if (!subject) return null;

  return { track, subject };
}

export function getAllTrackSubjectParams() {
  return SHS_TRACKS.flatMap((track) =>
    track.subjects.map((subject) => ({
      trackSlug: track.slug,
      subjectSlug: subject.slug,
    })),
  );
}
