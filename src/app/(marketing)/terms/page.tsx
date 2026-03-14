import Link from "next/link";
import {
  ArrowLeft,
  Scale,
  FileText,
  CheckCircle,
  AlertCircle,
  Shield,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TermsPage() {
  const sections = [
    {
      icon: FileText,
      title: "1. Acceptance of Terms",
      content: (
        <>
          <p className="text-slate-700 dark:text-slate-300">
            By accessing or using Native FP&A ("the Service"), you agree to be
            bound by these Terms of Service ("Terms"). If you do not agree to
            these Terms, do not access or use the Service. These Terms
            constitute a legally binding agreement between you and Native FP&A.
          </p>
        </>
      ),
    },
    {
      icon: Scale,
      title: "2. Description of Service",
      content: (
        <>
          <p className="mb-3 text-slate-700 dark:text-slate-300">
            Native FP&A is a spreadsheet-native financial planning and analysis
            platform that provides:
          </p>
          <ul className="list-inside list-disc space-y-2 text-slate-700 dark:text-slate-300">
            <li>Workbook and worksheet management for financial modeling</li>
            <li>Budget planning, forecasting, and scenario analysis tools</li>
            <li>
              Collaboration features including comments, approvals, and
              workflows
            </li>
            <li>Report generation and export capabilities</li>
            <li>Integration with external data sources</li>
            <li>Dashboard and analytics features</li>
          </ul>
          <p className="mt-3 text-slate-700 dark:text-slate-300">
            We reserve the right to modify, suspend, or discontinue any part of
            the Service at any time without prior notice.
          </p>
        </>
      ),
    },
    {
      icon: CheckCircle,
      title: "3. User Accounts and Registration",
      content: (
        <>
          <p className="mb-3 text-slate-700 dark:text-slate-300">
            To access certain features of the Service, you must create an
            account:
          </p>
          <ul className="list-inside list-disc space-y-2 text-slate-700 dark:text-slate-300">
            <li>
              <strong>Eligibility:</strong> You must be at least 18 years old to
              use this Service
            </li>
            <li>
              <strong>Account Information:</strong> You agree to provide
              accurate, current, and complete information during registration
            </li>
            <li>
              <strong>Account Security:</strong> You are responsible for
              safeguarding your password and for all activities under your
              account
            </li>
            <li>
              <strong>Multiple Accounts:</strong> Each user should maintain only
              one account unless explicitly authorized
            </li>
            <li>
              <strong>Account Termination:</strong> You may close your account
              at any time by contacting us
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Shield,
      title: "4. User Obligations and Conduct",
      content: (
        <>
          <p className="mb-3 text-slate-700 dark:text-slate-300">
            You agree to use the Service only for lawful purposes and in
            accordance with these Terms. You agree not to:
          </p>
          <ul className="list-inside list-disc space-y-2 text-slate-700 dark:text-slate-300">
            <li>
              Use the Service in any way that violates applicable laws or
              regulations
            </li>
            <li>
              Impersonate any person or entity or misrepresent your affiliation
              with a person or entity
            </li>
            <li>
              Engage in any conduct that restricts or inhibits anyone's use of
              the Service
            </li>
            <li>
              Attempt to gain unauthorized access to the Service or any systems
              or networks connected to the Service
            </li>
            <li>
              Use the Service to transmit malware, viruses, or any code of a
              destructive nature
            </li>
            <li>
              Reverse engineer, decompile, or disassemble the Service (except as
              permitted by law)
            </li>
            <li>
              Share your login credentials or allow unauthorized access to your
              account
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: FileText,
      title: "5. Intellectual Property Rights",
      content: (
        <>
          <p className="mb-3 text-slate-700 dark:text-slate-300">
            <strong>Our Property:</strong> The Service, including its original
            content, features, functionality, design, and branding, is owned by
            Native FP&A and is protected by international copyright, trademark,
            and other intellectual property laws.
          </p>
          <p className="mb-3 text-slate-700 dark:text-slate-300">
            <strong>Your Data:</strong> You retain all rights to the financial
            data, workbooks, forecasts, and other content you create or upload
            to the Service ("User Content").
          </p>
          <p className="mb-3 text-slate-700 dark:text-slate-300">
            <strong>License to Us:</strong> By submitting User Content to the
            Service, you grant us a non-exclusive, worldwide, royalty-free
            license to use, store, and display your content solely for the
            purpose of providing and improving the Service.
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            <strong>Feedback:</strong> Any feedback, comments, or suggestions
            you provide about the Service may be used by us without any
            obligation to you.
          </p>
        </>
      ),
    },
    {
      icon: AlertCircle,
      title: "6. Disclaimers and Limitations",
      content: (
        <>
          <p className="mb-3 text-slate-700 dark:text-slate-300">
            <strong>No Financial Advice:</strong> Native FP&A is a software
            platform and does not provide financial, accounting, or business
            advice. The Service is provided "as is" and "as available" without
            warranties of any kind, either express or implied.
          </p>
          <p className="mb-3 text-slate-700 dark:text-slate-300">
            <strong>Data Accuracy:</strong> While we strive for accuracy, we do
            not guarantee that calculations, forecasts, or reports generated by
            the Service are error-free. You are responsible for verifying all
            financial data and decisions.
          </p>
          <p className="mb-3 text-slate-700 dark:text-slate-300">
            <strong>Limitation of Liability:</strong> To the maximum extent
            permitted by law, Native FP&A shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages, or any loss
            of profits, revenues, data, or data use, arising out of or in
            connection with your use of the Service.
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            <strong>Indemnification:</strong> You agree to indemnify and hold
            harmless Native FP&A from any claims, damages, or expenses arising
            from your use of the Service or violation of these Terms.
          </p>
        </>
      ),
    },
    {
      icon: Scale,
      title: "7. Term and Termination",
      content: (
        <>
          <p className="mb-3 text-slate-700 dark:text-slate-300">
            <strong>Term:</strong> These Terms remain in effect as long as you
            use the Service.
          </p>
          <p className="mb-3 text-slate-700 dark:text-slate-300">
            <strong>Termination by You:</strong> You may terminate your account
            at any time by contacting us.
          </p>
          <p className="mb-3 text-slate-700 dark:text-slate-300">
            <strong>Termination by Us:</strong> We may suspend or terminate your
            access to the Service at any time, with or without cause, with or
            without notice.
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            <strong>Effect of Termination:</strong> Upon termination, your right
            to use the Service will immediately cease. All provisions of these
            Terms which by their nature should survive termination shall
            survive, including ownership provisions, warranty disclaimers,
            indemnity, and limitations of liability.
          </p>
        </>
      ),
    },
    {
      icon: FileText,
      title: "8. Payment Terms",
      content: (
        <>
          <p className="mb-3 text-slate-700 dark:text-slate-300">
            <strong>Fees:</strong> Certain features of the Service may require
            payment of fees. All fees are stated in U.S. Dollars unless
            otherwise specified.
          </p>
          <p className="mb-3 text-slate-700 dark:text-slate-300">
            <strong>Billing:</strong> You agree to provide current, complete,
            and accurate purchase and account information. You authorize us to
            charge your payment method for all fees incurred.
          </p>
          <p className="mb-3 text-slate-700 dark:text-slate-300">
            <strong>Refunds:</strong> Refund policies are determined at our
            discretion and as specified in your subscription agreement.
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            <strong>Fee Changes:</strong> We reserve the right to modify fees at
            any time. Changes will be effective at the start of the next billing
            cycle following notice.
          </p>
        </>
      ),
    },
    {
      icon: Shield,
      title: "9. Privacy and Data Protection",
      content: (
        <>
          <p className="text-slate-700 dark:text-slate-300">
            Your use of the Service is also governed by our Privacy Policy,
            which describes how we collect, use, and protect your personal
            information. By using the Service, you consent to our collection and
            use of your data as outlined in the Privacy Policy.
          </p>
        </>
      ),
    },
    {
      icon: Scale,
      title: "10. Governing Law and Dispute Resolution",
      content: (
        <>
          <p className="mb-3 text-slate-700 dark:text-slate-300">
            <strong>Governing Law:</strong> Unless a signed order form or master
            services agreement states otherwise, these Terms are governed by the
            laws of the State of Delaware, excluding its conflict of law rules.
          </p>
          <p className="mb-3 text-slate-700 dark:text-slate-300">
            <strong>Dispute Resolution:</strong> Before filing a formal claim,
            both parties agree to attempt to resolve the dispute in good faith
            for at least 30 days. If the dispute remains unresolved, it will be
            settled by binding arbitration in Wilmington, Delaware under the
            American Arbitration Association Commercial Arbitration Rules,
            except that either party may seek injunctive relief in a court of
            competent jurisdiction.
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            <strong>Class Action Waiver:</strong> You agree to resolve any
            dispute on an individual basis and waive any right to participate in
            a class action lawsuit or class-wide arbitration.
          </p>
        </>
      ),
    },
    {
      icon: FileText,
      title: "11. Changes to Terms",
      content: (
        <>
          <p className="text-slate-700 dark:text-slate-300">
            We reserve the right to modify these Terms at any time. We will
            provide notice of significant changes by posting the new Terms on
            this page and updating the "Last Updated" date. Your continued use
            of the Service after such changes constitutes your acceptance of the
            new Terms.
          </p>
        </>
      ),
    },
    {
      icon: CheckCircle,
      title: "12. Contact Information",
      content: (
        <>
          <p className="mb-3 text-slate-700 dark:text-slate-300">
            For questions about these Terms of Service, please contact us:
          </p>
          <ul className="list-inside list-disc space-y-2 text-slate-700 dark:text-slate-300">
            <li>
              <strong>Email:</strong> legal@nativefpa.com
            </li>
            <li>
              <strong>Legal Notices:</strong> Send notices electronically to
              legal@nativefpa.com with the subject line "Legal Notice."
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
              <Scale className="text-primary size-8" />
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Terms of Service
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

        {/* Acceptance Notice */}
        <Card className="glass-strong mt-12 border-amber-500/30 bg-amber-50/60 p-6 dark:border-amber-500/20 dark:bg-amber-950/20">
          <CardContent>
            <div className="flex items-start gap-4">
              <AlertCircle className="mt-1 size-6 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                  Acceptance Required
                </h3>
                <p className="mt-2 text-sm text-amber-800 dark:text-amber-200">
                  By using Native FP&A, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms of Service.
                  If you do not agree with any part of these terms, you must
                  discontinue use of the Service immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card className="glass-strong from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 mt-12 border-black/8 bg-gradient-to-br dark:border-white/10">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
              Additional Resources
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Link
                href="/privacy"
                className="group flex items-center gap-3 rounded-2xl border border-black/8 bg-white/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-black/60"
              >
                <Shield className="text-primary size-5 transition-transform duration-300 group-hover:scale-110" />
                <div>
                  <p className="font-medium text-slate-950 dark:text-white">
                    Privacy Policy
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Review our privacy practices
                  </p>
                </div>
              </Link>
              <Link
                href="/contact"
                className="group flex items-center gap-3 rounded-2xl border border-black/8 bg-white/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-black/60"
              >
                <CheckCircle className="text-accent size-5 transition-transform duration-300 group-hover:scale-110" />
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
