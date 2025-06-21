import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Panel Portfela - Admin',
  description: 'Zarządzanie portfelem inwestycyjnym i publikowanie analiz'
}

export default function AdminPortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 