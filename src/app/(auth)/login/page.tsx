import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <Link className="text-sm text-slate-500" href="/">
          Back to site
        </Link>
        <CardTitle className="text-3xl">Sign in to the workspace</CardTitle>
        <CardDescription>Use your approved finance team account to access dashboards, workbooks, and reviews.</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}

