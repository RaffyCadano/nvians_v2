import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CLUBS, getClubBySlug } from "../clubs";

export function generateStaticParams() {
  return CLUBS.map((club) => ({ slug: club.slug }));
}

export default async function ClubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const club = getClubBySlug(slug);

  if (!club) {
    notFound();
  }

  return (
    <div>
      <section className="relative flex min-h-[45vh] items-center overflow-hidden text-white sm:min-h-[42vh] lg:min-h-[40vh]">
        <Image
          src={club.image}
          alt={club.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_40%] sm:object-center"
        />
        <div className="absolute inset-0 bg-blue-950/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-indigo-900/30" />
        <div className="container relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
          <p className="mb-2 text-xs font-medium tracking-wider text-yellow-400 uppercase sm:mb-3 sm:text-sm lg:text-base">
            Clubs & Organizations
          </p>
          <h1 className="mb-3 max-w-3xl text-2xl font-bold leading-tight sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
            {club.title}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-blue-200 sm:text-base lg:text-lg">
            {club.description}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
            <Link
              href="/contact"
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-yellow-500 px-6 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-400 sm:w-auto sm:min-w-[160px]"
            >
              Inquire About Joining
              <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
            </Link>
            <Link
              href="/student-life#clubs"
              className="inline-flex h-11 w-full items-center justify-center rounded-md border border-white/60 bg-white/10 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/20 sm:w-auto sm:min-w-[160px]"
            >
              View All Clubs
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">About This Club</h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">{club.overview}</p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border">
              <Image
                src={club.image}
                alt={`${club.title} at Nueva Vizcaya Institute`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
            {club.gallery.map((photo) => (
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
            <h2 className="text-lg font-bold text-gray-900">What You&apos;ll Gain</h2>
            <ul className="mt-4 space-y-3">
              {club.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2 text-sm text-gray-700 sm:text-base">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-500" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-xl border p-5 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900">Groups & Activities</h2>
            <p className="mt-2 text-sm text-gray-600">
              Students can join one or more of the following groups under {club.title}:
            </p>
            <ul className="mt-4 space-y-2">
              {club.items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700 sm:text-base">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/50 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900">How to Join</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
              Membership is open to interested students during club registration at the start of the
              school year. Ask your class adviser or visit the student affairs office for schedules
              and requirements.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
            >
              Contact us to inquire
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
