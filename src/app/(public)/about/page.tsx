import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Target, Eye, Heart } from "lucide-react";
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
          className="object-cover object-[center_70%]"
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
            <div className="grid grid-cols-2 gap-4">
              <div className="relative overflow-hidden rounded-2xl aspect-[3/4]">
                <Image
                  src="/about-school.jpg"
                  alt="Nueva Vizcaya Institute school building"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mt-8">
                <Image
                  src="/students-events.jpg"
                  alt="Nueva Vizcaya Institute students and faculty"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-blue-900/50" />
                <div className="absolute inset-0 flex items-center justify-center text-center">
                  <div>
                    <p className="text-5xl font-black text-white sm:text-6xl">50+</p>
                    <p className="text-sm font-semibold text-blue-100 mt-2 sm:text-lg">Years of Excellence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Target,
                title: "Mission",
                color: "text-blue-600",
                bg: "bg-blue-50",
                content:
                  "To provide holistic, quality education that empowers students academically, morally, and socially — preparing them to be competent, ethical, and productive members of society.",
              },
              {
                icon: Eye,
                title: "Vision",
                color: "text-purple-600",
                bg: "bg-purple-50",
                content:
                  "To be a leading educational institution recognized for academic excellence, character development, and community engagement — producing globally competitive graduates.",
              },
              {
                icon: Heart,
                title: "Core Values",
                color: "text-red-600",
                bg: "bg-red-50",
                content: null,
                values: ["Excellence", "Integrity", "Service", "Respect", "Innovation", "Teamwork"],
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="h-full">
                  <CardContent className="pt-6">
                    <div className={`inline-flex rounded-lg p-3 ${item.bg} mb-4`}>
                      <Icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    {item.content ? (
                      <p className="text-gray-600 leading-relaxed text-sm">{item.content}</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {item.values?.map((v) => (
                          <span key={v} className={`inline-flex items-center rounded-full ${item.bg} ${item.color} px-3 py-1 text-xs font-medium`}>
                            {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
