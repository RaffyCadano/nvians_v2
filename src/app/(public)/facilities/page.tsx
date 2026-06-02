import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, FlaskConical, Library, Dumbbell, Wifi, Building2 } from "lucide-react";

const facilities = [
  {
    icon: Monitor,
    name: "Computer Laboratories",
    color: "text-blue-600",
    bg: "bg-blue-50",
    desc: "4 fully equipped computer labs with modern workstations, high-speed internet, and the latest software suites for all academic programs.",
    features: ["100+ workstations", "High-speed fiber internet", "Latest software", "Air-conditioned"],
  },
  {
    icon: FlaskConical,
    name: "Science Laboratories",
    color: "text-green-600",
    bg: "bg-green-50",
    desc: "Dedicated labs for Biology, Chemistry, and Physics with complete equipment and safety facilities for hands-on learning.",
    features: ["Biology Lab", "Chemistry Lab", "Physics Lab", "Safety equipment"],
  },
  {
    icon: Library,
    name: "Library",
    color: "text-purple-600",
    bg: "bg-purple-50",
    desc: "A comprehensive library with over 10,000 books, digital resources, and quiet study areas for research and reading.",
    features: ["10,000+ books", "Digital catalog", "E-resources", "Study areas"],
  },
  {
    icon: Dumbbell,
    name: "Sports Facilities",
    color: "text-orange-600",
    bg: "bg-orange-50",
    desc: "Multi-purpose gymnasium, outdoor courts, and sports fields supporting basketball, volleyball, swimming, and track & field.",
    features: ["Gymnasium", "Basketball courts", "Volleyball courts", "Athletic field"],
  },
  {
    icon: Wifi,
    name: "Campus Wi-Fi",
    color: "text-teal-600",
    bg: "bg-teal-50",
    desc: "Campus-wide high-speed wireless internet providing students and faculty with seamless connectivity.",
    features: ["Campus-wide coverage", "Fiber-optic backbone", "Secure network"],
  },
  {
    icon: Building2,
    name: "Classrooms",
    color: "text-red-600",
    bg: "bg-red-50",
    desc: "Spacious, well-ventilated classrooms equipped with projectors, whiteboards, and modern teaching aids.",
    features: ["Projectors & screens", "Air-conditioned", "Ergonomic furniture", "CCTV monitored"],
  },
];

export default function FacilitiesPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <h1 className="text-4xl font-bold mb-4">Our Facilities</h1>
          <p className="text-blue-200 max-w-2xl">
            State-of-the-art facilities designed to support academic excellence and student development.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility) => {
              const Icon = facility.icon;
              return (
                <Card key={facility.name} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`inline-flex rounded-xl p-3 ${facility.bg} w-fit mb-2`}>
                      <Icon className={`h-6 w-6 ${facility.color}`} />
                    </div>
                    <CardTitle className="text-lg">{facility.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{facility.desc}</p>
                    <ul className="space-y-1">
                      {facility.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-gray-700">
                          <span className={`h-1.5 w-1.5 rounded-full ${facility.bg.replace("bg-", "bg-").replace("-50", "-400")}`} />
                          {f}
                        </li>
                      ))}
                    </ul>
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
