import { Target, Eye, Heart, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
const CORE_VALUES = [
  {
    name: "Excellence",
    desc: "Pursuing the highest standards in academics, conduct, and personal growth.",
  },
  {
    name: "Integrity",
    desc: "Acting with honesty, fairness, and accountability in all we do.",
  },
  {
    name: "Service",
    desc: "Giving back to the school, community, and those in need.",
  },
  {
    name: "Respect",
    desc: "Valuing every person, embracing diversity, and honoring responsibility.",
  },
  {
    name: "Innovation",
    desc: "Encouraging creativity, critical thinking, and lifelong learning.",
  },
  {
    name: "Teamwork",
    desc: "Working together to achieve shared goals and support one another.",
  },
] as const;

export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <section className="relative flex min-h-[50vh] items-center overflow-hidden text-white sm:min-h-[45vh] lg:min-h-[40vh]">
        <Image
          src="/about-cover.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_40%] sm:object-center"
          aria-hidden
        />
        <div className="absolute inset-0 bg-blue-950/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-indigo-900/30" />
        <div className="container relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
          <p className="mb-2 text-xs font-medium tracking-wider text-yellow-400 uppercase sm:mb-3 sm:text-sm lg:text-base">
            Our Story
          </p>
          <h1 className="mb-3 max-w-3xl text-2xl font-bold leading-tight sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
            About Nueva Vizcaya Institute
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-blue-200 sm:text-base lg:text-lg">
            Discover our story, values, and the vision that drives us to deliver excellence in education.
          </p>
          <div className="mt-6 grid grid-cols-3 divide-x divide-white/20 border-t border-white/10 pt-6 sm:mt-8 sm:gap-4 sm:pt-8 md:flex md:items-center md:divide-x-0 md:gap-8 md:border-t-0 md:pt-0">
            <div className="px-2 text-center md:px-0 md:text-left">
              <p className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">50+</p>
              <p className="mt-0.5 text-[10px] leading-snug text-blue-300 sm:text-xs lg:text-sm">
                Years of Excellence
              </p>
            </div>
            <div className="hidden h-10 w-px shrink-0 bg-white/20 md:block" aria-hidden />
            <div className="px-2 text-center md:px-0 md:text-left">
              <p className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">10K+</p>
              <p className="mt-0.5 text-[10px] leading-snug text-blue-300 sm:text-xs lg:text-sm">
                Alumni Worldwide
              </p>
            </div>
            <div className="hidden h-10 w-px shrink-0 bg-white/20 md:block" aria-hidden />
            <div className="px-2 text-center md:px-0 md:text-left">
              <p className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">100%</p>
              <p className="mt-0.5 text-[10px] leading-snug text-blue-300 sm:text-xs lg:text-sm">
                Dedicated Faculty
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
            <Link
              href="#our-history"
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-yellow-500 px-6 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-400 sm:w-auto sm:min-w-[160px]"
            >
              Our History
              <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
            </Link>
            <Link
              href="#mission-vision"
              className="inline-flex h-11 w-full items-center justify-center rounded-md border border-white/60 bg-white/10 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/20 sm:w-auto sm:min-w-[160px]"
            >
              Mission & Vision
            </Link>
          </div>
        </div>
      </section>

      {/* History */}
      <section id="our-history" className="scroll-mt-20 bg-white py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our History</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Nueva Vizcaya Institute was founded over five decades ago with a simple yet powerful vision: to provide
                  quality education that is accessible, relevant, and transformative.
                </p>
                <p>
                  What started as a small community school has grown into a junior and senior high
                  institution serving students in Grades 7 through 12.
                </p>
                <p>
                  Over the years, our school has produced graduates who have gone on to become leaders
                  in various fields — business, medicine, engineering, education, and public service.
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl aspect-[4/3] sm:aspect-[16/9]">
              <Image
                src="/about-school.jpg"
                alt="Nueva Vizcaya Institute school building"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-blue-900/40" />
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div>
                  <p className="text-5xl font-black text-white sm:text-6xl">50+</p>
                  <p className="text-sm font-semibold text-blue-100 mt-2 sm:text-lg">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section id="mission-vision" className="scroll-mt-20 bg-gray-50 py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-7xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">What We Stand For</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
              Our mission, vision, and core values guide every decision we make — from the classroom
              to the wider community we serve.
            </p>
          </div>

          <div className="mx-auto grid max-w-7xl gap-5 sm:gap-6">
            <div className="rounded-xl border bg-white p-5 sm:p-6">
              <div className="mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Mission</h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                To provide holistic, quality education that empowers students academically, morally,
                and socially — preparing them to be competent, ethical, and productive members of society.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                We nurture well-rounded learners through strong instruction, values formation, and
                meaningful student activities from Junior to Senior High School.
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 sm:p-6">
              <div className="mb-3 flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">Vision</h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                To be a leading educational institution recognized for academic excellence, character
                development, and community engagement — producing globally competitive graduates.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                We aim to be a trusted school in Nueva Vizcaya where families choose to build their
                children&apos;s future with confidence and pride.
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-bold text-gray-900">Core Values</h3>
              </div>
              <ul className="divide-y divide-gray-100">
                {CORE_VALUES.map((value) => (
                  <li key={value.name} className="py-3 first:pt-0 last:pb-0">
                    <p className="text-sm font-semibold text-gray-900">{value.name}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{value.desc}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 text-center sm:p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-blue-600">
                Our Motto
              </p>
              <p className="mt-2 text-base font-semibold italic text-gray-900 sm:text-lg">
                &ldquo;The home of the achievers, the proud and the champions!&rdquo;
              </p>
              <p className="mt-2 text-sm text-gray-600">
                This motto reflects the spirit of every Nueva Vizcaya Institute student — driven,
                disciplined, and ready to lead.
              </p>
            </div>
          </div>
        </div>
      </section>    
      </div>
  );
}
