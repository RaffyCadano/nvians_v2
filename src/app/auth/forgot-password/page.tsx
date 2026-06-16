import { Inbox, KeyRound, Mail } from "lucide-react";
import { ForgotPasswordForm } from "./forgot-password-form";

const steps = [
  { icon: Mail, label: "Enter your registered school email" },
  { icon: Inbox, label: "Open the reset link we send you" },
  { icon: KeyRound, label: "Choose a new secure password" },
];

export default function ForgotPasswordPage() {
  return (
    <section className="relative flex flex-1 items-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div
        className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -right-16 bottom-1/4 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl"
        aria-hidden
      />

      <div className="container relative mx-auto max-w-7xl px-4 py-10 sm:py-16 lg:py-24">
        <div className="grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="order-2 max-w-lg space-y-6 lg:order-1 lg:space-y-8">
            <div className="space-y-5">
              <div className="inline-block h-1 w-12 rounded-full bg-yellow-400" aria-hidden />
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Forgot your{" "}
                <span className="text-yellow-400">password?</span>
              </h1>
              <p className="text-base leading-relaxed text-blue-100 sm:text-lg">
                No worries — enter the email linked to your Nueva Vizcaya Institute account and we&apos;ll help you
                get back in.
              </p>
            </div>

            <ul className="space-y-3">
              {steps.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 backdrop-blur-sm"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-400/20">
                    <Icon className="h-4 w-4 text-yellow-300" />
                  </div>
                  <span className="text-sm font-medium text-blue-50">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="order-1 lg:order-2">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </section>
  );
}
