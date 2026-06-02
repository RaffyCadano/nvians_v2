import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Target, Eye, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-16">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <h1 className="text-4xl font-bold mb-4">About NVIANS</h1>
          <p className="text-blue-200 max-w-2xl">
            Discover our story, values, and the vision that drives us to deliver excellence in education.
          </p>
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
                  NVIANS was founded over five decades ago with a simple yet powerful vision: to provide
                  quality education that is accessible, relevant, and transformative.
                </p>
                <p>
                  What started as a small elementary school has grown into a full-cycle educational
                  institution serving thousands of students from Kinder through College.
                </p>
                <p>
                  Over the years, our school has produced graduates who have gone on to become leaders
                  in various fields — business, medicine, engineering, education, and public service.
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-gray-50 p-10 text-center min-h-64 flex items-center justify-center">
              <div>
                <p className="text-6xl font-black text-blue-700">50+</p>
                <p className="text-xl font-semibold text-gray-700 mt-2">Years of Excellence</p>
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
