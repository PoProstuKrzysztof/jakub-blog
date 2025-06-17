import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/components/auth-provider'
import { SiteFooter } from "@/components/common/site-footer"

// Conditionally import builder only if the API key is available
let builderImport: Promise<any> | null = null
if (process.env.NEXT_PUBLIC_BUILDER_PUBLIC_KEY) {
  builderImport = import('@/lib/builder.io/builder').catch(() => null)
}

export const metadata: Metadata = {
  title: 'Jakub Inwestycje - Wpisy Finansowe',
  description: 'Profesjonalny blog o inwestowaniu, analizach spółek i edukacji finansowej',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl">
      <body>
        <AuthProvider>
          {children}
          <SiteFooter />
          <Toaster />
          <SonnerToaster />
        </AuthProvider>
      </body>
    </html>
  )
}
