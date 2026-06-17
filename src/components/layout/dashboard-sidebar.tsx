"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { adminNavActive, adminNavHref } from "@/lib/admin-routes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  CalendarDays,
  ClipboardList,
  BarChart3,
  Settings,
  Newspaper,
  UserCheck,
  School,
  LogOut,
  Megaphone,
  Menu,
  CalendarCheck,
  PieChart,
  ChevronDown,
  ExternalLink,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import type { User } from "@/types";
import { getPublicAppUrl } from "@/lib/site-urls";

type NavItem = { href: string; label: string; icon: LucideIcon };
type NavGroup = { label: string; items: NavItem[] };

const ADMIN_NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Academics",
    items: [
      { href: "/school-years", label: "School Years", icon: Calendar },
      { href: "/classes", label: "Classes", icon: School },
      { href: "/subjects", label: "Subjects", icon: BookOpen },
      { href: "/schedule", label: "Schedule", icon: CalendarDays },
      { href: "/teachers", label: "Teachers", icon: UserCheck },
      { href: "/students", label: "Students", icon: GraduationCap },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/enrollment", label: "Enrollment", icon: ClipboardList },
      { href: "/attendance", label: "Attendance", icon: CalendarCheck },
      { href: "/grades", label: "Grades", icon: BarChart3 },
    ],
  },
  {
    label: "Insights & Content",
    items: [
      { href: "/reports", label: "Reports", icon: PieChart },
      { href: "/cms", label: "Website CMS", icon: Newspaper },
    ],
  },
  {
    label: "System",
    items: [{ href: "/settings", label: "Settings", icon: Settings }],
  },
];

const TEACHER_NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [{ href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Teaching",
    items: [
      { href: "/teacher/advisory", label: "Advisory Class", icon: School },
      { href: "/teacher/subjects", label: "My Subjects", icon: BookOpen },
      { href: "/teacher/attendance", label: "Attendance", icon: CalendarCheck },
      { href: "/teacher/grades", label: "Grades", icon: BarChart3 },
    ],
  },
  {
    label: "Resources",
    items: [
      { href: "/teacher/assignments", label: "Assignments", icon: ClipboardList },
      { href: "/teacher/announcements", label: "Announcements", icon: Megaphone },
    ],
  },
];

const STUDENT_NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [{ href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Academic",
    items: [
      { href: "/student/grades", label: "Grades", icon: BarChart3 },
      { href: "/student/attendance", label: "Attendance", icon: CalendarCheck },
      { href: "/student/schedule", label: "Schedule", icon: BookOpen },
    ],
  },
  {
    label: "Resources",
    items: [
      { href: "/student/assignments", label: "Assignments", icon: ClipboardList },
      { href: "/student/announcements", label: "Announcements", icon: Megaphone },
    ],
  },
];

const PORTAL_NAV = {
  admin: ADMIN_NAV,
  teacher: TEACHER_NAV,
  student: STUDENT_NAV,
} as const;

const PORTAL_LABELS = {
  admin: "Admin Portal",
  teacher: "Teacher Portal",
  student: "Student Portal",
} as const;

const PORTAL_BADGE = {
  admin: "bg-blue-500/20 text-blue-300 ring-blue-400/20",
  teacher: "bg-violet-500/20 text-violet-300 ring-violet-400/20",
  student: "bg-emerald-500/20 text-emerald-300 ring-emerald-400/20",
} as const;

function getUserInitials(name: string | undefined) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface DashboardShellProps {
  user: User;
  portal: "admin" | "teacher" | "student";
  children: React.ReactNode;
}

