"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "./actions";
import { toast } from "sonner";
import { getAdminPortalUrl, getPublicAppUrl } from "@/lib/site-urls";
import { Globe, KeyRound, Link2, School, Settings } from "lucide-react";

export default function AdminSettingsPage() {
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");

  async function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwLoading(true);
    setPwError("");
    const formData = new FormData(e.currentTarget);
    const result = await changePassword(formData);
    if (result?.error) {
      setPwError(result.error);
    } else {
      toast.success("Password updated successfully.");
      (e.target as HTMLFormElement).reset();
    }
    setPwLoading(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-slate-800 px-6 py-6 text-white sm:px-8 sm:py-7">
        <div>
          <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">Configuration</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Settings</h1>
          <p className="mt-2 max-w-xl text-sm text-gray-300">
            Manage school information, portal URLs, and your admin account password.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          { label: "School Info", icon: School, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Public URL", icon: Globe, color: "text-green-600", bg: "bg-green-50" },
          { label: "Admin Portal", icon: Link2, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Security", icon: KeyRound, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">{stat.label}</p>
                  <p className="mt-1.5 text-sm font-semibold text-gray-900">Configured</p>
                </div>
                <div className={`rounded-xl p-2.5 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="flex min-w-0 flex-col gap-6">
          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
              <div className="flex items-center gap-2">
                <School className="h-4 w-4 text-gray-500" />
                <h2 className="font-semibold text-gray-900">School Information</h2>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">Displayed on the public website and reports.</p>
            </div>
            <div className="space-y-4 px-5 py-5">
              <div className="space-y-1.5">
                <Label>School Name</Label>
                <Input
                  defaultValue="Nueva Vizcaya Institute School Management System"
                  readOnly
                  className="bg-gray-50 text-gray-900"
                />
                <p className="text-xs text-gray-400">
                  Edit <code>NEXT_PUBLIC_APP_NAME</code> in <code>.env.local</code> to change.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label>Public site URL</Label>
                <Input defaultValue={getPublicAppUrl()} readOnly className="bg-gray-50 text-gray-900" />
              </div>
              <div className="space-y-1.5">
                <Label>Admin portal URL</Label>
                <Input defaultValue={getAdminPortalUrl()} readOnly className="bg-gray-50 text-gray-900" />
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-gray-500" />
                <h2 className="font-semibold text-gray-900">Change Password</h2>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">Update your admin account password.</p>
            </div>
            <div className="px-5 py-5">
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="new_password">New Password</Label>
                  <Input id="new_password" name="new_password" type="password" minLength={8} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                  <Input id="confirm_password" name="confirm_password" type="password" minLength={8} required />
                </div>
                {pwError && (
                  <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{pwError}</p>
                )}
                <Button type="submit" disabled={pwLoading}>
                  {pwLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </div>
          </section>
        </div>

        <aside className="rounded-xl border border-gray-200 bg-white p-5 lg:sticky lg:top-7">
          <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700">1</span>
              <span>School name is set via environment variables.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700">2</span>
              <span>Portal URLs are read-only and reflect your deployment config.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700">3</span>
              <span>Use a strong password with at least 8 characters.</span>
            </li>
          </ul>
          <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-400">
            <Settings className="h-3.5 w-3.5" />
            <span>More settings coming soon</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
