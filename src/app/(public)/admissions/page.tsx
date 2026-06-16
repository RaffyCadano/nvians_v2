import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  CheckCircle,
  FileText,
  Calendar,
  DollarSign,
  ClipboardList,
  PenLine,
  Mail,
  CreditCard,
  IdCard,
  Users,
  GraduationCap,
  Trophy,
  Award,
  ArrowRight,
} from "lucide-react";

const REQUIREMENTS = [
  { label: "Duly accomplished application form", icon: ClipboardList },
  { label: "Original Report Card (Form 138)", icon: FileText },
  { label: "PSA Birth Certificate", icon: FileText },
  { label: "Certificate of Good Moral Character", icon: Award },
  { label: "2x2 ID photos (4 pieces)", icon: IdCard },
  { label: "Medical Certificate", icon: FileText },
  { label: "Baptismal Certificate (if applicable)", icon: FileText },
];

const STEPS = [
  {
    title: "Submit Application",
    desc: "Submit application form with complete documents at the Registrar's Office.",
    icon: PenLine,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Entrance Exam",
    desc: "Pass the entrance examination and/or interview.",
    icon: ClipboardList,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Acceptance Letter",
    desc: "Receive acceptance letter and assessment slip.",
    icon: Mail,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Pay Tuition",
    desc: "Pay tuition and fees at the Cashier's Office.",
    icon: CreditCard,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Get Student ID",
    desc: "Claim your student ID and class schedule.",
    icon: IdCard,
    color: "bg-pink-100 text-pink-600",
  },
  {
    title: "Attend Orientation",
    desc: "Attend orientation for new students.",
    icon: Users,
    color: "bg-teal-100 text-teal-600",
  },
];

export default function AdmissionsPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 py-12 text-white sm:py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold mb-3 sm:text-4xl lg:text-5xl sm:mb-4">Admissions</h1>
            <p className="text-blue-200 text-sm sm:text-base lg:text-lg max-w-2xl">
              Begin your journey at Nueva Vizcaya Institute. Review our requirements and enrollment process below.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-md bg-yellow-500 px-6 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-400 w-full sm:w-auto"
              >
                Inquire Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/programs"
                className="inline-flex h-11 items-center justify-center rounded-md border border-white/60 bg-white/10 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/20 w-full sm:w-auto"
              >
                View Programs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Requirements</h2>
          </div>
          <p className="mb-6 text-sm text-gray-500 sm:text-base">
            Prepare the following documents for your application.
          </p>

          <ul className="space-y-3">
            {REQUIREMENTS.map((req) => (
              <li key={req.label} className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                {req.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Enrollment Process */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Enrollment Process</h2>
          </div>
          <p className="mb-8 text-sm text-gray-500 sm:text-base">
            Follow these steps to complete your enrollment.
          </p>
          <div>
            {STEPS.map((step, i) => (
              <div key={step.title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  {i < STEPS.length - 1 && <div className="w-px flex-1 bg-green-200" />}
                </div>
                <div className={i < STEPS.length - 1 ? "pb-6" : ""}>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{step.title}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tuition Information */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
              <DollarSign className="h-5 w-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Tuition Information</h2>
          </div>
          <p className="mb-6 text-sm text-gray-500 sm:text-base">
            Tuition fees vary by program and year level. We offer flexible payment schemes.
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Junior High School</p>
                  <p className="text-xs text-gray-500">Grades 7 – 10</p>
                </div>
              </div>
              <Link href="/contact" className="text-sm font-medium text-blue-600 hover:underline">
                Contact Registrar
              </Link>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Senior High School</p>
                  <p className="text-xs text-gray-500">Grades 11 – 12</p>
                </div>
              </div>
              <Link href="/contact" className="text-sm font-medium text-purple-600 hover:underline">
                Contact Registrar
              </Link>
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            * Scholarships and financial assistance are available for qualifying students.{" "}
            <Link href="/contact" className="font-medium text-blue-600 hover:underline">
              Learn more
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
