"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

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
    <div className="w-full overflow-hidden rounded-xl border border-white/20 bg-white">
      <div className="border-b border-gray-100 bg-blue-50 px-6 py-5 text-center sm:px-8">
        <h2 className="text-xl font-semibold text-gray-900">Reset password</h2>
        <p className="mt-1 text-sm text-gray-600">
          Enter your school email and we&apos;ll send you a reset link
        </p>
      </div>

      <div className="px-6 py-6 sm:px-8">
        {success ? (
          <div className="space-y-5">
            <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {success}
            </div>
            <Button
              asChild
              size="lg"
              className="h-11 w-full bg-yellow-400 text-base font-semibold text-gray-900 hover:bg-yellow-300"
            >
              <Link href="/auth/login">Back to sign in</Link>
            </Button>
          </div>
        ) : (
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
              <div className="flex h-11 items-center gap-2 rounded-lg border border-input bg-white px-3 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 [&_input]:text-gray-900 [&_input]:placeholder:text-gray-400">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@school.edu"
                  required
                  autoComplete="email"
                  className="h-full border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-11 w-full bg-yellow-400 text-base font-semibold text-gray-900 hover:bg-yellow-300"
              disabled={loading}
            >
              {loading ? "Sending…" : "Send Reset Link"}
            </Button>
          </form>
        )}
      </div>

      <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 text-center sm:px-8">
        <p className="text-xs text-gray-500">
          Remember your password?
        </p>
        <Link
          href="/auth/login"
          className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
