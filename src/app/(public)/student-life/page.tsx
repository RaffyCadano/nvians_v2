import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Music, Dumbbell, BookMarked, Globe, Camera } from "lucide-react";
import Image from "next/image";

export default function StudentLifePage() {
  return (
    <div>
      <section className="relative flex min-h-[40vh] items-center overflow-hidden text-white sm:min-h-[45vh]">
        <Image
          src="/student-life-cover.png"
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
          <h1 className="text-3xl font-bold mb-3 sm:text-4xl lg:text-5xl sm:mb-4">Student Life</h1>
          <p className="text-blue-200 max-w-2xl text-sm sm:text-base lg:text-lg">
            Life at Nueva Vizcaya Institute goes beyond the classroom. Explore clubs, organizations, and events that make school life vibrant.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Clubs & Organizations</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: BookMarked, title: "Academic Clubs", items: ["Math Club", "Science Society", "English Club", "Debate Team"], color: "text-blue-600", bg: "bg-blue-50", image: "/club-academic.jpg" },
              { icon: Music, title: "Arts & Culture", items: ["Choir", "Dance Troupe", "Theater Guild", "Art Club"], color: "text-purple-600", bg: "bg-purple-50", image: "/club-arts.jpg" },
              { icon: Dumbbell, title: "Sports Organizations", items: ["Basketball Team", "Volleyball Team", "Swimming Club", "Athletics"], color: "text-green-600", bg: "bg-green-50", image: "/club-sports.jpg" },
              { icon: Users, title: "Student Government", items: ["Supreme Student Government", "Class Officers", "Grade Level Reps"], color: "text-orange-600", bg: "bg-orange-50", image: "/club-government.jpg" },
              { icon: Globe, title: "Community Service", items: ["Red Cross Youth", "Environmental Club", "Outreach Program"], color: "text-teal-600", bg: "bg-teal-50", image: "/club-community.jpg" },
              { icon: Camera, title: "Campus Press & Media", items: ["School Newspaper", "Photography Club", "Broadcast Journalism", "Social Media Team"], color: "text-rose-600", bg: "bg-rose-50", image: "/club-media.jpg" },
            ].map((club) => {
              const Icon = club.icon;
              return (
                <Card key={club.title} className="group overflow-hidden border py-0">
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
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm`}>
                        <Icon className={`h-4 w-4 ${club.color}`} />
                      </div>
                      <span className="text-sm font-semibold text-white drop-shadow-sm">{club.title}</span>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <ul className="space-y-2">
                      {club.items.map((item) => (
                        <li key={item} className="text-sm text-gray-600">• {item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 sm:text-3xl">Annual Events</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
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
