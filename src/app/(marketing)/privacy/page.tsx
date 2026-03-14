import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  Cookie,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PrivacyPage() {
  const sections = [
    {
      icon: Shield,
      title: "1. Information We Collect",
      content: (
        <>
          <p className="mb-3">
            We collect information that you provide directly to us when using
            Native FP&A:
          </p>
          <ul className="list-inside list-disc space-y-2 text-slate-700 dark:text-slate-300">
            <li>
              <strong>Account Information:</strong> Name, email address,
              password, and organization name when you sign up
            </li>
            <li>
              <strong>Financial Data:</strong> Workbooks, worksheets, cell data,
              budgets, forecasts, and reports you create
            </li>
            <li>
              <strong>Usage Information:</strong> How you interact with our
              platform, including access times and features used
            </li>
            <li>
              <strong>Communication Data:</strong> Comments, approvals, workflow
              interactions, and collaboration metadata
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Database,
      title: "2. How We Use Your Information",
      content: (
        <>
          <p className="mb-3">We use the information we collect to:</p>
          <ul className="list-inside list-disc space-y-2 text-slate-700 dark:text-slate-300">
            <li>Provide, maintain, and improve our FP&A platform</li>
            <li>
              Enable workbook collaboration and financial planning workflows
            </li>
            <li>Send technical notices, updates, and support communications</li>
            <li>Respond to your comments, questions, and support requests</li>
            <li>Monitor and analyze trends, usage, and activities</li>
            <li>Detect, investigate, and prevent security incidents</li>
          </ul>
        </>
      ),
    },
    {
      icon: Lock,
      title: "3. Data Storage and Security",
      content: (
        <>
          <p className="mb-3">
            We implement industry-standard security measures to protect your
            data:
          </p>
          <ul className="list-inside list-disc space-y-2 text-slate-700 dark:text-slate-300">
            <li>
              <strong>Infrastructure:</strong> Data is stored on Supabase, a
              secure PostgreSQL-based platform with SOC 2 Type II certification
            </li>
            <li>
              <strong>Encryption:</strong> All data is encrypted in transit
              using TLS 1.3 and at rest using AES-256 encryption
            </li>
            <li>
              <strong>Access Control:</strong> Row-level security (RLS) policies
              ensure users can only access data they're authorized to view
            </li>
            <li>
              <strong>Authentication:</strong> JWT-based authentication with
              secure session management
            </li>
            <li>
              <strong>Audit Trails:</strong> All data modifications are logged
              with actor, timestamp, and change details
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Eye,
      title: "4. Data Sharing and Disclosure",
      content: (
        <>
          <p className="mb-3">
            We do not sell your personal information. We may share your data
            only in the following circumstances:
          </p>
          <ul className="list-inside list-disc space-y-2 text-slate-700 dark:text-slate-300">
            <li>
              <strong>Within Your Organization:</strong> Data is shared with
              members of your organization based on role-based permissions
            </li>
            <li>
              <strong>Service Providers:</strong> With third-party vendors who
              perform services on our behalf (e.g., hosting, analytics)
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law,
              regulation, or legal process
            </li>
            <li>
              <strong>Business Transfers:</strong> In connection with a merger,
              acquisition, or sale of assets
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: UserCheck,
      title: "5. Your Rights and Controls",
      content: (
        <>
          <p className="mb-3">
            You have the following rights regarding your personal information:
          </p>
          <ul className="list-inside list-disc space-y-2 text-slate-700 dark:text-slate-300">
            <li>
              <strong>Access:</strong> Request a copy of the personal
              information we hold about you
            </li>
            <li>
              <strong>Correction:</strong> Request correction of inaccurate or
              incomplete information
            </li>
            <li>
              <strong>Deletion:</strong> Request deletion of your account and
              personal data (subject to legal obligations)
            </li>
            <li>
              <strong>Export:</strong> Export your workbooks, forecasts, and
              reports in standard formats (Excel, PDF, CSV)
            </li>
            <li>
              <strong>Opt-Out:</strong> Unsubscribe from marketing
              communications at any time
            </li>
            <li>
              <strong>Restriction:</strong> Request restriction of processing in
              certain circumstances
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Cookie,
      title: "6. Cookies and Tracking",
      content: (
        <>
          <p className="mb-3">
            We use cookies and similar tracking technologies to:
          </p>
          <ul className="list-inside list-disc space-y-2 text-slate-700 dark:text-slate-300">
            <li>
              <strong>Essential Cookies:</strong> Enable core functionality like
              authentication and session management
            </li>
            <li>
              <strong>Preference Cookies:</strong> Remember your settings and
              preferences (e.g., theme choice)
            </li>
            <li>
              <strong>Analytics:</strong> Understand how users interact with our
              platform to improve the experience
            </li>
          </ul>
          <p className="mt-3 text-slate-700 dark:text-slate-300">
            You can control cookie preferences through your browser settings.
            However, disabling certain cookies may impact platform
            functionality.
          </p>
        </>
      ),
    },
    {
      icon: Shield,
      title: "7. Data Retention",
      content: (
        <>
          <p className="text-slate-700 dark:text-slate-300">
            We retain your personal information for as long as necessary to
            provide our services and comply with legal obligations.
            Specifically:
          </p>
          <ul className="mt-3 list-inside list-disc space-y-2 text-slate-700 dark:text-slate-300">
            <li>
              <strong>Active Accounts:</strong> Data is retained while your
              account is active
            </li>
            <li>
              <strong>Deleted Accounts:</strong> Personal data is deleted within
              30 days of account deletion, except where retention is required by
              law
            </li>
            <li>
              <strong>Audit Logs:</strong> Retained for 7 years for compliance
              and security purposes
            </li>
            <li>
              <strong>Backup Data:</strong> Backups are retained for 90 days for
              disaster recovery
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Lock,
      title: "8. Children's Privacy",
      content: (
        <p className="text-slate-700 dark:text-slate-300">
          Native FP&A is not intended for children under 18 years of age. We do
          not knowingly collect personal information from children. If we become
          aware that we have collected personal information from a child, we
          will take steps to delete that information.
        </p>
      ),
    },
    {
      icon: Eye,
      title: "9. Changes to This Privacy Policy",
      content: (
        <p className="text-slate-700 dark:text-slate-300">
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page and
          updating the "Last Updated" date. You are advised to review this
          Privacy Policy periodically for any changes.
        </p>
      ),
    },
    {
      icon: UserCheck,
      title: "10. Contact Us",
      content: (
        <>
          <p className="mb-3 text-slate-700 dark:text-slate-300">
            If you have any questions about this Privacy Policy or our data
            practices, please contact us:
          </p>
          <ul className="list-inside list-disc space-y-2 text-slate-700 dark:text-slate-300">
            <li>
              <strong>Email:</strong> privacy@nativefpa.com
            </li>
            <li>
              <strong>Data Protection Officer:</strong> dpo@nativefpa.com
            </li>
            <li>
              <strong>Operations:</strong> Native FP&A is operated by a
              remote-first team and handles privacy requests electronically
              through the addresses above.
            </li>
          </ul>
        </>
      ),
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
              <Shield className="text-primary size-8" />
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Privacy Policy
              </h1>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-400">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {sections.map((section) => (
            <Card
              key={section.title}
              className="glass-strong overflow-hidden border-black/8 bg-white/60 dark:border-white/10 dark:bg-black/60"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="from-primary to-accent flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white">
                    <section.icon className="size-5" />
                  </div>
                  <CardTitle className="text-2xl text-slate-950 dark:text-white">
                    {section.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {section.content}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Resources */}
        <Card className="glass-strong from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 mt-12 border-black/8 bg-gradient-to-br dark:border-white/10">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
              Additional Resources
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Link
                href="/terms"
                className="group flex items-center gap-3 rounded-2xl border border-black/8 bg-white/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-black/60"
              >
                <Shield className="text-primary size-5 transition-transform duration-300 group-hover:scale-110" />
                <div>
                  <p className="font-medium text-slate-950 dark:text-white">
                    Terms of Service
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Review our terms
                  </p>
                </div>
              </Link>
              <Link
                href="/contact"
                className="group flex items-center gap-3 rounded-2xl border border-black/8 bg-white/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-black/60"
              >
                <UserCheck className="text-accent size-5 transition-transform duration-300 group-hover:scale-110" />
                <div>
                  <p className="font-medium text-slate-950 dark:text-white">
                    Contact Us
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Get in touch
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
