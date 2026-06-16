"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { login } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Shield,
  Sparkles,
  UserRound,
} from "lucide-react";

const portalRoles = [
  { label: "Student", icon: GraduationCap },
  { label: "Teacher", icon: UserRound },
  { label: "Admin", icon: Shield },
] as const;

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submitCredentials(email: string, password: string) {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);

    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await submitCredentials(
      formData.get("email") as string,
      formData.get("password") as string
    );
  }

  return (
    <div className="relative w-full max-w-md justify-self-center lg:justify-self-end">
      <div
        className="absolute -inset-4 -z-10 rounded-[2rem] bg-yellow-400/25 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -inset-2 -z-10 translate-x-3 rounded-[2rem] bg-blue-500/20 blur-2xl"
        aria-hidden
      />

      <div className="overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-white/40">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-8 py-8 text-white">
          <div
            className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10"
            aria-hidden
          />
          <div
            className="absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-indigo-400/20"
            aria-hidden
          />

          <div className="relative flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-lg ring-1 ring-white/25 backdrop-blur-sm">
              <Image
                src="/school-logo.png"
                alt="Nueva Vizcaya Institute"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-blue-100 ring-1 ring-white/20">
                <Sparkles className="h-3 w-3 text-yellow-300" />
                School Portal
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
              <p className="mt-1 text-sm text-blue-100">Sign in to your Nueva Vizcaya Institute account</p>
            </div>
          </div>

          <div className="relative mt-6 flex flex-wrap gap-2">
            {portalRoles.map(({ label, icon: Icon }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/20"
              >
                <Icon className="h-3.5 w-3.5 text-yellow-300" />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email address
              </Label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3 transition-all focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@school.edu"
                  required
                  autoComplete="email"
                  className="h-11 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3 transition-all focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                  <Lock className="h-4 w-4 text-blue-600" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="h-11 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="shrink-0 rounded-md p-1 text-gray-400 transition-colors hover:bg-slate-100 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="group h-12 w-full bg-gradient-to-r from-yellow-400 to-yellow-500 font-semibold text-gray-900 shadow-md hover:from-yellow-300 hover:to-yellow-400"
              disabled={loading}
            >
              {loading ? (
                "Signing in…"
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="border-t border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/50 px-8 py-4 text-center">
          <p className="text-xs text-gray-500">
            Secure access for authorized Nueva Vizcaya Institute students, faculty, and staff
          </p>
        </div>
      </div>
    </div>
  );
}
