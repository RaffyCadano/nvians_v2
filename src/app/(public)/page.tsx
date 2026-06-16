import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedStats } from "@/components/public/animated-stats";
import {
  ArrowRight,
  GraduationCap,
  Users,
  Trophy,
  ChevronRight,
  BookOpen,
  Palette,
  Wrench,
  Medal,
  Check,
} from "lucide-react";

const WHY_ITEMS = [
  {
    title: "Experienced Faculty",
    desc: "Our teachers are highly qualified professionals committed to student success.",
  },
  {
    title: "Modern Facilities",
    desc: "State-of-the-art labs, libraries, and sports facilities to support holistic development.",
  },
  {
    title: "Holistic Education",
    desc: "We balance academics with character formation, arts, and sports.",
  },
  {
    title: "Safe Environment",
    desc: "A safe, inclusive, and nurturing campus for all students.",
  },
] as const;

const PROGRAMS = [
  {
    level: "Junior High School",
    grades: "Grades 7–10",
    desc: "Builds strong foundations in language, math, science, and the arts while developing study habits and critical thinking.",
    highlights: ["English, Filipino, Math & Science", "MAPEH, TLE, and values education", "Guidance and career exploration"],
    icon: GraduationCap,
    color: "text-blue-600",
    bg: "bg-blue-50",
    badge: "bg-blue-100 text-blue-700",
    dot: "bg-blue-600",
    image: "/junior-high-class.jpg",
    imageAlt: "Junior high school students learning in class at NVIANS",
  },
  {
    level: "Senior High School",
    grades: "Grades 11–12",
    desc: "Specialized tracks prepare students for college, employment, entrepreneurship, or further technical training.",
    highlights: ["Core senior high subjects", "Track-based electives", "Work immersion & capstone projects"],
    icon: Trophy,
    color: "text-purple-600",
    bg: "bg-purple-50",
    badge: "bg-purple-100 text-purple-700",
    dot: "bg-purple-600",
    image: "/students-events.jpg",
    imageAlt: "NVIANS senior high students at a school event",
  },
] as const;

const SHS_TRACKS = [
  { name: "Academic", desc: "STEM, ABM, HUMSS", icon: BookOpen },
  { name: "TVL", desc: "Technical-vocational livelihood", icon: Wrench },
  { name: "Sports", desc: "Athletics & physical education", icon: Medal },
  { name: "Arts & Design", desc: "Visual & performing arts", icon: Palette },
] as const;

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[520px] items-center overflow-hidden text-white sm:min-h-[620px] lg:min-h-[720px] xl:min-h-[80vh]">
        <Image
          src="/cover.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden
        />
        <div className="absolute inset-0 bg-blue-950/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-blue-900/20 to-blue-950/50" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.07]" aria-hidden />

        <div className="container relative z-10 mx-auto max-w-7xl px-4 py-16 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="mb-4 border-blue-600 bg-blue-700/50 text-blue-100"
            >
              Excellence in Education
            </Badge>
            <h1 className="mb-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
              Nurturing Minds,{" "}
              <span className="text-yellow-400">Shaping Futures</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-blue-100 sm:text-lg lg:text-xl">
              NVIANS is a premier educational institution providing quality junior and senior high
              school education (Grades 7–12), empowering students to reach their full potential.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Button
                asChild
                size="lg"
                className="h-12 w-full bg-yellow-500 font-semibold text-gray-900 hover:bg-yellow-400 sm:w-auto"
              >
                <Link href="/admissions">
                  Apply for Admission
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 w-full border-white/70 bg-white/5 text-white hover:bg-white/15 hover:text-white sm:w-auto"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <AnimatedStats />

      {/* Programs */}
      <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center sm:mb-12">
            <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              Academic Programs
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Junior and senior high school programs (Grades 7–12) aligned with the K–12 curriculum,
              designed to develop well-rounded, college- and career-ready graduates.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {PROGRAMS.map((prog) => {
              const Icon = prog.icon;
              return (
                <Card key={prog.level} className="h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
                  <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
                    <Image
                      src={prog.image}
                      alt={prog.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="space-y-3 px-6 pt-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                      <div className={`inline-flex w-fit rounded-lg p-3 ${prog.bg}`}>
                        <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${prog.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg sm:text-xl">{prog.level}</CardTitle>
                        <span
                          className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${prog.badge}`}
                        >
                          {prog.grades}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 px-6 pb-6">
                    <p className="text-sm leading-relaxed text-gray-600 sm:text-base">{prog.desc}</p>
                    <ul className="space-y-2">
                      {prog.highlights.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-gray-600">
                          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${prog.dot}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/programs"
                      className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                    >
                      Learn more <ChevronRight className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-10 sm:mt-12">
            <h3 className="mb-4 text-center text-lg font-semibold text-gray-900 sm:mb-6 sm:text-xl">
              Senior High Tracks
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {SHS_TRACKS.map((track) => {
                const Icon = track.icon;
                return (
                  <div
                    key={track.name}
                    className="flex items-start gap-3 rounded-xl border bg-white p-4 sm:p-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50">
                      <Icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">{track.name}</p>
                      <p className="mt-0.5 text-xs leading-snug text-gray-500 sm:text-sm">
                        {track.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-10 text-center sm:mt-12">
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/programs">
                View all programs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why NVIANS */}
      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div className="order-2 lg:order-1">
              <h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                Why Choose NVIANS?
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
                {WHY_ITEMS.map((item) => (
                  <div key={item.title} className="flex gap-3 sm:gap-4">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 sm:h-7 sm:w-7">
                      <Check className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" strokeWidth={3} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-gray-600 sm:text-base">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-2xl shadow-md">
                <Image
                  src="/students-events.jpg"
                  alt="NVIANS students participating in a school event"
                  width={640}
                  height={480}
                  className="aspect-[4/3] w-full object-cover sm:aspect-auto sm:min-h-64 lg:min-h-72"
                  priority={false}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-900/90 via-blue-900/50 to-transparent px-5 pb-5 pt-16 sm:px-6 sm:pb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white sm:text-xl">5,000+ Students</p>
                      <p className="text-sm text-blue-100">Thriving in our community</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 py-16 text-white">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Journey at NVIANS</h2>
          <p className="text-blue-200 mb-8 max-w-xl mx-auto">
            Join thousands of students who have found their path to success at NVIANS. Enrollment is now open.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold">
              <Link href="/admissions">Enroll Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
