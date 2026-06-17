"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/app/admin/settings/actions";
import { toast } from "sonner";

export default function ProfilePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await changePassword(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      toast.success("Password updated successfully.");
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="new_password">New Password</Label>
        <Input
          id="new_password"
          name="new_password"
          type="password"
          minLength={8}
          required
          placeholder="At least 8 characters"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirm_password">Confirm Password</Label>
        <Input
          id="confirm_password"
          name="confirm_password"
          type="password"
          minLength={8}
          required
          placeholder="Re-enter new password"
        />
      </div>
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}
      <Button type="submit" disabled={loading} className="bg-indigo-700 hover:bg-indigo-800">
        {loading ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
}
