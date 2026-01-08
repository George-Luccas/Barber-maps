import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100)
}

export function isServiceEligibleForPlan(serviceName: string): boolean {
    const name = serviceName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Keywords that disqualify the service
    const blocked = [
        "combo", 
        "barba", 
        "sobrancelha", 
        "pezinho", 
        "acabamento", 
        "tintura", 
        "selagem", 
        "hidratacao", 
        "platinado",
        "pigmentacao",
        "camuflagem"
    ];
    
    if (blocked.some(k => name.includes(k))) return false;

    // Keywords that qualify the service
    const allowed = [
        "corte", 
        "cabelo", 
        "social", 
        "degrade", 
        "maquina", 
        "tesoura", 
        "infantil", 
        "kids", 
        "raspa", 
        "texturizado",
        "navalhado",
        "blindado"
    ];
    
    return allowed.some(k => name.includes(k));
}
