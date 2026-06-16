import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  FileText,
  Calendar,
  DollarSign,
  GraduationCap,
  Trophy,
  ArrowRight,
} from "lucide-react";

const REQUIREMENTS = [
  { label: "Duly accomplished application form" },
  { label: "Original Report Card (Form 138)" },
  { label: "PSA Birth Certificate" },
  { label: "Certificate of Good Moral Character" },
  { label: "2x2 ID photos (4 pieces)" },
  { label: "Medical Certificate" },
  { label: "Baptismal Certificate (if applicable)" },
  { label: "Valid ID of parent or guardian" },
];

const STEPS = [
  {
    title: "Submit Application",
    desc: "Submit your application form with complete documents at the Registrar's Office.",
  },
  {
    title: "Entrance Exam",
    desc: "Take the entrance examination and/or interview when scheduled.",
  },
  {
    title: "Acceptance Letter",
    desc: "Receive your acceptance letter and assessment slip.",
  },
  {
    title: "Pay Tuition",
    desc: "Pay tuition and fees at the Cashier's Office.",
  },
  {
    title: "Get Student ID",
    desc: "Claim your student ID and class schedule.",
  },
  {
    title: "Attend Orientation",
    desc: "Attend orientation for new students before classes begin.",
  },
];

const PAYMENT_OPTIONS = [
  "Full payment upon enrollment",
  "Quarterly installment plan",
  "Monthly payment scheme",
] as const;

const ADMISSION_NOTES = [
  "Enrollment is open for Junior High (Grades 7–10) and Senior High (Grades 11–12).",
  "Transferees may need additional documents depending on their previous school.",
  "Scholarships and financial assistance are available for qualifying students.",
] as const;
export default function AdmissionsPage() {
  return (
    <div>
      {/* Header */}
      <section className="relative flex min-h-[45vh] items-center overflow-hidden text-white sm:min-h-[42vh] lg:min-h-[40vh]">
        <Image
          src="/admissions-cover.png"
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
          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-medium tracking-wider text-yellow-400 uppercase sm:mb-3 sm:text-sm lg:text-base">
              Enroll Today
            </p>
            <h1 className="mb-3 text-2xl font-bold leading-tight sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
              Admissions
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-blue-200 sm:text-base lg:text-lg">
              Begin your journey at Nueva Vizcaya Institute. Review our requirements and enrollment process below.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
              <Link
                href="/contact"
                className="inline-flex h-11 w-full items-center justify-center rounded-md bg-yellow-500 px-6 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-400 sm:w-auto sm:min-w-[160px]"
              >
                Inquire Now
                <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
              </Link>
              <Link
                href="/programs"
                className="inline-flex h-11 w-full items-center justify-center rounded-md border border-white/60 bg-white/10 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/20 sm:w-auto sm:min-w-[160px]"
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
          <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">How to Enroll</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-500 sm:text-base">
              Review the requirements and follow the enrollment steps below. For questions, visit
              the Registrar&apos;s Office or contact us.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">Requirements</h3>
              </div>
              <p className="mb-4 text-sm text-gray-500">
                Prepare the following documents before submitting your application.
              </p>
              <div className="rounded-xl border bg-gray-50 p-5 sm:p-6">
                <ul className="space-y-3">
                  {REQUIREMENTS.map((req) => (
                    <li key={req.label} className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      {req.label}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-gray-200 pt-4 text-xs leading-relaxed text-gray-500">
                  Bring original copies and photocopies of each document. Incomplete applications
                  may delay processing.
                </p>
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">Enrollment Process</h3>
              </div>
              <p className="mb-4 text-sm text-gray-500">
                Follow these steps from application to your first day of classes.
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
                      <p className="mt-0.5 text-sm leading-relaxed text-gray-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-3xl rounded-xl border p-5 sm:p-6">
            <p className="text-sm font-semibold text-gray-900">Good to Know</p>
            <ul className="mt-3 space-y-2">
              {ADMISSION_NOTES.map((note) => (
                <li key={note} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tuition Information */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <DollarSign className="mx-auto mb-2 h-6 w-6 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Tuition Information</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-gray-500 sm:text-base">
              Tuition fees vary by grade level and program. Flexible payment options are available
              for enrolled families.
            </p>
          </div>

          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border bg-white p-5 text-center sm:p-6">
              <GraduationCap className="mx-auto h-7 w-7 text-blue-600" />
              <p className="mt-3 text-base font-semibold text-gray-900">Junior High School</p>
              <p className="text-xs text-gray-500">Grades 7 – 10</p>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Core subjects and values formation for Grades 7 to 10.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
              >
                Contact Registrar <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="rounded-xl border bg-white p-5 text-center sm:p-6">
              <Trophy className="mx-auto h-7 w-7 text-purple-600" />
              <p className="mt-3 text-base font-semibold text-gray-900">Senior High School</p>
              <p className="text-xs text-gray-500">Grades 11 – 12</p>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Track-based programs for college, work, or entrepreneurship.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-purple-600 hover:underline"
              >
                Contact Registrar <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-3xl rounded-xl border bg-white p-5 sm:p-6">
            <p className="text-sm font-semibold text-gray-900">Payment Options</p>
            <ul className="mt-3 space-y-2">
              {PAYMENT_OPTIONS.map((option) => (
                <li key={option} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                  {option}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-gray-500">
              For exact fees and assessment, please visit the Cashier&apos;s Office or email{" "}
              <a href="mailto:admissions@nvians.edu.ph" className="text-blue-600 hover:underline">
                admissions@nvians.edu.ph
              </a>
              .
            </p>
          </div>

          <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-relaxed text-gray-500">
            Scholarships and financial assistance may be available.{" "}
            <Link href="/contact" className="font-medium text-blue-600 hover:underline">
              Contact us to learn more
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
