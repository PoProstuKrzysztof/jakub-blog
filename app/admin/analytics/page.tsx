"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Clock,
  PieChartIcon as RechartsPieChart,
  PhoneIcon as Cell,
  XIcon as XAxis,
  Axis3dIcon as YAxis,
  MapIcon as CartesianGrid,
  InfoIcon as Tooltip,
  StarIcon as Legend,
  ContainerIcon as ResponsiveContainer,
  PieChartIcon as Pie,
} from "lucide-react"
import Link from "next/link"
import { AreaChart, Area, BarChart, Bar } from "recharts"

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
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedMetric, setSelectedMetric] = useState("views")

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "Desktop":
        return <Pie className="h-4 w-4" />
      case "Mobile":
        return <Pie className="h-4 w-4" />
      case "Tablet":
        return <Pie className="h-4 w-4" />
      default:
        return <Pie className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-accent shadow-lg border-b border-accent sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-primary-foreground">
                Jakub Inwestycje
              </Link>
              <Badge className="bg-primary text-primary-foreground rounded-xl">Analytics</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32 bg-card/10 border-primary text-primary-foreground rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-accent rounded-xl shadow-xl">
                  <SelectItem value="7d">7 dni</SelectItem>
                  <SelectItem value="30d">30 dni</SelectItem>
                  <SelectItem value="90d">90 dni</SelectItem>
                  <SelectItem value="1y">1 rok</SelectItem>
                </SelectContent>
              </Select>
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-xl"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Panel Twórcy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#332941] to-accent text-primary-foreground py-12 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 animate-fade-in">Analytics Dashboard</h1>
              <p className="text-gray-200 animate-fade-in-delay">
                Szczegółowe statystyki wydajności Twojego bloga za ostatnie{" "}
                {timeRange === "7d" ? "7 dni" : timeRange === "30d" ? "30 dni" : timeRange === "90d" ? "90 dni" : "rok"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Pie className="h-8 w-8 text-primary" />
              <Pie className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary-foreground mb-6">Przegląd</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {overviewStats.map((stat, index) => (
              <Card
                key={stat.title}
                className="bg-card/95 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        {stat.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span
                          className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                        >
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div
                      className="h-12 w-12 rounded-xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: stat.color }}
                    >
                      <stat.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Traffic Chart */}
        <section className="mb-8">
          <Card className="bg-card/95 rounded-2xl shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Ruch na stronie</CardTitle>
                  <CardDescription>Wyświetlenia, użytkownicy i sesje w czasie</CardDescription>
                </div>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-40 border-accent rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-accent rounded-xl shadow-xl">
                    <SelectItem value="views">Wyświetlenia</SelectItem>
                    <SelectItem value="users">Użytkownicy</SelectItem>
                    <SelectItem value="sessions">Sesje</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={viewsData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#33D2A4" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#33D2A4" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B3486" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3B3486" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#332941" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#332941" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #3B3486",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend />
                    {selectedMetric === "views" && (
                      <Area
                        type="monotone"
                        dataKey="views"
                        stroke="#33D2A4"
                        fillOpacity={1}
                        fill="url(#colorViews)"
                        strokeWidth={3}
                        name="Wyświetlenia"
                      />
                    )}
                    {selectedMetric === "users" && (
                      <Area
                        type="monotone"
                        dataKey="users"
                        stroke="#3B3486"
                        fillOpacity={1}
                        fill="url(#colorUsers)"
                        strokeWidth={3}
                        name="Użytkownicy"
                      />
                    )}
                    {selectedMetric === "sessions" && (
                      <Area
                        type="monotone"
                        dataKey="sessions"
                        stroke="#332941"
                        fillOpacity={1}
                        fill="url(#colorSessions)"
                        strokeWidth={3}
                        name="Sesje"
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Category Performance */}
          <Card className="bg-card/95 rounded-2xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-foreground">Wydajność kategorii</CardTitle>
              <CardDescription>Rozkład wyświetleń według kategorii</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #3B3486",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {categoryData.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      <span className="text-sm font-medium text-foreground">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-foreground">{category.value}%</span>
                      <p className="text-xs text-muted-foreground">{category.views.toLocaleString()} wyświetleń</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Analytics */}
          <Card className="bg-card/95 rounded-2xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-foreground">Urządzenia użytkowników</CardTitle>
              <CardDescription>Rozkład ruchu według typu urządzenia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deviceData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" />
                    <YAxis dataKey="name" type="category" stroke="#6b7280" width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #3B3486",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar dataKey="value" fill="#33D2A4" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {deviceData.map((device) => (
                  <div key={device.name} className="flex items-center justify-between p-3 bg-background rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: device.color, color: "white" }}>
                        {getDeviceIcon(device.name)}
                      </div>
                      <span className="font-medium text-foreground">{device.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-foreground">{device.value}%</span>
                      <p className="text-sm text-muted-foreground">{device.users.toLocaleString()} użytkowników</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Posts Performance */}
        <section className="mb-8">
          <Card className="bg-card/95 rounded-2xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-foreground">Najlepsze posty</CardTitle>
              <CardDescription>Ranking postów według wydajności</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 bg-background rounded-xl hover:bg-muted transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-lg font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground line-clamp-1">{post.title}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <Badge className="bg-accent text-primary-foreground rounded-lg text-xs">{post.category}</Badge>
                          <span className="text-xs text-muted-foreground">Zmiana: {post.change}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-6 text-center">
                      <div>
                        <p className="text-sm font-bold text-foreground">{post.views.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Wyświetlenia</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{post.users.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Użytkownicy</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{post.avgTime}</p>
                        <p className="text-xs text-muted-foreground">Śr. czas</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{post.bounceRate}</p>
                        <p className="text-xs text-muted-foreground">Odrzucenia</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Traffic Sources */}
          <Card className="bg-card/95 rounded-2xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-foreground">Źródła ruchu</CardTitle>
              <CardDescription>Skąd przychodzą Twoi użytkownicy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trafficSources.map((source, index) => (
                  <div key={source.source} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{source.source}</span>
                        <span className="text-sm font-bold text-foreground">{source.percentage}%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${source.percentage}%`,
                            backgroundColor: index === 0 ? "#33D2A4" : index === 1 ? "#2C3E50" : "#BDC3C7",
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">{source.users.toLocaleString()} użytkowników</span>
                        <span className="text-xs text-green-600">{source.change}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Engagement Metrics */}
          <Card className="bg-card/95 rounded-2xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-foreground">Metryki zaangażowania</CardTitle>
              <CardDescription>Jak użytkownicy wchodzą w interakcję z treścią</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {engagementData.map((metric, index) => (
                  <div key={metric.metric} className="flex items-center justify-between p-4 bg-background rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{metric.metric}</p>
                      <p className="text-xl font-bold text-foreground mt-1">{metric.value}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600">{metric.change}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }
      `}</style>
    </div>
  )
}
