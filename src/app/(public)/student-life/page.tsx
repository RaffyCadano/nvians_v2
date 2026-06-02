import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Music, Dumbbell, BookMarked, Globe } from "lucide-react";

export default function StudentLifePage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <h1 className="text-4xl font-bold mb-4">Student Life</h1>
          <p className="text-blue-200 max-w-2xl">
            Life at NVIANS goes beyond the classroom. Explore clubs, organizations, and events that make school life vibrant.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Clubs & Organizations</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: BookMarked, title: "Academic Clubs", items: ["Math Club", "Science Society", "English Club", "Debate Team"], color: "text-blue-600", bg: "bg-blue-50" },
              { icon: Music, title: "Arts & Culture", items: ["Choir", "Dance Troupe", "Theater Guild", "Art Club"], color: "text-purple-600", bg: "bg-purple-50" },
              { icon: Dumbbell, title: "Sports Organizations", items: ["Basketball Team", "Volleyball Team", "Swimming Club", "Athletics"], color: "text-green-600", bg: "bg-green-50" },
              { icon: Users, title: "Student Government", items: ["Supreme Student Government", "Class Officers", "Grade Level Reps"], color: "text-orange-600", bg: "bg-orange-50" },
              { icon: Globe, title: "Community Service", items: ["Red Cross Youth", "Environmental Club", "Outreach Program"], color: "text-teal-600", bg: "bg-teal-50" },
            ].map((club) => {
              const Icon = club.icon;
              return (
                <Card key={club.title}>
                  <CardHeader>
                    <div className={`inline-flex rounded-lg p-2 ${club.bg} w-fit mb-2`}>
                      <Icon className={`h-5 w-5 ${club.color}`} />
                    </div>
                    <CardTitle className="text-base">{club.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
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

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Annual Events</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Foundation Day", month: "January", desc: "Annual celebration of the school's founding anniversary." },
              { name: "Science Fair", month: "February", desc: "Showcase of student research and innovation projects." },
              { name: "Sports Fest", month: "March", desc: "Inter-class competitions in various sports disciplines." },
              { name: "Cultural Night", month: "May", desc: "Celebration of Filipino arts and cultural heritage." },
              { name: "Leadership Summit", month: "July", desc: "Student leadership training and development program." },
              { name: "Recognition Day", month: "March", desc: "Awarding of academic and non-academic achievements." },
            ].map((event) => (
              <Card key={event.name}>
                <CardContent className="pt-4">
                  <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">{event.month}</span>
                  <h3 className="font-semibold text-gray-900 mt-1">{event.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{event.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
