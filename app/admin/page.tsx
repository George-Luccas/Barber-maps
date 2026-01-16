"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Megaphone, 
  Scissors, 
  Users, 
  DollarSign, 
  BarChart3, 
  Settings,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const router = useRouter()

  const adminModules = [
    {
      title: "Promoções",
      description: "Gerencie banners e anúncios",
      icon: Megaphone,
      href: "/admin/promotions",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Barbearias",
      description: "Gerenciar parceiros e unidades",
      icon: Scissors,
      href: "/admin/barbershops", // Placeholder route
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Usuários",
      description: "Controle de acesso e clientes",
      icon: Users,
      href: "/admin/users", // Placeholder route
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Financeiro",
      description: "Relatórios e transações",
      icon: DollarSign,
      href: "/admin/financials", // Placeholder route
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
    {
      title: "Analytics",
      description: "Métricas de desempenho",
      icon: BarChart3,
      href: "/admin/analytics", // Placeholder route
      color: "text-pink-500",
      bgColor: "bg-pink-500/10"
    },
    {
      title: "Configurações",
      description: "Ajustes gerais do sistema",
      icon: Settings,
      href: "/admin/settings", // Placeholder route
      color: "text-gray-500",
      bgColor: "bg-gray-500/10"
    }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <Button variant="outline" size="sm" asChild className="w-fit">
            <Link href="/">
                <ArrowLeft className="size-4 mr-2" />
                Voltar
            </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Painel Administrativo</h1>
        <p className="text-muted-foreground">
          Bem-vindo, George. Aqui você tem controle total sobre o Barber Maps.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminModules.map((module) => (
          <Link href={module.href} key={module.title}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full border-muted-foreground/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-semibold">
                  {module.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${module.bgColor}`}>
                  <module.icon className={`h-5 w-5 ${module.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm mt-2">
                  {module.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="mt-10">
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
            <h2 className="text-lg font-semibold text-red-400 mb-2">Zona de Perigo</h2>
            <p className="text-sm text-muted-foreground mb-4">
                Ações críticas que afetam todo o sistema.
            </p>
            <div className="flex gap-4">
                <Button variant="destructive" size="sm">Manutenção do Sistema</Button>
                <Button variant="outline" size="sm" className="border-red-500/50 text-red-500 hover:bg-red-500/10">Logs de Erro</Button>
            </div>
        </div>
      </div>
    </div>
  )
}