function isNavActive(
  pathname: string,
  href: string,
  portal: "admin" | "teacher" | "student",
  host: string | null
) {
  if (portal === "admin") {
    return adminNavActive(pathname, href, host);
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  item,
  active,
  href,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  href: string;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150",
        active
          ? "bg-blue-500/15 text-white"
          : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-100"
      )}
    >
      {active && (
        <span className="absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-blue-400" />
      )}
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors",
          active
            ? "bg-blue-500/20 text-blue-300"
            : "bg-white/[0.04] text-slate-500 group-hover:bg-white/[0.08] group-hover:text-slate-300"
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function DashboardSidebarContent({
  user,
  portal,
  onNavigate,
  showClose,
}: {
  user: User;
  portal: "admin" | "teacher" | "student";
  onNavigate?: () => void;
  showClose?: boolean;
}) {
  const pathname = usePathname();
  const navGroups = PORTAL_NAV[portal];
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const host = typeof window !== "undefined" ? window.location.hostname : null;

  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      {/* Brand header */}
      <div className="shrink-0 border-b border-white/[0.06] px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
            <Image
              src="/school-logo.png"
              alt="Nueva Vizcaya Institute Logo"
              width={28}
              height={28}
              className="h-7 w-auto"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight text-white">
              Nueva Vizcaya Institute
            </p>
            <p className="mt-0.5 truncate text-[11px] font-medium tracking-wide text-blue-300/80 uppercase">
              {PORTAL_LABELS[portal]}
            </p>
          </div>
          {showClose && onNavigate && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onNavigate}
              aria-label="Close navigation menu"
              className="shrink-0 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="dashboard-nav-scroll flex-1 overflow-x-hidden overflow-y-auto px-3 py-4">
        <div className="space-y-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-1.5 px-3 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const href =
                    portal === "admin" ? adminNavHref(item.href, host) : item.href;
                  const active = isNavActive(pathname, item.href, portal, host);
                  return (
                    <li key={item.href}>
                      <NavLink
                        item={item}
                        active={active}
                        href={href}
                        onNavigate={onNavigate}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {portal === "admin" && (
          <div className="mt-6 border-t border-white/[0.06] pt-4">
            <a
              href={getPublicAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-slate-100"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.04]">
                <ExternalLink className="h-3.5 w-3.5" />
              </span>
              View Public Site
            </a>
          </div>
        )}
      </nav>

      {/* User footer */}
      <div className="shrink-0 border-t border-white/[0.06] bg-slate-950/40 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left",
              "bg-white/[0.04] ring-1 ring-white/[0.06]",
              "transition-all duration-150 hover:bg-white/[0.08] hover:ring-white/10",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40"
            )}
          >
            <div className="relative shrink-0">
              <Avatar className="h-10 w-10 ring-2 ring-white/10 transition-transform group-hover:scale-[1.02]">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-xs font-semibold text-white">
                  {getUserInitials(user.full_name)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-slate-950 bg-green-400" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-semibold text-white">{user.full_name}</p>
              <span
                className={cn(
                  "mt-1 inline-flex max-w-full items-center truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase ring-1",
                  PORTAL_BADGE[portal]
                )}
              >
                {PORTAL_LABELS[portal]}
              </span>
            </div>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-slate-500 transition-colors group-hover:bg-white/[0.08] group-hover:text-slate-300">
              <ChevronDown className="h-4 w-4" />
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            side="top"
            sideOffset={10}
            className="w-[calc(var(--anchor-width)+0px)] min-w-[15rem] overflow-hidden rounded-xl border border-white/10 bg-slate-900 p-0 text-slate-100 shadow-xl shadow-black/40 ring-1 ring-white/5"
          >
            <div className="border-b border-white/[0.06] bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3.5">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 ring-2 ring-white/10">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-sm font-semibold text-white">
                    {getUserInitials(user.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{user.full_name}</p>
                  <p className="truncate text-xs text-slate-400">{user.email}</p>
                  <span
                    className={cn(
                      "mt-1.5 inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase ring-1",
                      PORTAL_BADGE[portal]
                    )}
                  >
                    {PORTAL_LABELS[portal]}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-1.5">
              <DropdownMenuItem
                className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-slate-200 focus:bg-white/[0.08] focus:text-white"
                onClick={() => {
                  window.location.href = "/profile";
                }}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.06]">
                  <UserRound className="h-3.5 w-3.5 text-slate-300" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">Profile</p>
                  <p className="text-[11px] text-slate-500">Account settings</p>
                </div>
              </DropdownMenuItem>
            </div>

            <div className="border-t border-white/[0.06] p-1.5">
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 focus:bg-red-500/15 focus:text-red-300"
                onClick={() => setIsSignOutOpen(true)}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-red-500/15">
                  <LogOut className="h-3.5 w-3.5 text-red-400" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-red-300">Sign out</p>
                  <p className="text-[11px] text-red-400/70">End your session</p>
                </div>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={isSignOutOpen} onOpenChange={setIsSignOutOpen}>
          <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
            <div className="border-b border-white/[0.06] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/15 ring-1 ring-red-400/25">
                  <LogOut className="h-5 w-5 text-red-300" />
                </div>
                <div>
                  <DialogTitle className="text-base font-semibold text-white">
                    Sign out?
                  </DialogTitle>
                  <p className="mt-0.5 text-xs text-slate-400">{PORTAL_LABELS[portal]}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5">
              <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3.5">
                <Avatar className="h-10 w-10 ring-2 ring-white">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback className="bg-blue-600 text-sm font-semibold text-white">
                    {user.full_name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">{user.full_name}</p>
                  <p className="truncate text-xs capitalize text-gray-500">{user.role}</p>
                </div>
              </div>

              <DialogDescription className="mt-4 text-sm leading-relaxed text-gray-600">
                You&apos;ll need to sign in again to access your dashboard, grades, and other
                portal features.
              </DialogDescription>
            </div>

            <DialogFooter className="!m-0 gap-2.5 border-t border-gray-100 bg-gray-50/80 px-6 py-4 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setIsSignOutOpen(false)}
              >
                Stay signed in
              </Button>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={() => {
                  window.location.href = "/auth/signout";
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export function DashboardShell({ user, portal, children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-gray-50 md:flex-row">
      {/* Mobile / tablet header */}
      <header className="sticky top-0 z-40 flex min-h-14 shrink-0 items-center gap-3 border-b border-slate-800 bg-slate-950 px-4 pt-[max(0px,env(safe-area-inset-top))] pb-3 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
          className="text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Image
          src="/school-logo.png"
          alt="Nueva Vizcaya Institute Logo"
          width={28}
          height={28}
          className="h-7 w-auto"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">NVIANS</p>
          <p className="truncate text-[10px] text-slate-400 uppercase">{PORTAL_LABELS[portal]}</p>
        </div>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="h-dvh w-[min(18rem,88vw)] max-w-none gap-0 overflow-hidden border-slate-800 bg-slate-950 p-0 sm:w-72"
        >
          <DashboardSidebarContent
            user={user}
            portal={portal}
            showClose
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <aside className="hidden h-dvh w-[272px] shrink-0 md:flex">
        <DashboardSidebarContent user={user} portal={portal} />
      </aside>

      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="w-full px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">{children}</div>
      </main>
    </div>
  );
}

/** @deprecated Use DashboardShell instead */
export function DashboardSidebar({
  user,
  portal,
}: {
  user: User;
  portal: "admin" | "teacher" | "student";
}) {
  return (
    <aside className="hidden h-dvh w-[272px] shrink-0 md:flex">
      <DashboardSidebarContent user={user} portal={portal} />
    </aside>
  );
}
