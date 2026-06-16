"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/admissions", label: "Admissions" },
  { href: "/student-life", label: "Student Life" },
  { href: "/facilities", label: "Facilities" },
  { href: "/news", label: "News & Events" },
  { href: "/contact", label: "Contact" },
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/auth/login" || pathname === "/auth/forgot-password";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/school-logo.png" alt="Nueva Vizcaya Institute Logo" width={36} height={36} className="h-9 w-auto" />
          <div className="leading-tight">
            <span className="block text-sm font-bold text-gray-900">Nueva Vizcaya Institute</span>
            <span className="block text-[10px] italic text-gray-500">The home of the achievers, the proud and the champions!</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {!isAuthPage && (
            <Link
              href="/auth/login"
              className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              Sign In
            </Link>
          )}
          <Link
            href="/admissions"
            className="inline-flex h-9 items-center justify-center rounded-md bg-yellow-500 px-4 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-400"
          >
            Apply Now
          </Link>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex h-full w-full max-w-xs flex-col gap-0 p-0 sm:max-w-sm">
          <SheetHeader className=" px-4 py-5 pr-12">
            <SheetTitle className="text-base font-semibold text-gray-900">Menu</SheetTitle>
          </SheetHeader>

          <nav className="flex-1 overflow-y-auto px-4 py-0 pb-4">
            <ul className="divide-y divide-gray-100">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block py-3 text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "text-blue-600"
                        : "text-gray-700 hover:text-gray-900"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto border-t px-4 py-4">
            <div className="flex flex-col gap-3">
              {!isAuthPage && (
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-11 w-full items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
                >
                  Sign In
                </Link>
              )}
              <Link
                href="/admissions"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 w-full items-center justify-center rounded-md bg-yellow-500 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-400"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
