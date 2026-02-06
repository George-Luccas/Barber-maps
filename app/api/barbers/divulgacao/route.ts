import { NextResponse } from "next/server";

const API_BASE_URL = process.env.COMERCIO_API_URL || "http://localhost:3001";

/**
 * GET /api/barbers/divulgacao
 * Lista barbeiros de divulgação da API externa
 */
export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/external/v1/barbers`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar barbeiros" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] Erro ao buscar barbeiros:", error);
    return NextResponse.json(
      { error: "Erro de conexão" },
      { status: 500 }
    );
  }
}
