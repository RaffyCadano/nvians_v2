"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { resetPassword } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, KeyRound, Lock, Sparkles } from "lucide-react";

const FIELD_STYLE = {
  color: "#111827",
  WebkitTextFillColor: "#111827",
  caretColor: "#111827",
  backgroundColor: "#ffffff",
} as const;

const fieldClassName =
  "auth-field-input h-11 min-w-0 flex-1 border-0 bg-white px-0 text-base outline-none placeholder:text-gray-400 md:text-sm";

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    if (formData.get("password") !== formData.get("confirm_password")) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const result = await resetPassword(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <section className="relative flex flex-1 items-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="container relative mx-auto max-w-7xl px-4 py-10 sm:py-16 lg:py-24">
        <div className="grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="order-2 max-w-lg space-y-5 text-white lg:order-1">
            <div className="inline-block h-1 w-12 rounded-full bg-yellow-400" aria-hidden />
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              Set a new{" "}
              <span className="text-yellow-400">password</span>
            </h1>
            <p className="text-base leading-relaxed text-blue-100 sm:text-lg">
              Choose a strong password with at least 8 characters. You&apos;ll use it to sign in to
              your Nueva Vizcaya Institute portal.
            </p>
          </div>

          <div className="order-1 w-full max-w-md justify-self-center lg:order-2 lg:justify-self-end">
            <div className="auth-form-root scheme-light overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-white/40">
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-8 py-8 text-white">
                <div className="relative flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-lg ring-1 ring-white/25">
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
                    <h2 className="text-2xl font-bold tracking-tight">New password</h2>
                    <p className="mt-1 text-sm text-blue-100">Enter and confirm your new password</p>
                  </div>
                </div>
              </div>

              <div className="px-8 py-8 text-gray-900">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700">
                      New password
                    </Label>
                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 transition-all focus-within:border-blue-400 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                        <Lock className="h-4 w-4 text-blue-600" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        minLength={8}
                        placeholder="At least 8 characters"
                        className={fieldClassName}
                        style={FIELD_STYLE}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password" className="text-gray-700">
                      Confirm password
                    </Label>
                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 transition-all focus-within:border-blue-400 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                        <KeyRound className="h-4 w-4 text-blue-600" />
                      </div>
                      <input
                        id="confirm_password"
                        name="confirm_password"
                        type="password"
                        required
                        minLength={8}
                        placeholder="Re-enter password"
                        className={fieldClassName}
                        style={FIELD_STYLE}
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
                      "Updating…"
                    ) : (
                      <>
                        Update Password
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
