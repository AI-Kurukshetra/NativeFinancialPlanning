import { FeatureGrid } from "@/components/marketing/feature-grid";

export default function FeaturesPage() {
  return (
    <main className="pb-20 pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold text-slate-950">Feature baseline</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          The scaffold covers the route groups, shared utilities, and platform primitives needed to build the MVP safely.
        </p>
      </div>
      <FeatureGrid />
    </main>
  );
}

