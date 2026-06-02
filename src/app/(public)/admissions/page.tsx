import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, FileText, Calendar, DollarSign } from "lucide-react";

export default function AdmissionsPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <h1 className="text-4xl font-bold mb-4">Admissions</h1>
          <p className="text-blue-200 max-w-2xl">
            Begin your journey at NVIANS. Review our requirements and enrollment process below.
          </p>
          <Button asChild className="mt-6 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold">
            <Link href="/contact">Inquire Now</Link>
          </Button>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Requirements */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Requirements</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Duly accomplished application form",
                    "Original Report Card (Form 138)",
                    "PSA Birth Certificate",
                    "Certificate of Good Moral Character",
                    "2x2 ID photos (4 pieces)",
                    "Medical Certificate",
                    "Baptismal Certificate (if applicable)",
                  ].map((req) => (
                    <li key={req} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Enrollment Process */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-50 p-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Enrollment Process</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {[
                    "Submit application form with complete documents at the Registrar's Office.",
                    "Pass the entrance examination and/or interview.",
                    "Receive acceptance letter and assessment slip.",
                    "Pay tuition and fees at the Cashier's Office.",
                    "Claim your student ID and schedule.",
                    "Attend orientation for new students.",
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-700">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Tuition */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-orange-50 p-2">
                    <DollarSign className="h-5 w-5 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">Tuition Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Tuition fees vary by program and year level. We offer flexible payment schemes.
                </p>
                <div className="space-y-2">
                  {[
                    { level: "Elementary", amount: "Contact Registrar" },
                    { level: "Junior High", amount: "Contact Registrar" },
                    { level: "Senior High", amount: "Contact Registrar" },
                    { level: "College", amount: "Contact Registrar" },
                  ].map((t) => (
                    <div key={t.level} className="flex justify-between text-sm border-b pb-2">
                      <span className="text-gray-700">{t.level}</span>
                      <span className="text-gray-500">{t.amount}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  * Scholarships and financial assistance are available for qualifying students.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
