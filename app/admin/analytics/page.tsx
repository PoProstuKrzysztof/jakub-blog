"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SiteHeader } from "@/components/site-header"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Clock,
  PieChart as PieChartIcon,
  MessageSquare
} from "lucide-react"
import Link from "next/link"
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts"
import { createClient } from '@/lib/supabase-server'

// Mock analytics data
const overviewStats = [
  {
    title: "Łączne wyświetlenia",
    value: "45,231",
    change: "+12.5%",
    trend: "up",
    icon: Eye,
    color: "#33D2A4",
  },
  {
    title: "Unikalni użytkownicy",
    value: "8,492",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    color: "#2C3E50",
  },
  {
    title: "Średni czas na stronie",
    value: "4:32",
    change: "+15.3%",
    trend: "up",
    icon: Clock,
    color: "#BDC3C7",
  },
  {
    title: "Współczynnik odrzuceń",
    value: "32.1%",
    change: "-5.2%",
    trend: "down",
    icon: Eye,
    color: "#33D2A4",
  },
]

const viewsData = [
  { date: "01.12", views: 1250, users: 890, sessions: 1120 },
  { date: "02.12", views: 1380, users: 920, sessions: 1200 },
  { date: "03.12", views: 1520, users: 1050, sessions: 1350 },
  { date: "04.12", views: 1420, users: 980, sessions: 1280 },
  { date: "05.12", views: 1680, users: 1150, sessions: 1450 },
  { date: "06.12", views: 1890, users: 1280, sessions: 1620 },
  { date: "07.12", views: 2100, users: 1420, sessions: 1780 },
  { date: "08.12", views: 1950, users: 1350, sessions: 1650 },
  { date: "09.12", views: 2250, users: 1580, sessions: 1920 },
  { date: "10.12", views: 2450, users: 1720, sessions: 2080 },
  { date: "11.12", views: 2180, users: 1650, sessions: 1950 },
  { date: "12.12", views: 2380, users: 1780, sessions: 2120 },
]

const topPosts = [
  {
    id: 1,
    title: "Analiza fundamentalna spółki PKN Orlen - Q3 2024",
    views: 8450,
    users: 6230,
    avgTime: "6:45",
    bounceRate: "28%",
    category: "Analiza spółek",
    change: "+15%",
  },
  {
    id: 2,
    title: "Jak czytać sprawozdania finansowe - Poradnik",
    views: 6780,
    users: 5120,
    avgTime: "8:12",
    bounceRate: "22%",
    category: "Edukacja",
    change: "+8%",
  },
  {
    id: 3,
    title: "Trendy na rynku kryptowalut - Grudzień 2024",
    views: 5920,
    users: 4680,
    avgTime: "5:30",
    bounceRate: "35%",
    category: "Kryptowaluty",
    change: "+22%",
  },
  {
    id: 4,
    title: "Sektor bankowy - perspektywy na 2025",
    views: 4560,
    users: 3890,
    avgTime: "7:15",
    bounceRate: "30%",
    category: "Analiza spółek",
    change: "-3%",
  },
  {
    id: 5,
    title: "Strategie inwestycyjne w czasach inflacji",
    views: 4120,
    users: 3450,
    avgTime: "9:20",
    bounceRate: "25%",
    category: "Edukacja",
    change: "+12%",
  },
]

const categoryData = [
  { name: "Analiza spółek", value: 35, views: 15680, color: "#33D2A4" },
  { name: "Edukacja", value: 28, views: 12540, color: "#2C3E50" },
  { name: "Kryptowaluty", value: 20, views: 8960, color: "#BDC3C7" },
  { name: "Przegląd rynku", value: 12, views: 5380, color: "#33D2A4" },
  { name: "Narzędzia", value: 5, views: 2240, color: "#2C3E50" },
]

const deviceData = [
  { name: "Desktop", value: 45, users: 3820, color: "#33D2A4" },
  { name: "Mobile", value: 38, users: 3230, color: "#2C3E50" },
  { name: "Tablet", value: 17, users: 1442, color: "#BDC3C7" },
]

const trafficSources = [
  { source: "Wyszukiwarka organiczna", users: 4250, percentage: 50.1, change: "+8%" },
  { source: "Bezpośredni ruch", users: 2130, percentage: 25.1, change: "+12%" },
  { source: "Media społecznościowe", users: 1280, percentage: 15.1, change: "+25%" },
  { source: "Linki zewnętrzne", users: 680, percentage: 8.0, change: "+5%" },
  { source: "Email marketing", users: 152, percentage: 1.7, change: "+18%" },
]

