import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, User, ShieldCheck, CalendarDays } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  const user = profile ?? {
    id: authUser.id,
    email: authUser.email ?? "",
    full_name: authUser.user_metadata?.full_name ?? "User",
    role: (authUser.user_metadata?.role as string) ?? "user",
    is_active: true,
    created_at: authUser.created_at ?? "",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle>My Profile</CardTitle>
            <CardDescription>View your account details and role information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                  <User className="h-4 w-4" />
                  <span>Full Name</span>
                </div>
                <p className="text-lg font-semibold text-slate-900">{user.full_name}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </div>
                <p className="text-lg font-semibold text-slate-900">{user.email}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Role</span>
                </div>
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm">
                  {user.role}
                </Badge>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>Joined</span>
                </div>
                <p className="text-lg font-semibold text-slate-900">
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-slate-900">Account status</h2>
              <p className="mt-2 text-sm text-slate-600">
                {user.is_active ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-red-600">Inactive</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
