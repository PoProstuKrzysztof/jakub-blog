"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Filter out known browser extension and ad blocker errors
    const isExtensionError =
      error.message?.includes("chrome-extension") ||
      error.message?.includes("Could not evaluate in iframe") ||
      error.message?.includes("net::ERR_BLOCKED_BY_CLIENT");

    if (!isExtensionError) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);

      this.setState({
        hasError: true,
        error,
        errorInfo,
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const CustomFallback = this.props.fallback;

      if (CustomFallback) {
        return (
          <CustomFallback error={this.state.error} retry={this.handleRetry} />
        );
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-destructive/50">
            <CardHeader className="text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <CardTitle className="text-destructive">Wystąpił błąd</CardTitle>
              <CardDescription>
                Coś poszło nie tak. Spróbuj odświeżyć stronę lub skontaktuj się
                z administratorem.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-mono text-destructive">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={this.handleRetry} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Spróbuj ponownie
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  Odśwież stronę
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook to use error boundary programmatically
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    // Filter out known browser extension errors
    const isExtensionError =
      error.message?.includes("chrome-extension") ||
      error.message?.includes("Could not evaluate in iframe") ||
      error.message?.includes("net::ERR_BLOCKED_BY_CLIENT") ||
      error.message?.includes("sentry");

    if (!isExtensionError) {
      console.error("Error caught by useErrorHandler:", error, errorInfo);
      throw error;
    }
  };
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>,
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
