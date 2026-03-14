import Link from "next/link";

import { SignupForm } from "@/components/auth/signup-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <Link className="text-sm text-slate-500" href="/">
          Back to site
        </Link>
        <CardTitle className="text-3xl">Create a finance workspace</CardTitle>
        <CardDescription>Start with authentication and organization metadata. Workbook data and access controls layer in next.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
    </Card>
  );
}

