import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  GraduationCap,
  Users,
  Trophy,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto max-w-7xl px-4 py-24 sm:py-32 relative">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 bg-blue-700/50 text-blue-100 border-blue-600">
              Excellence in Education
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Nurturing Minds,{" "}
              <span className="text-yellow-400">Shaping Futures</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
              NVIANS is a premier educational institution providing quality junior and senior high
              school education (Grades 7–12), empowering students to reach their full potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold">
                <Link href="/admissions">
                  Apply for Admission <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-white py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: "5,000+", label: "Students Enrolled" },
              { value: "200+", label: "Faculty Members" },
              { value: "50+", label: "Years of Excellence" },
              { value: "98%", label: "Graduate Employment" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-blue-700">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Academic Programs</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Junior and senior high school programs (Grades 7–12) designed to develop well-rounded,
              college- and career-ready graduates.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            {[
              {
                level: "Junior High School",
                desc: "Grades 7–10. Developing critical thinking and core academic competencies.",
                icon: GraduationCap,
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                level: "Senior High School",
                desc: "Grades 11–12. Specialized tracks: Academic, TVL, Sports, and Arts.",
                icon: Trophy,
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
            ].map((prog) => {
              const Icon = prog.icon;
              return (
                <Card key={prog.level} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`inline-flex rounded-lg p-3 ${prog.bg} w-fit mb-2`}>
                      <Icon className={`h-5 w-5 ${prog.color}`} />
                    </div>
                    <CardTitle className="text-lg">{prog.level}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{prog.desc}</p>
                    <Link
                      href="/programs"
                      className="text-sm font-medium text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      Learn more <ChevronRight className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why NVIANS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose NVIANS?</h2>
              <div className="space-y-4">
                {[
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
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600">
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex items-center justify-center min-h-64">
              <div className="text-center">
                <Users className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <p className="text-2xl font-bold text-gray-900">5,000+ Students</p>
                <p className="text-gray-500 mt-1">Thriving in our community</p>
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
