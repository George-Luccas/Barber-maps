
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function ErrorBoundaryFallback({ error }: { error?: string }) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erro</AlertTitle>
      <AlertDescription>
        Não foi possível carregar esta seção. {error && <span className="text-xs opacity-70">({error})</span>}
      </AlertDescription>
    </Alert>
  )
}
