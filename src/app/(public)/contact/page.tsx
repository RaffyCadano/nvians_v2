"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Image from "next/image";

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
      <section className="relative flex min-h-[40vh] items-center overflow-hidden text-white sm:min-h-[45vh]">
        <Image
          src="/contact-cover.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_50%]"
          aria-hidden
        />
        <div className="absolute inset-0 bg-blue-950/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-indigo-900/30" />
        <div className="container relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="text-3xl font-bold mb-3 sm:text-4xl lg:text-5xl sm:mb-4">Contact Us</h1>
          <p className="text-blue-200 max-w-2xl text-sm sm:text-base lg:text-lg">
            Have questions? We&apos;d love to hear from you. Reach us through any of the channels below.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MapPin, title: "Visit Us", detail: "123 School Street, Brgy. San Jose, City, Province 1234", color: "text-blue-600" },
              { icon: Phone, title: "Call Us", detail: "(02) 123-4567\n0917-123-4567", color: "text-green-600" },
              { icon: Mail, title: "Email Us", detail: "info@nvians.edu.ph\nadmissions@nvians.edu.ph", color: "text-purple-600" },
              { icon: Clock, title: "Office Hours", detail: "Monday – Friday\n7:00 AM – 5:00 PM", color: "text-orange-600" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-xl border p-5 text-center transition-colors hover:bg-gray-50">
                  <Icon className={`mx-auto h-6 w-6 ${item.color}`} />
                  <p className="mt-3 text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-gray-500">{item.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Send Us a Message</h2>
            <p className="mt-1 text-sm text-gray-500">We&apos;ll get back to you within 1–2 business days.</p>
          </div>

          {submitted ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
              <p className="font-semibold text-green-700">Thank you for reaching out!</p>
              <p className="mt-1 text-sm text-green-600">
                We&apos;ve received your message and will respond shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-white p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" required placeholder="Juan dela Cruz" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required placeholder="juan@email.com" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" required placeholder="Inquiry about admissions..." />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" required placeholder="Write your message here..." rows={4} />
              </div>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? "Sending…" : "Send Message"}
              </Button>
            </form>
          )}
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
