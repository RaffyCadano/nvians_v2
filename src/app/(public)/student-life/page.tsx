import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CLUBS } from "./clubs";

export default function StudentLifePage() {
  return (
    <div>
      <section className="relative flex min-h-[45vh] items-center overflow-hidden text-white sm:min-h-[42vh] lg:min-h-[40vh]">
        <Image
          src="/student-life-cover.png"
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
            Campus Life
          </p>
          <h1 className="mb-3 max-w-3xl text-2xl font-bold leading-tight sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
            Student Life
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-blue-200 sm:text-base lg:text-lg">
            Life at Nueva Vizcaya Institute goes beyond the classroom. Explore clubs, organizations, and events that make school life vibrant.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
            <Link
              href="#clubs"
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-yellow-500 px-6 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-400 sm:w-auto sm:min-w-[160px]"
            >
              Clubs & Organizations
              <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
            </Link>
            <Link
              href="#events"
              className="inline-flex h-11 w-full items-center justify-center rounded-md border border-white/60 bg-white/10 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/20 sm:w-auto sm:min-w-[160px]"
            >
              Annual Events
            </Link>
          </div>
        </div>
      </section>

      <section id="clubs" className="scroll-mt-20 bg-white py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Clubs & Organizations</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CLUBS.map((club) => {
              const Icon = club.icon;
              return (
                <Link key={club.slug} href={`/student-life/${club.slug}`} className="group block h-full">
                  <Card className="flex h-full flex-col overflow-hidden border py-0 transition-colors">
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <Image
                        src={club.image}
                        alt={club.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm">
                          <Icon className={`h-4 w-4 ${club.color}`} />
                        </div>
                        <span className="text-sm font-semibold text-white drop-shadow-sm">
                          {club.title}
                        </span>
                      </div>
                    </div>
                    <CardContent className="flex flex-1 flex-col p-5">
                      <p className="text-sm leading-relaxed text-gray-600">{club.description}</p>
                      <span className="mt-auto inline-flex items-center gap-1 border-t border-gray-100 pt-4 text-sm font-semibold text-blue-600 transition-colors group-hover:text-blue-700">
                        Learn more
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="events" className="scroll-mt-20 bg-gray-50 py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">Annual Events</h2>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {[
              { name: "Foundation Day", month: "January", desc: "Annual celebration of the school's founding anniversary.", image: "/event-foundation.jpg" },
              { name: "Science Fair", month: "February", desc: "Showcase of student research and innovation projects.", image: "/event-science.jpg" },
              { name: "Sports Fest", month: "March", desc: "Inter-class competitions in various sports disciplines.", image: "/event-sports.jpg" },
              { name: "Cultural Night", month: "May", desc: "Celebration of Filipino arts and cultural heritage.", image: "/event-cultural.jpg" },
              { name: "Leadership Summit", month: "July", desc: "Student leadership training and development program.", image: "/event-leadership.jpg" },
              { name: "Recognition Day", month: "March", desc: "Awarding of academic and non-academic achievements.", image: "/event-recognition.jpg" },
            ].map((event) => (
              <div key={event.name} className="group overflow-hidden rounded-xl border bg-white">
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                      {event.month}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900">{event.name}</h3>
                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
