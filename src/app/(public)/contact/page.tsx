"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, User, FileText, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CONTACT_ITEMS = [
  {
    icon: MapPin,
    title: "Visit Us",
    color: "text-blue-600",
    detail: "123 School Street, Brgy. San Jose, City, Province 1234",
  },
  {
    icon: Phone,
    title: "Call Us",
    color: "text-green-600",
    links: [
      { text: "(02) 123-4567", href: "tel:+6321234567" },
      { text: "0917-123-4567", href: "tel:+639171234567" },
    ],
  },
  {
    icon: Mail,
    title: "Email Us",
    color: "text-purple-600",
    links: [
      { text: "info@nvians.edu.ph", href: "mailto:info@nvians.edu.ph" },
      { text: "admissions@nvians.edu.ph", href: "mailto:admissions@nvians.edu.ph" },
    ],
  },
  {
    icon: Clock,
    title: "Office Hours",
    color: "text-orange-600",
    detail: "Monday – Friday, 7:00 AM – 5:00 PM",
  },
] as const;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div>
      <section className="relative flex min-h-[45vh] items-center overflow-hidden text-white sm:min-h-[42vh] lg:min-h-[40vh]">
        <Image
          src="/contact-cover.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_40%] sm:object-center"
          aria-hidden
        />
        <div className="absolute inset-0 bg-blue-950/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-indigo-900/30" />
        <div className="container relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
          <p className="mb-2 text-xs font-medium tracking-wider text-yellow-400 uppercase sm:mb-3 sm:text-sm lg:text-base">
            Get in Touch
          </p>
          <h1 className="mb-3 max-w-3xl text-2xl font-bold leading-tight sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
            Contact Us
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-blue-200 sm:text-base lg:text-lg">
            Have questions? We&apos;d love to hear from you. Reach us through any of the channels below.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
            <a
              href="tel:+6321234567"
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-yellow-500 px-6 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-400 sm:w-auto sm:min-w-[160px]"
            >
              <Phone className="mr-2 h-4 w-4 shrink-0" />
              Call (02) 123-4567
            </a>
            <Link
              href="/admissions"
              className="inline-flex h-11 w-full items-center justify-center rounded-md border border-white/60 bg-white/10 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/20 sm:w-auto sm:min-w-[160px]"
            >
              View Admissions
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CONTACT_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-xl border p-5 text-center">
                  <Icon className={`mx-auto h-6 w-6 ${item.color}`} />
                  <p className="mt-3 text-sm font-semibold text-gray-900">{item.title}</p>
                  {"detail" in item && item.detail ? (
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">{item.detail}</p>
                  ) : (
                    <div className="mt-1 space-y-1">
                      {item.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          className="block text-xs text-blue-600 hover:underline"
                        >
                          {link.text}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="scroll-mt-20 bg-gray-50 py-10 sm:py-14 lg:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-8">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Send Us a Message</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500 sm:text-base">
              We&apos;ll get back to you within 1–2 business days.
            </p>
          </div>

          <div className="mx-auto w-full max-w-2xl">
            {submitted ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center sm:p-8">
                <p className="font-semibold text-green-700">Thank you for reaching out!</p>
                <p className="mt-1 text-sm text-green-600">
                  We&apos;ve received your message and will respond shortly.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-xl border bg-white p-4 sm:space-y-5 sm:p-6 lg:p-8"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700">
                      Full Name
                    </Label>
                    <div className="flex h-11 min-w-0 items-center gap-2 rounded-lg border border-input bg-background px-3 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                      <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        required
                        placeholder="Juan dela Cruz"
                        className="h-full min-w-0 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">
                      Email
                    </Label>
                    <div className="flex h-11 min-w-0 items-center gap-2 rounded-lg border border-input bg-background px-3 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                      <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="juan@email.com"
                        className="h-full min-w-0 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-gray-700">
                    Subject
                  </Label>
                  <div className="flex h-11 min-w-0 items-center gap-2 rounded-lg border border-input bg-background px-3 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <Input
                      id="subject"
                      name="subject"
                      required
                      placeholder="Inquiry about admissions..."
                      className="h-full min-w-0 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-700">
                    Message
                  </Label>
                  <div className="rounded-lg border border-input bg-background px-3 py-3 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                    <div className="flex min-w-0 gap-2">
                      <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <Textarea
                        id="message"
                        name="message"
                        required
                        placeholder="Write your message here..."
                        rows={4}
                        className="min-h-[100px] min-w-0 flex-1 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 sm:min-h-[120px]"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="h-11 w-full bg-yellow-400 text-sm font-semibold text-gray-900 hover:bg-yellow-300 sm:text-base"
                >
                  {loading ? "Sending…" : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center sm:text-2xl">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "What are the admission requirements?", a: "You'll need a completed application form, Report Card (Form 138), PSA Birth Certificate, Certificate of Good Moral Character, 2x2 ID photos, and a Medical Certificate." },
              { q: "When is the enrollment period?", a: "Enrollment typically opens in March for the upcoming school year. Contact the Registrar's Office for exact dates." },
              { q: "Do you offer scholarships?", a: "Yes, we offer academic scholarships and financial assistance for qualifying students. Contact the Registrar for details." },
              { q: "What grade levels do you offer?", a: "We offer Junior High School (Grades 7–10) and Senior High School (Grades 11–12) with multiple specialized tracks." },
              { q: "How can I schedule a campus visit?", a: "You can call us at (02) 123-4567 or email info@nvians.edu.ph to schedule a campus tour." },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl border p-5">
                <p className="text-sm font-semibold text-gray-900">{faq.q}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
