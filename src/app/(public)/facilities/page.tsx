import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, FlaskConical, Library, Dumbbell, Wifi, Building2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
const facilities = [
  {
    icon: Monitor,
    name: "Computer Laboratories",
    color: "text-blue-600",
    bg: "bg-blue-50",
    image: "/facility-computer.jpg",
    desc: "4 fully equipped computer labs with modern workstations, high-speed internet, and the latest software suites for all academic programs.",
    features: ["100+ workstations", "High-speed fiber internet", "Latest software", "Air-conditioned"],
  },
  {
    icon: FlaskConical,
    name: "Science Laboratories",
    color: "text-green-600",
    bg: "bg-green-50",
    image: "/facility-science.jpg",
    desc: "Dedicated labs for Biology, Chemistry, and Physics with complete equipment and safety facilities for hands-on learning.",
    features: ["Biology Lab", "Chemistry Lab", "Physics Lab", "Safety equipment"],
  },
  {
    icon: Library,
    name: "Library",
    color: "text-purple-600",
    bg: "bg-purple-50",
    image: "/facility-library.jpg",
    desc: "A comprehensive library with over 10,000 books, digital resources, and quiet study areas for research and reading.",
    features: ["10,000+ books", "Digital catalog", "E-resources", "Study areas"],
  },
  {
    icon: Dumbbell,
    name: "Sports Facilities",
    color: "text-orange-600",
    bg: "bg-orange-50",
    image: "/facility-sports.jpg",
    desc: "Multi-purpose gymnasium, outdoor courts, and sports fields supporting basketball, volleyball, swimming, and track & field.",
    features: ["Gymnasium", "Basketball courts", "Volleyball courts", "Athletic field"],
  },
  {
    icon: Wifi,
    name: "Campus Wi-Fi",
    color: "text-teal-600",
    bg: "bg-teal-50",
    image: "/facility-wifi.jpg",
    desc: "Campus-wide high-speed wireless internet providing students and faculty with seamless connectivity.",
    features: ["Campus-wide coverage", "Fiber-optic backbone", "Secure network"],
  },
  {
    icon: Building2,
    name: "Classrooms",
    color: "text-red-600",
    bg: "bg-red-50",
    image: "/facility-classroom.jpg",
    desc: "Spacious, well-ventilated classrooms equipped with projectors, whiteboards, and modern teaching aids.",
    features: ["Projectors & screens", "Air-conditioned", "Ergonomic furniture", "CCTV monitored"],
  },
];

export default function FacilitiesPage() {
  return (
    <div>
      <section className="relative flex min-h-[45vh] items-center overflow-hidden text-white sm:min-h-[42vh] lg:min-h-[40vh]">
        <Image
          src="/facilities-cover.png"
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
            Campus Facilities
          </p>
          <h1 className="mb-3 max-w-3xl text-2xl font-bold leading-tight sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
            Our Facilities
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-blue-200 sm:text-base lg:text-lg">
            State-of-the-art facilities designed to support academic excellence and student development.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
            <Link
              href="#facilities-list"
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-yellow-500 px-6 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-400 sm:w-auto sm:min-w-[160px]"
            >
              Explore Facilities
              <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 w-full items-center justify-center rounded-md border border-white/60 bg-white/10 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/20 sm:w-auto sm:min-w-[160px]"
            >
              Schedule a Visit
            </Link>
          </div>
        </div>
      </section>

      <section id="facilities-list" className="scroll-mt-20 bg-white py-12 sm:py-16">        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
            {facilities.map((facility) => {
              const Icon = facility.icon;
              return (
                <div key={facility.name} className="group overflow-hidden rounded-xl border bg-white transition-all hover:shadow-md">
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={facility.image}
                      alt={facility.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm">
                        <Icon className={`h-4 w-4 ${facility.color}`} />
                      </div>
                      <span className="text-sm font-semibold text-white drop-shadow-sm">{facility.name}</span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <p className="text-sm leading-relaxed text-gray-600">{facility.desc}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {facility.features.map((f) => (
                        <span key={f} className={`rounded-full ${facility.bg} px-2.5 py-1 text-xs font-medium ${facility.color}`}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
