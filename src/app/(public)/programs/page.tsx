import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { JHS_SUBJECTS } from "./jhs-subjects";
import { SHS_CORE_SUBJECTS } from "./shs-core-subjects";
import { SHS_TRACKS } from "./shs-tracks";
import { GraduationCap, Trophy, ArrowRight } from "lucide-react";

export default function ProgramsPage() {
  return (
    <div>
      {/* Header */}
      <section className="relative flex min-h-[45vh] items-center overflow-hidden text-white sm:min-h-[42vh] lg:min-h-[40vh]">
        <Image
          src="/programs-cover.png"
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
          <p className="mb-2 text-xs font-medium tracking-wider text-yellow-400 uppercase sm:mb-3 sm:text-sm lg:text-base">
            Grades 7–12
          </p>
          <h1 className="mb-3 max-w-3xl text-2xl font-bold leading-tight sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
            Academic Programs
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-blue-200 sm:text-base lg:text-lg">
            Junior and senior high school programs for Grades 7–12, aligned with the K–12 curriculum.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
            <Link
              href="#junior-high"
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-yellow-500 px-6 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-400 sm:w-auto sm:min-w-[160px]"
            >
              Junior High School
              <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
            </Link>
            <Link
              href="#senior-high"
              className="inline-flex h-11 w-full items-center justify-center rounded-md border border-white/60 bg-white/10 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/20 sm:w-auto sm:min-w-[160px]"
            >
              Senior High School
            </Link>
          </div>
        </div>
      </section>

      {/* Junior High School */}
      <section id="junior-high" className="scroll-mt-20 bg-gray-50 py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 sm:mb-10">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Junior High School</h2>
                <p className="text-sm font-medium text-blue-600">Grades 7 – 10</p>
              </div>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Junior High develops critical thinking, core academic competencies, and exposure to career pathways
              through a well-rounded curriculum spanning eight learning areas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {JHS_SUBJECTS.map((subj) => {
              const Icon = subj.icon;
              return (
                <Link
                  key={subj.slug}
                  href={`/programs/junior-high/${subj.slug}`}
                  className="group block h-full"
                >
                  <Card className="flex h-full flex-col border bg-white transition-all hover:border-blue-200 hover:shadow-md">
                    <CardContent className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 transition-colors group-hover:bg-blue-100">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="mt-3 text-sm font-semibold text-gray-900">{subj.name}</h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-gray-500 sm:text-sm">{subj.description}</p>
                      <span className="mt-auto inline-flex items-center gap-1 border-t border-gray-100 pt-4 text-sm font-semibold text-blue-600 transition-colors group-hover:text-blue-700">
                        Learn more
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Senior High School */}
      <section id="senior-high" className="scroll-mt-20 bg-white py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 sm:mb-10">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Senior High School</h2>
                <p className="text-sm font-medium text-purple-600">Grades 11 – 12</p>
              </div>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Senior High offers specialized tracks preparing students for college, employment, entrepreneurship,
              and middle-level skills development through core and applied subjects.
            </p>
          </div>

          {/* Core Subjects */}
          <div className="mb-10 sm:mb-14">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl">Core Subjects</h3>
            <p className="mb-6 text-sm text-gray-500 sm:text-base">
              Required subjects taken by all Senior High students regardless of track.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {SHS_CORE_SUBJECTS.map((subj) => {
                const Icon = subj.icon;
                return (
                  <Link
                    key={subj.slug}
                    href={`/programs/senior-high/core/${subj.slug}`}
                    className="group block h-full"
                  >
                    <div className="flex h-full flex-col items-start gap-3 rounded-xl border bg-gray-50 p-4 transition-colors hover:border-purple-200 hover:bg-purple-50">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                        <Icon className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">{subj.name}</p>
                        <p className="mt-0.5 text-xs leading-snug text-gray-500">{subj.description}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 transition-colors group-hover:text-purple-700 sm:text-sm">
                        Learn more
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Specialized Tracks */}
          <div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl">Specialized Tracks</h3>
            <p className="mb-6 text-sm text-gray-500 sm:text-base">
              Choose a track that aligns with your interests, strengths, and career goals.
            </p>
            <div className="space-y-6">
              {SHS_TRACKS.map((track) => (
                <Card key={track.slug} className="overflow-hidden border">
                  <CardHeader className={`${track.bg} py-5 sm:py-6`}>
                    <div>
                      <CardTitle className="text-lg text-gray-900 sm:text-xl">
                        <span className={`font-bold ${track.color}`}>{track.name}</span>
                        <span className="ml-2 text-gray-700">— {track.fullName}</span>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                      {track.subjects.map((subj) => {
                        const Icon = subj.icon;
                        return (
                          <Link
                            key={subj.slug}
                            href={`/programs/senior-high/tracks/${track.slug}/${subj.slug}`}
                            className="group block h-full"
                          >
                            <div className="flex h-full flex-col items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50">
                              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${track.bg}`}>
                                <Icon className={`h-4 w-4 ${track.color}`} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900">{subj.name}</p>
                                <p className="mt-0.5 text-xs leading-snug text-gray-500">{subj.description}</p>
                              </div>
                              <span className={`inline-flex items-center gap-1 text-xs font-semibold ${track.color} sm:text-sm`}>
                                Learn more
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
