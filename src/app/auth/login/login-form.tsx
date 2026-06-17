"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

const FIELD_STYLE = {
  color: "#111827",
  WebkitTextFillColor: "#111827",
  caretColor: "#111827",
  backgroundColor: "#ffffff",
} as const;

const fieldClassName =
  "auth-field-input h-full min-w-0 flex-1 border-0 bg-white px-0 text-base outline-none placeholder:text-gray-400 md:text-sm";

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
      formData.get("password") as string,
    );
  }

  return (
    <div className="auth-form-root w-full overflow-hidden rounded-xl border border-white/20 bg-white text-gray-900">
      <div className="border-b border-gray-100 bg-blue-50 px-6 py-5 text-center sm:px-8">
        <h2 className="text-xl font-semibold text-gray-900">Welcome back</h2>
        <p className="mt-1 text-sm text-gray-600">
          Sign in with your school email and password
        </p>
      </div>

      <div className="px-6 py-6 text-gray-900 sm:px-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              Email
            </Label>
            <div className="flex h-11 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 transition-colors focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
              <Mail className="h-4 w-4 shrink-0 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@school.edu"
                required
                autoComplete="email"
                className={fieldClassName}
                style={FIELD_STYLE}
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
                className="text-xs text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="flex h-11 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 transition-colors focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
              <Lock className="h-4 w-4 shrink-0 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className={fieldClassName}
                style={FIELD_STYLE}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-11 w-full bg-yellow-400 text-base font-semibold text-gray-900 hover:bg-yellow-300"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </div>

      <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 text-center sm:px-8">
        <p className="text-xs text-gray-500">
          Don&apos;t have login credentials yet?
        </p>
        <Link
          href="/contact"
          className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline"
        >
          Contact the school office for your account
        </Link>
      </div>
    </div>
  );
}
