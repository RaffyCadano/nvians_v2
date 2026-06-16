import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
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
      <section className="relative flex min-h-[40vh] items-center overflow-hidden text-white sm:min-h-[45vh]">
        <Image
          src="/admissions-cover.png"
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

      {/* Requirements & Process */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Requirements */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Requirements</h2>
              </div>
              <p className="mb-5 text-sm text-gray-500">
                Prepare the following documents for your application.
              </p>
              <div className="rounded-xl border bg-gray-50 p-5 sm:p-6">
                <ul className="space-y-3">
                  {REQUIREMENTS.map((req) => (
                    <li key={req.label} className="flex items-center gap-3 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                      {req.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Enrollment Process */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Calendar className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Enrollment Process</h2>
              </div>
              <p className="mb-5 text-sm text-gray-500">
                Follow these steps to complete your enrollment.
              </p>
              <div className="rounded-xl border bg-gray-50 p-5 sm:p-6">
                {STEPS.map((step, i) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      {i < STEPS.length - 1 && <div className="w-px flex-1 bg-green-200" />}
                    </div>
                    <div className={i < STEPS.length - 1 ? "pb-5" : ""}>
                      <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                      <p className="mt-0.5 text-sm text-gray-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tuition Information */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-8">
            <DollarSign className="mx-auto h-6 w-6 text-orange-600 mb-2" />
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Tuition Information</h2>
            <p className="mt-1 text-sm text-gray-500">
              Tuition fees vary by program and year level. We offer flexible payment schemes.
            </p>
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border bg-white p-6 text-center transition-shadow hover:shadow-md">
              <GraduationCap className="mx-auto h-8 w-8 text-blue-600" />
              <p className="mt-3 text-base font-semibold text-gray-900">Junior High School</p>
              <p className="text-xs text-gray-500">Grades 7 – 10</p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
              >
                Contact Registrar <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="rounded-xl border bg-white p-6 text-center transition-shadow hover:shadow-md">
              <Trophy className="mx-auto h-8 w-8 text-purple-600" />
              <p className="mt-3 text-base font-semibold text-gray-900">Senior High School</p>
              <p className="text-xs text-gray-500">Grades 11 – 12</p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-purple-600 hover:underline"
              >
                Contact Registrar <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
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
