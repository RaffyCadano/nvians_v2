import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDashboardUrl } from "@/lib/site-urls";
import { cn } from "@/lib/utils";
import ProfilePasswordForm from "./password-form";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  KeyRound,
  LayoutDashboard,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
  XCircle,
} from "lucide-react";

const ROLE_CONFIG = {
  admin: {
    label: "Administrator",
    badge: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    portal: "Admin Portal",
  },
  staff: {
    label: "Staff",
    badge: "bg-sky-100 text-sky-700 hover:bg-sky-100",
    portal: "Admin Portal",
  },
  teacher: {
    label: "Teacher",
    badge: "bg-violet-100 text-violet-700 hover:bg-violet-100",
    portal: "Teacher Portal",
  },
  student: {
    label: "Student",
    badge: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    portal: "Student Portal",
  },
} as const;

function getUserInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatJoinedDate(value: string) {
  return new Date(value).toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getMemberDuration(value: string) {
  const joined = new Date(value);
  const now = new Date();
  const months = Math.max(
    0,
    (now.getFullYear() - joined.getFullYear()) * 12 + (now.getMonth() - joined.getMonth())
  );
  if (months < 1) return "New member";
  if (months < 12) return `${months} mo`;
  const years = Math.floor(months / 12);
  return years === 1 ? "1 yr" : `${years} yrs`;
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  const user = profile ?? {
    id: authUser.id,
    email: authUser.email ?? "",
    full_name: authUser.user_metadata?.full_name ?? "User",
    role: (authUser.user_metadata?.role as string) ?? "student",
    is_active: true,
    created_at: authUser.created_at ?? new Date().toISOString(),
    avatar_url: undefined as string | undefined,
  };

  const roleKey = (user.role in ROLE_CONFIG ? user.role : "student") as keyof typeof ROLE_CONFIG;
  const roleConfig = ROLE_CONFIG[roleKey];
  const dashboardPath = getDashboardUrl(user.role, null);

  const statCards = [
    {
      label: "Account Status",
      value: user.is_active ? "Active" : "Inactive",
      icon: user.is_active ? CheckCircle2 : XCircle,
      color: user.is_active ? "text-green-600" : "text-red-600",
      bg: user.is_active ? "bg-green-50" : "bg-red-50",
      isText: true,
    },
    {
      label: "Role",
      value: roleConfig.label,
      icon: ShieldCheck,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      isText: true,
    },
    {
      label: "Member Since",
      value: formatJoinedDate(user.created_at),
      icon: CalendarDays,
      color: "text-violet-600",
      bg: "bg-violet-50",
      isText: true,
    },
    {
      label: "Portal",
      value: roleConfig.portal,
      icon: LayoutDashboard,
      color: "text-blue-600",
      bg: "bg-blue-50",
      isText: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 to-violet-800 px-6 py-6 text-white sm:px-8 sm:py-7">
        <Link
          href={dashboardPath}
          className="-ml-1 mb-4 inline-flex items-center gap-1.5 text-sm text-indigo-200 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-4 ring-white/20">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-semibold text-white">
                {getUserInitials(user.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">
                My Account
              </p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{user.full_name}</h1>
              <p className="mt-1 text-sm text-indigo-200">{user.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge className={cn(roleConfig.badge, "border-0")}>{roleConfig.label}</Badge>
                <Badge
                  className={cn(
                    "border-0",
                    user.is_active
                      ? "bg-green-500/20 text-green-200 hover:bg-green-500/20"
                      : "bg-red-500/20 text-red-200 hover:bg-red-500/20"
                  )}
                >
                  {user.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 sm:self-start">
            <UserRound className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">{stat.label}</p>
                  <p
                    className={cn(
                      "mt-1.5 font-bold text-gray-900",
                      stat.isText ? "truncate text-sm sm:text-base" : "text-2xl sm:text-3xl"
                    )}
                  >
                    {stat.value}
                  </p>
                </div>
                <div className={cn("shrink-0 rounded-xl p-2.5", stat.bg)}>
                  <Icon className={cn("h-5 w-5", stat.color)} />
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
                <UserRound className="h-4 w-4 text-gray-500" />
                <h2 className="font-semibold text-gray-900">Account Information</h2>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                Your profile details as stored in the system.
              </p>
            </div>
            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wide text-gray-500 uppercase">
                  <UserRound className="h-3.5 w-3.5" />
                  Full Name
                </div>
                <p className="text-base font-semibold text-gray-900">{user.full_name}</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wide text-gray-500 uppercase">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </div>
                <p className="truncate text-base font-semibold text-gray-900">{user.email}</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wide text-gray-500 uppercase">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Role
                </div>
                <Badge className={roleConfig.badge}>{roleConfig.label}</Badge>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wide text-gray-500 uppercase">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Joined
                </div>
                <p className="text-base font-semibold text-gray-900">
                  {formatJoinedDate(user.created_at)}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {getMemberDuration(user.created_at)} on NVIANS
                </p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-gray-500" />
                <h2 className="font-semibold text-gray-900">Change Password</h2>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                Update your sign-in password. Use at least 8 characters.
              </p>
            </div>
            <div className="px-5 py-5">
              <ProfilePasswordForm />
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-7">
          <section className="overflow-hidden rounded-xl border border-indigo-200 bg-indigo-50/40 p-5">
            <h2 className="text-base font-bold text-gray-900">Account Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Portal</span>
                <span className="font-medium text-gray-900">{roleConfig.portal}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Status</span>
                <Badge
                  className={
                    user.is_active
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : "bg-red-100 text-red-700 hover:bg-red-100"
                  }
                >
                  {user.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Member for</span>
                <span className="font-medium text-gray-900">
                  {getMemberDuration(user.created_at)}
                </span>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full bg-white">
              <Link href={dashboardPath}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Go to dashboard
              </Link>
            </Button>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="rounded-lg bg-indigo-50 p-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                  1
                </span>
                <span>Profile details are managed by your school administrator.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                  2
                </span>
                <span>You can change your password anytime from this page.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                  3
                </span>
                <span>Contact an admin if your role or email needs updating.</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
