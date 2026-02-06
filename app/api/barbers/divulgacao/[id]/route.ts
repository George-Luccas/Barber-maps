import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.COMERCIO_API_URL || "http://localhost:3001";

/**
 * GET /api/barbers/divulgacao/[id]
 * Busca detalhes de um barbeiro de divulgação
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const response = await fetch(`${API_BASE_URL}/api/external/v1/barbers/${id}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Barbeiro não encontrado" },
        { status: 404 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] Erro ao buscar barbeiro:", error);
    return NextResponse.json(
      { error: "Erro de conexão" },
      { status: 500 }
    );
  }
}
