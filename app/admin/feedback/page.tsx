
import Header from "@/components/header";
import { getFeedbacks, getFeedbackMetrics } from "@/app/_actions/feedback";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic'; // Ensure realtime data

export default async function AdminFeedbackPage() {
  const feedbacks = await getFeedbacks();
  const metrics = await getFeedbackMetrics();

  const getTypeColor = (type: string) => {
      switch (type) {
          case 'BUG': return 'destructive';
          case 'SUGGESTION': return 'default'; // primary
          case 'COMPLAIMENT': return 'secondary';
          default: return 'outline';
      }
  }

  const getTypeLabel = (type: string) => {
      switch (type) {
          case 'BUG': return 'Bug';
          case 'SUGGESTION': return 'Sugestão';
          case 'COMPLAIMENT': return 'Reclamação';
          case 'OTHER': return 'Outro';
          default: return type;
      }
  }

  return (
    <>
      <Header />
      <div className="container mx-auto py-10 px-4 space-y-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatório de Feedbacks</h1>
            <p className="text-muted-foreground">Visualize e gerencie os comentários dos usuários.</p>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{metrics.total}</div>
                </CardContent>
            </Card>
            {metrics.byType.map((metric) => (
                <Card key={metric.type}>
                    <CardHeader className="pb-2">
                         <CardTitle className="text-sm font-medium">{getTypeLabel(metric.type)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metric._count.type}</div>
                    </CardContent>
                </Card>
            ))}
        </div>

        {/* List */}
        <Card>
            <CardHeader>
                <CardTitle>Últimos Feedbacks</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Usuário</TableHead>
                            <TableHead>Mensagem</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {feedbacks.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                                    Nenhum feedback encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                        {feedbacks.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="whitespace-nowrap">
                                    {new Date(item.createdAt).toLocaleDateString('pt-BR')} <br/>
                                    <span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleTimeString('pt-BR')}</span>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getTypeColor(item.type) as any}>{getTypeLabel(item.type)}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{item.user?.name || "Anônimo"}</span>
                                        <span className="text-xs text-muted-foreground">{item.user?.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-md break-words">
                                    {item.message}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
