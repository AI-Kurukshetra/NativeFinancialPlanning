import { Check } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const tiers = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "For small finance teams getting started with structured planning.",
    features: [
      "Up to 3 workbooks",
      "5 team members",
      "Basic role-based access",
      "Monthly export snapshots",
      "Email support",
    ],
    cta: "Start for free",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$49",
    period: "per month",
    description: "For growing teams that need advanced workflows and reporting.",
    features: [
      "Unlimited workbooks",
      "Up to 15 team members",
      "Advanced approval workflows",
      "Real-time collaboration",
      "Board pack exports",
      "Variance analysis",
      "Priority support",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For organizations with advanced security and integration needs.",
    features: [
      "Everything in Professional",
      "Unlimited team members",
      "SSO & advanced security",
      "Custom integrations",
      "Dedicated success manager",
      "SLA guarantees",
      "On-premise deployment option",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-semibold text-slate-950">Simple, transparent pricing</h1>
        <p className="mt-4 text-lg text-slate-600">
          Start free and scale as your planning needs grow.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card 
            key={tier.name}
            className={`relative flex flex-col ${
              tier.highlighted 
                ? "border-slate-950/20 bg-slate-950/5 shadow-lg" 
                : ""
            }`}
          >
            {tier.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white">
                  Most popular
                </span>
              </div>
            )}
            <CardHeader className="flex-1">
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <div className="mb-6">
                <span className="text-4xl font-semibold text-slate-950">{tier.price}</span>
                {tier.period !== "contact us" && (
                  <span className="text-sm text-slate-500">/{tier.period}</span>
                )}
              </div>
              <div className="mb-6 space-y-3">
                {tier.features.map((feature) => (
                  <div className="flex items-center gap-3 text-sm text-slate-700" key={feature}>
                    <Check className="size-4 text-emerald-600" />
                    {feature}
                  </div>
                ))}
              </div>
              <Button 
                asChild 
                className="w-full"
                variant={tier.highlighted ? "default" : "secondary"}
              >
                <Link href="/signup">{tier.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}

