"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InternalServerError } from "@/components/ui/internal-server-error";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <InternalServerError onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

// Fallback error component for Suspense boundaries
export function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-8">
      <Card className="max-w-md border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <AlertTriangle className="size-8 text-amber-600 dark:text-amber-400" />
          </div>
          
          <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
            Oops! Something went wrong
          </h2>
          
          <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
            {error.message || "An unexpected error occurred."}
          </p>

          <Button onClick={resetErrorBoundary} variant="default">
            <RefreshCcw className="mr-2 size-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default ErrorBoundary;
