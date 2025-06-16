import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/components/auth-provider'
import { SiteFooter } from "@/components/site-footer"
import '@/lib/builder'

export const metadata: Metadata = {
  title: 'Jakub Inwestycje - Blog Finansowy',
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
