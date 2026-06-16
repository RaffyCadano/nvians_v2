"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { forgotPassword } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Mail, Sparkles } from "lucide-react";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const result = await forgotPassword(formData);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(result.success);
    }
    setLoading(false);
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
                Account Recovery
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Reset password</h2>
              <p className="mt-1 text-sm text-blue-100">
                We&apos;ll email you a link to choose a new password
              </p>
            </div>
          </div>
        </div>

        <div className="px-8 py-8">
          {success ? (
            <div className="space-y-5">
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-700">
                {success}
              </div>
              <Button
                asChild
                variant="outline"
                className="h-11 w-full border-slate-200"
              >
                <Link href="/auth/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to sign in
                </Link>
              </Button>
            </div>
          ) : (
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

              <Button
                type="submit"
                size="lg"
                className="group h-12 w-full bg-gradient-to-r from-yellow-400 to-yellow-500 font-semibold text-gray-900 shadow-md hover:from-yellow-300 hover:to-yellow-400"
                disabled={loading}
              >
                {loading ? (
                  "Sending…"
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>

              <Button
                asChild
                variant="ghost"
                className="h-10 w-full text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                <Link href="/auth/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to sign in
                </Link>
              </Button>
            </form>
          )}
        </div>

        <div className="border-t border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/50 px-8 py-4 text-center">
          <p className="text-xs text-gray-500">
            Check your inbox and spam folder for the reset email
          </p>
        </div>
      </div>
    </div>
  );
}
