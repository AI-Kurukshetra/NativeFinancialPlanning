"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Users,
  Headphones,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type FormData = {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
};

const initialFormData: FormData = {
  name: "",
  email: "",
  company: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Message sent! We'll get back to you within 24 hours.");
    setFormData(initialFormData);
    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      value: "hello@nativefpa.com",
      description: "We'll respond within 24 hours",
      href: "mailto:hello@nativefpa.com",
    },
    {
      icon: Headphones,
      title: "Support",
      value: "support@nativefpa.com",
      description: "Technical support and help",
      href: "mailto:support@nativefpa.com",
    },
    {
      icon: MessageSquare,
      title: "Sales",
      value: "sales@nativefpa.com",
      description: "Questions about pricing and plans",
      href: "mailto:sales@nativefpa.com",
    },
  ];

  const faqs = [
    {
      question: "What is Native FP&A?",
      answer:
        "Native FP&A is a spreadsheet-native financial planning and analysis platform that combines the flexibility of spreadsheets with the control of enterprise software. It's designed for budgeting, forecasting, approvals, and executive reporting.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start.",
    },
    {
      question: "Can I import data from Excel?",
      answer:
        "Absolutely. You can import Excel workbooks directly, and our platform preserves formulas, formatting, and structure.",
    },
    {
      question: "How secure is my financial data?",
      answer:
        "We use enterprise-grade security with Supabase (SOC 2 Type II certified), TLS 1.3 encryption in transit, AES-256 encryption at rest, and row-level security policies.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-black dark:to-slate-950">
      {/* Hero Section */}
      <div className="border-b border-black/8 bg-white/50 backdrop-blur-xl dark:border-white/10 dark:bg-black/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/">
                <ArrowLeft className="mr-2 size-4" />
                Back to Home
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <Mail className="text-primary size-8" />
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Contact Us
              </h1>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-400">
            Have questions? We're here to help. Reach out and we'll respond as
            soon as possible.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
          <div className="space-y-6">
            {/* Contact Form */}
            <Card className="glass-strong border-black/8 bg-white/60 dark:border-white/10 dark:bg-black/60">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-950 dark:text-white">
                  Send us a message
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Fill out the form below and we'll get back to you within 24
                  hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="glass border-black/8 bg-white/40 dark:border-white/10 dark:bg-black/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        Work Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@company.com"
                        required
                        className="glass border-black/8 bg-white/40 dark:border-white/10 dark:bg-black/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="company"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Company
                    </label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company name"
                      className="glass border-black/8 bg-white/40 dark:border-white/10 dark:bg-black/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="focus:border-primary focus:ring-primary/20 dark:focus:border-primary dark:focus:ring-primary/20 flex h-11 w-full rounded-[20px] border border-black/8 bg-white/40 px-4 py-2 text-sm transition-all duration-200 outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-black/40 dark:text-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="sales">Sales Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="partnership">
                        Partnership Opportunity
                      </option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      required
                      rows={6}
                      className="focus:border-primary focus:ring-primary/20 dark:focus:border-primary dark:focus:ring-primary/20 flex w-full rounded-[20px] border border-black/8 bg-white/40 px-4 py-3 text-sm transition-all duration-200 outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-black/40 dark:text-white"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="group relative w-full overflow-hidden"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <span className="relative z-10 flex items-center">
                          Send Message
                          <Send className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                        <span className="from-primary to-accent absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                    By submitting this form, you agree to our{" "}
                    <Link
                      href="/privacy"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/terms"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Terms of Service
                    </Link>
                    .
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Office Location */}
            <Card className="glass-strong border-black/8 bg-white/60 dark:border-white/10 dark:bg-black/60">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <MapPin className="text-accent mt-1 size-6 shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                      Office Location
                    </h3>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                      Native FP&A operates as a remote-first team.
                      <br />
                      Customer conversations, demos, and support are handled
                      online.
                      <br />
                      For enterprise procurement or legal requests, email
                      hello@nativefpa.com.
                    </p>
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                      Note: We are a remote-first company. Please contact us via
                      email or schedule a meeting before visiting.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Contact Methods */}
            <Card className="glass-strong border-black/8 bg-white/60 dark:border-white/10 dark:bg-black/60">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-950 dark:text-white">
                  Other ways to reach us
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Choose the contact method that works best for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method) => (
                  <a
                    key={method.title}
                    href={method.href}
                    className="group hover:border-primary/30 flex items-start gap-4 rounded-2xl border border-black/8 bg-white/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/60 hover:shadow-lg dark:border-white/10 dark:bg-black/40 dark:hover:bg-black/60"
                  >
                    <div className="from-primary to-accent flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white transition-transform duration-300 group-hover:scale-110">
                      <method.icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-950 dark:text-white">
                        {method.title}
                      </p>
                      <p className="text-primary text-sm">{method.value}</p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                        {method.description}
                      </p>
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="glass-strong from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 border-black/8 bg-gradient-to-br dark:border-white/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Clock className="text-primary mt-1 size-6 shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                      Response Times
                    </h3>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                      We typically respond to inquiries within{" "}
                      <strong className="text-slate-950 dark:text-white">
                        24 hours
                      </strong>{" "}
                      during business days (Monday-Friday, 9am-6pm EST). For
                      urgent support requests, please mark your subject as
                      "Technical Support".
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQs */}
            <Card className="glass-strong border-black/8 bg-white/60 dark:border-white/10 dark:bg-black/60">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="text-primary size-6" />
                  <CardTitle className="text-2xl text-slate-950 dark:text-white">
                    Frequently Asked Questions
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;

                  return (
                    <div
                      key={faq.question}
                      className="overflow-hidden rounded-2xl border border-black/8 bg-white/50 dark:border-white/10 dark:bg-black/40"
                    >
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                      >
                        <span className="font-medium text-slate-950 dark:text-white">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`size-4 shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen ? (
                        <div className="border-t border-black/6 px-4 py-3 dark:border-white/8">
                          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                            {faq.answer}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
