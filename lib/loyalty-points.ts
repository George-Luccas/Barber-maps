export function calculateServicePoints(name: string, price: number): number {
    const normalizedName = name.toLowerCase();

    // 20 Points - Combo (Corte + Barba)
    if (normalizedName.includes("corte") && normalizedName.includes("barba")) {
        return 20;
    }

    // 10 Points - Pigmentação or Corte/Cabelo
    if (normalizedName.includes("pigmentação") || normalizedName.includes("pigmentacao")) {
        return 10;
    }
    if (normalizedName.includes("corte") || normalizedName.includes("cabelo")) {
        return 10;
    }

    // 5 Points - Secondary Services
    if (
        normalizedName.includes("barba") || 
        normalizedName.includes("sobrancelha") ||
        normalizedName.includes("pezinho") ||
        normalizedName.includes("hidratação") ||
        normalizedName.includes("massagem")
    ) {
        return 5;
    }

    // 2 Points - Products / Others
    return 2;
}
