"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

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
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-blue-200 max-w-2xl">
            Have questions? We'd love to hear from you. Reach us through any of the channels below.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              {[
                {
                  icon: MapPin,
                  title: "Address",
                  detail: "123 School Street, Barangay San Jose, City, Province 1234",
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  icon: Phone,
                  title: "Phone",
                  detail: "(02) 123-4567 | 0917-123-4567",
                  color: "text-green-600",
                  bg: "bg-green-50",
                },
                {
                  icon: Mail,
                  title: "Email",
                  detail: "info@nvians.edu.ph\nadmissions@nvians.edu.ph",
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                },
                {
                  icon: Clock,
                  title: "Office Hours",
                  detail: "Monday – Friday\n7:00 AM – 5:00 PM",
                  color: "text-orange-600",
                  bg: "bg-orange-50",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4">
                    <div className={`rounded-lg p-2.5 ${item.bg} h-fit`}>
                      <Icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600 whitespace-pre-line mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                );
              })}

              {/* Map placeholder */}
              <div className="mt-6 h-48 rounded-xl bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Map placeholder</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="rounded-lg bg-green-50 border border-green-200 p-6 text-center">
                    <p className="text-green-700 font-medium">Thank you for reaching out!</p>
                    <p className="text-sm text-green-600 mt-1">
                      We've received your message and will respond within 1–2 business days.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" required placeholder="Juan dela Cruz" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" required placeholder="juan@email.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" name="subject" required placeholder="Inquiry about admissions..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        placeholder="Write your message here..."
                        rows={5}
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                      {loading ? "Sending…" : "Send Message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
