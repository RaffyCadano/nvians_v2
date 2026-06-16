import { Target, Eye, Heart } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <section className="relative flex min-h-[40vh] items-center overflow-hidden text-white sm:min-h-[45vh]">
        <Image
          src="/about-cover.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden
        />
        <div className="absolute inset-0 bg-blue-950/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-indigo-900/30" />
        <div className="container relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="mb-3 text-sm font-medium tracking-wider text-yellow-400 uppercase sm:text-base">Our Story</p>
          <h1 className="text-3xl font-bold mb-3 sm:text-4xl lg:text-5xl sm:mb-4">About Nueva Vizcaya Institute</h1>
          <p className="text-blue-200 max-w-2xl text-sm sm:text-base lg:text-lg">
            Discover our story, values, and the vision that drives us to deliver excellence in education.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm sm:gap-8 sm:text-base">
            <div>
              <p className="text-2xl font-bold text-white sm:text-3xl">50+</p>
              <p className="text-blue-300 text-xs sm:text-sm">Years of Excellence</p>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div>
              <p className="text-2xl font-bold text-white sm:text-3xl">10K+</p>
              <p className="text-blue-300 text-xs sm:text-sm">Alumni Worldwide</p>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div>
              <p className="text-2xl font-bold text-white sm:text-3xl">100%</p>
              <p className="text-blue-300 text-xs sm:text-sm">Dedicated Faculty</p>
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 bg-white">
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
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Target className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">Mission</h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                To provide holistic, quality education that empowers students academically, morally, and socially — preparing them to be competent, ethical, and productive members of society.
              </p>
            </div>

            <div className="h-px bg-gray-200" />

            <div>
              <div className="flex items-center gap-3 mb-3">
                <Eye className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">Vision</h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                To be a leading educational institution recognized for academic excellence, character development, and community engagement — producing globally competitive graduates.
              </p>
            </div>

            <div className="h-px bg-gray-200" />

            <div>
              <div className="flex items-center gap-3 mb-3">
                <Heart className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">Core Values</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Excellence", "Integrity", "Service", "Respect", "Innovation", "Teamwork"].map((v) => (
                  <span key={v} className="rounded-full bg-white border px-4 py-1.5 text-sm font-medium text-gray-700">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
