import Image from "next/image";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <section className="relative flex flex-1 items-center overflow-hidden text-white">
      <Image
        src="/login-cover.png"
        alt=""
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-blue-900/75" />

      <div className="container relative mx-auto max-w-md px-4 py-12 sm:py-16">
        <div className="mb-8 rounded-xl border border-white/20 bg-white/10 px-6 py-6 text-center backdrop-blur-sm sm:px-8">
          <Image
            src="/school-logo.png"
            alt="Nueva Vizcaya Institute"
            width={56}
            height={56}
            className="mx-auto mb-4 h-14 w-auto"
          />
          <p className="text-xs font-medium uppercase tracking-widest text-yellow-400">
            School Portal
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">
            Nueva Vizcaya Institute
          </h1>
          <span className="mt-2 inline-block rounded-full bg-yellow-400 px-3 py-0.5 text-xs font-semibold text-gray-900">
            SMS
          </span>
          <p className="mx-auto mt-4 max-w-xs text-sm italic leading-relaxed text-blue-100 sm:text-base">
            &ldquo;The home of the achievers, the proud and the champions!&rdquo;
          </p>
        </div>

        <LoginForm />
      </div>
    </section>
  );
}