const engagementData = [
  { metric: "Średni czas na stronie", value: "4:32", change: "+15.3%" },
  { metric: "Strony na sesję", value: "2.8", change: "+8.7%" },
  { metric: "Współczynnik odrzuceń", value: "32.1%", change: "-5.2%" },
  { metric: "Powracający użytkownicy", value: "42.5%", change: "+12.1%" },
]

export default function AnalyticsPage() {
  // Mock data - replace with real data from Supabase
  const mockData = {
    totalViews: 12543,
    totalPosts: 45,
    totalUsers: 234,
    avgReadTime: 4.2,
    
    // Views over time
    viewsData: [
      { date: '2024-01-01', views: 120 },
      { date: '2024-01-02', views: 150 },
      { date: '2024-01-03', views: 180 },
      { date: '2024-01-04', views: 200 },
      { date: '2024-01-05', views: 170 },
      { date: '2024-01-06', views: 220 },
      { date: '2024-01-07', views: 250 },
    ],
    
    // Popular posts
    popularPosts: [
      { title: 'Jak zacząć inwestować w akcje', views: 1250, slug: 'jak-zaczac-inwestowac' },
      { title: 'Analiza spółki PKO BP', views: 980, slug: 'analiza-pko-bp' },
      { title: 'Portfel inwestycyjny dla początkujących', views: 850, slug: 'portfel-dla-poczatkujacych' },
      { title: 'Dywidendy - co warto wiedzieć', views: 720, slug: 'dywidendy-podstawy' },
      { title: 'ETF vs akcje - co wybrać', views: 650, slug: 'etf-vs-akcje' },
    ],
    
    // Traffic sources
    trafficSources: [
      { name: 'Organiczny', value: 45, color: '#8884d8' },
      { name: 'Social Media', value: 25, color: '#82ca9d' },
      { name: 'Bezpośredni', value: 20, color: '#ffc658' },
      { name: 'Email', value: 10, color: '#ff7300' },
    ],
    
    // Device types
    deviceData: [
      { device: 'Desktop', users: 60 },
      { device: 'Mobile', users: 35 },
      { device: 'Tablet', users: 5 },
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader 
        currentPage="admin"
        adminMode={true}
        adminTitle="Analytics"
        showSearch={false}
      />

      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analityka</h1>
            <p className="text-muted-foreground">
              Przegląd statystyk i wydajności bloga
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Całkowite wyświetlenia
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% od ostatniego miesiąca
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Opublikowane posty
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.totalPosts}</div>
              <p className="text-xs text-muted-foreground">
                +3 w tym miesiącu
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Zarejestrowani użytkownicy
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +12% od ostatniego miesiąca
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Średni czas czytania
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.avgReadTime} min</div>
              <p className="text-xs text-muted-foreground">
                +0.3 min od ostatniego miesiąca
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Views Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Wyświetlenia w czasie</CardTitle>
              <CardDescription>
                Ostatnie 7 dni
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockData.viewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('pl-PL', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString('pl-PL')}
                    formatter={(value) => [value, 'Wyświetlenia']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Źródła ruchu</CardTitle>
              <CardDescription>
                Rozkład źródeł odwiedzin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockData.trafficSources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockData.trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Popular Posts and Device Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Popular Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Najpopularniejsze posty</CardTitle>
              <CardDescription>
                Top 5 postów według wyświetleń
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.popularPosts.map((post, index) => (
                  <div key={post.slug} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm leading-none">{post.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">/{post.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium">{post.views.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statystyki urządzeń</CardTitle>
              <CardDescription>
                Rozkład użytkowników według typu urządzenia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockData.deviceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="device" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Użytkownicy (%)']} />
                  <Bar dataKey="users" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Ostatnia aktywność</CardTitle>
            <CardDescription>
              Najnowsze wydarzenia na blogu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nowy post opublikowany</p>
                  <p className="text-xs text-muted-foreground">Analiza spółki CD Projekt - 2 godziny temu</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nowy użytkownik zarejestrowany</p>
                  <p className="text-xs text-muted-foreground">jan.kowalski@example.com - 4 godziny temu</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Post zaktualizowany</p>
                  <p className="text-xs text-muted-foreground">Jak zacząć inwestować w akcje - wczoraj</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
