import { Check } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const tiers = [
  {
    name: "Starter",
    price: "Free during MVP",
    description: "Best for hackathon demos and internal validation.",
    features: ["Single organization", "Core planning workspace", "Basic auth and app shell"],
  },
  {
    name: "Growth",
    price: "Roadmap",
    description: "For richer collaboration, approvals, and reporting.",
    features: ["Role-aware workflows", "Realtime collaboration", "Template and reporting library"],
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-semibold text-slate-950">Pricing direction</h1>
        <p className="mt-4 text-lg text-slate-600">This scaffold does not lock pricing logic in place, but it leaves room for organization plans and entitlements.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {tiers.map((tier) => (
          <Card key={tier.name}>
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-5 text-3xl font-semibold text-slate-950">{tier.price}</p>
              <div className="space-y-3">
                {tier.features.map((feature) => (
                  <div className="flex items-center gap-3 text-sm text-slate-700" key={feature}>
                    <Check className="size-4 text-emerald-600" />
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}

