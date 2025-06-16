import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/auth-provider";
import { SiteFooter } from "@/components/site-footer";
import { ErrorBoundary } from "@/components/error-boundary";
import "@/lib/builder";
import "@/lib/utils/iframe-error-handler";

export const metadata: Metadata = {
  title: "Jakub Inwestycje - Blog Finansowy",
  description:
    "Profesjonalny blog o inwestowaniu, analizach spółek i edukacji finansowej",
  generator: "Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body>
        <ErrorBoundary>
          <AuthProvider>
            <ErrorBoundary>{children}</ErrorBoundary>
            <SiteFooter />
            <Toaster />
            <SonnerToaster />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
