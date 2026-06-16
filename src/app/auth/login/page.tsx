import { Badge } from "@/components/ui/badge";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <section className="relative flex flex-1 items-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="container relative mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2">
          <div className="max-w-xl">
            <Badge
              variant="secondary"
              className="mb-4 border-blue-600 bg-blue-700/50 text-blue-100"
            >
              Student · Teacher · Admin
            </Badge>
            <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl">
              Welcome to{" "}
              <span className="text-yellow-400">NVIANS SMS</span>
            </h1>
            <p className="text-lg leading-relaxed text-blue-100 sm:text-xl">
              Sign in to your portal to manage grades, attendance, assignments, and school
              announcements.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
