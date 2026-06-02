"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "@/app/auth/actions";
import { MOCK_TEACHER_LOGIN } from "@/lib/mock-accounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, GraduationCap } from "lucide-react";

export function LoginForm({ showDevLogin }: { showDevLogin: boolean }) {
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

  async function handleMockTeacherLogin() {
    await submitCredentials(MOCK_TEACHER_LOGIN.email, MOCK_TEACHER_LOGIN.password);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
            <span className="text-xl font-bold text-white">N</span>
          </div>
          <CardTitle className="text-2xl font-bold">NVIANS SMS</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@school.edu"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-2 inline-flex items-center rounded-full p-2 text-gray-500 hover:bg-slate-100 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          {showDevLogin && (
            <div className="mt-6 space-y-2 border-t pt-6">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Development
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start gap-2"
                disabled={loading}
                onClick={handleMockTeacherLogin}
              >
                <GraduationCap className="h-4 w-4 shrink-0" />
                Sign in as {MOCK_TEACHER_LOGIN.label}
              </Button>
              <p className="text-xs text-muted-foreground">
                Run{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-[11px]">
                  node --env-file=.env.local scripts/seed-mock-teacher.mjs
                </code>{" "}
                first if this account does not exist.
              </p>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground hover:underline">
              ← Back to School Website
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
