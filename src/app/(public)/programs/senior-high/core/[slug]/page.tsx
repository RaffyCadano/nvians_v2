import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SHS_CORE_SUBJECTS, getShsCoreSubjectBySlug } from "../../../shs-core-subjects";

export function generateStaticParams() {
  return SHS_CORE_SUBJECTS.map((subject) => ({ slug: subject.slug }));
}

export default async function ShsCoreSubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const subject = getShsCoreSubjectBySlug(slug);

  if (!subject) {
    notFound();
  }

  const Icon = subject.icon;

  return (
    <div>
      <section className="relative flex min-h-[45vh] items-center overflow-hidden text-white sm:min-h-[42vh] lg:min-h-[40vh]">
        <Image
          src="/senior-high-class.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_40%] sm:object-center"
          aria-hidden
        />
        <div className="absolute inset-0 bg-blue-950/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-transparent to-indigo-900/30" />
        <div className="container relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
          <p className="mb-2 text-xs font-medium tracking-wider text-yellow-400 uppercase sm:mb-3 sm:text-sm lg:text-base">
            Senior High School · Core Subject · Grades 11–12
          </p>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <h1 className="mb-3 max-w-3xl text-2xl font-bold leading-tight sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
            {subject.name}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-blue-200 sm:text-base lg:text-lg">
            {subject.description}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
            <Link
              href="/admissions"
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-yellow-500 px-6 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-400 sm:w-auto sm:min-w-[160px]"
            >
              Apply Now
              <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
            </Link>
            <Link
              href="/programs#senior-high"
              className="inline-flex h-11 w-full items-center justify-center rounded-md border border-white/60 bg-white/10 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/20 sm:w-auto sm:min-w-[160px]"
            >
              View All Core Subjects
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">About This Subject</h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">{subject.overview}</p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border">
              <Image
                src={subject.gallery[0].src}
                alt={subject.gallery[0].alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
            {subject.gallery.map((photo) => (
              <div key={photo.src} className="relative aspect-[4/3] overflow-hidden rounded-xl border">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 400px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border bg-gray-50 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900">What Students Learn</h2>
            <ul className="mt-4 space-y-3">
              {subject.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2 text-sm text-gray-700 sm:text-base">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-500" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-xl border border-purple-100 bg-purple-50/50 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900">Enroll in Senior High</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
              {subject.name} is a core subject required for all Senior High students in Grades 11–12,
              regardless of track. Visit admissions for requirements and enrollment information.
            </p>
            <Link
              href="/admissions"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-purple-700 transition-colors hover:text-purple-800"
            >
              View admissions information
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
