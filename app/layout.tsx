import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/components/auth-provider'

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
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
