import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, Trophy, Star } from "lucide-react";

const programs = [
  {
    icon: BookOpen,
    level: "Elementary",
    grades: "Grades 1 – 6",
    color: "text-green-600",
    bg: "bg-green-50",
    badge: "bg-green-100 text-green-700",
    description:
      "Our Elementary program builds strong academic foundations in Reading, Mathematics, Science, and Filipino while nurturing values and social skills.",
    subjects: ["English", "Filipino", "Mathematics", "Science", "Araling Panlipunan", "MAPEH", "TLE", "ESP"],
  },
  {
    icon: GraduationCap,
    level: "Junior High School",
    grades: "Grades 7 – 10",
    color: "text-blue-600",
    bg: "bg-blue-50",
    badge: "bg-blue-100 text-blue-700",
    description:
      "Junior High builds on elementary foundations with deeper academic competencies, critical thinking, and exposure to career pathways.",
    subjects: ["English", "Filipino", "Mathematics", "Science", "AP", "EsP", "TLE/EPP", "MAPEH"],
  },
  {
    icon: Trophy,
    level: "Senior High School",
    grades: "Grades 11 – 12",
    color: "text-purple-600",
    bg: "bg-purple-50",
    badge: "bg-purple-100 text-purple-700",
    description:
      "Senior High offers specialized tracks: Academic Track (STEM, ABM, HUMSS), TVL Track, Sports Track, and Arts & Design Track.",
    subjects: ["Core Subjects", "STEM Track", "ABM Track", "HUMSS Track", "TVL Track", "Sports Track"],
  },
  {
    icon: Star,
    level: "College",
    grades: "4-Year Degree Programs",
    color: "text-orange-600",
    bg: "bg-orange-50",
    badge: "bg-orange-100 text-orange-700",
    description:
      "Our college department offers CHED-recognized degree programs in business, education, engineering, and liberal arts.",
    subjects: ["Business Administration", "Teacher Education", "Information Technology", "Engineering", "Hospitality"],
  },
];

export default function ProgramsPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <h1 className="text-4xl font-bold mb-4">Academic Programs</h1>
          <p className="text-blue-200 max-w-2xl">
            From Elementary to College, NVIANS offers comprehensive programs designed for every stage of learning.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4 space-y-10">
          {programs.map((prog) => {
            const Icon = prog.icon;
            return (
              <Card key={prog.level} className="overflow-hidden">
                <CardHeader className={`${prog.bg}`}>
                  <div className="flex items-center gap-4">
                    <div className={`inline-flex rounded-xl p-3 bg-white shadow-sm`}>
                      <Icon className={`h-6 w-6 ${prog.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">{prog.level}</CardTitle>
                      <p className={`text-sm font-medium ${prog.color}`}>{prog.grades}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-600 mb-4 leading-relaxed">{prog.description}</p>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Offered Subjects / Tracks:</p>
                    <div className="flex flex-wrap gap-2">
                      {prog.subjects.map((s) => (
                        <span key={s} className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${prog.badge}`}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
