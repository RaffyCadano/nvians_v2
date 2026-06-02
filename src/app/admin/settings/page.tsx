"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { changePassword } from "./actions";
import { toast } from "sonner";
import { KeyRound, School } from "lucide-react";

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
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage system and account settings.</p>
      </div>

      {/* School Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <School className="h-4 w-4 text-gray-500" />
            <CardTitle className="text-base">School Information</CardTitle>
          </div>
          <CardDescription>Displayed on the public website and reports.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>School Name</Label>
            <Input defaultValue="NVIANS School Management System" readOnly className="bg-gray-50" />
            <p className="text-xs text-gray-400">Edit <code>NEXT_PUBLIC_APP_NAME</code> in <code>.env.local</code> to change.</p>
          </div>
          <div className="space-y-1.5">
            <Label>App URL</Label>
            <Input defaultValue={process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"} readOnly className="bg-gray-50" />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Change Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-gray-500" />
            <CardTitle className="text-base">Change Password</CardTitle>
          </div>
          <CardDescription>Update your admin account password.</CardDescription>
        </CardHeader>
        <CardContent>
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
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{pwError}</p>
            )}
            <Button type="submit" disabled={pwLoading}>
              {pwLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
