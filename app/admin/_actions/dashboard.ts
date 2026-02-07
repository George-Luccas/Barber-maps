"use server";

import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

const COMERCIO_API_URL = process.env.COMERCIO_API_URL || "http://localhost:3001";

// --- Barbershops ---
export async function getAdminBarbershops() {
  // Buscar barbearias locais
  const localBarbershops = await prisma.barbershop.findMany({
    orderBy: { name: "asc" },
    include: {
        _count: {
            select: { bookings: true }
        }
    }
  });

  const localData = localBarbershops.map((b: any) => ({
    ...b,
    dailyGoal: Number(b.dailyGoal),
    bookingsCount: b._count.bookings,
    source: "local" as const,
  }));

  // Tentar buscar barbearias da API externa
  let externalData: any[] = [];
  try {
    const response = await fetch(`${COMERCIO_API_URL}/api/external/v1/shops`, {
      next: { revalidate: 0 }, // Sem cache para admin
    });

    if (response.ok) {
      const data = await response.json();
      externalData = (data.shops || []).map((shop: any) => ({
        id: shop.id,
        name: shop.name,
        address: shop.address || "Endereço não configurado",
        imageUrl: shop.imageUrl,
        isSuspended: shop.isSuspended || false,
        bookingsCount: shop.bookingsCount || 0,
        source: "comercio" as const,
      }));
    }
  } catch (error) {
    console.error("[Admin] Erro ao buscar barbearias externas:", error);
  }

  // Combinar e ordenar por nome
  return [...localData, ...externalData].sort((a, b) => a.name.localeCompare(b.name));
}

export async function toggleBarbershopSuspension(id: string, isSuspended: boolean, source: "local" | "comercio" = "local") {
  if (source === "comercio") {
    // Chamar API externa para suspender
    const response = await fetch(`${COMERCIO_API_URL}/api/external/v1/shops/${id}/suspend`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isSuspended }),
    });
    if (!response.ok) throw new Error("Erro ao suspender barbearia externa");
    return;
  }

  await prisma.barbershop.update({
      where: { id },
      data: { isSuspended }
  });
}

export async function deleteBarbershop(id: string, source: "local" | "comercio" = "local") {
  if (source === "comercio") {
    // Chamar API externa para deletar
    const response = await fetch(`${COMERCIO_API_URL}/api/external/v1/shops/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar barbearia externa");
    return;
  }

  await prisma.barbershop.delete({
      where: { id }
  });
}

// --- Barbeiros Comerciais ---
export async function getAdminBarbers() {
  // Buscar barbeiros locais
  const localBarbers = await prisma.barber.findMany({
    orderBy: { name: "asc" },
    include: {
      Barbershop: { select: { name: true } },
      _count: { select: { Booking: true } }
    }
  });

  const localData = localBarbers.map((b: any) => ({
    id: b.id,
    name: b.name,
    email: b.email,
    phone: b.phone,
    imageUrl: b.imageUrl,
    barbershopName: b.Barbershop?.name || "Sem barbearia",
    bookingsCount: b._count.Booking,
    source: "local" as const,
  }));

  // Buscar barbeiros da API externa (Comercio)
  let externalData: any[] = [];
  try {
    const response = await fetch(`${COMERCIO_API_URL}/api/external/v1/barbers`, {
      next: { revalidate: 0 },
    });

    if (response.ok) {
      const data = await response.json();
      externalData = (data.barbers || []).map((barber: any) => ({
        id: barber.id,
        name: barber.name,
        email: barber.email,
        phone: barber.phone,
        imageUrl: barber.image || barber.imageUrl,
        barbershopName: barber.workplaceName || "Autônomo",
        bookingsCount: barber.bookingsCount || 0,
        isAutonomous: barber.isAutonomous || false,
        accountType: barber.accountType,
        source: "comercio" as const,
      }));
    }
  } catch (error) {
    console.error("[Admin] Erro ao buscar barbeiros externos:", error);
  }

  return [...localData, ...externalData].sort((a, b) => a.name.localeCompare(b.name));
}

export async function deleteBarber(id: string, source: "local" | "comercio" = "local") {
  if (source === "comercio") {
    const response = await fetch(`${COMERCIO_API_URL}/api/external/v1/barbers/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar barbeiro externo");
    return;
  }

  await prisma.barber.delete({
    where: { id }
  });
}

// --- Users ---
export async function getAdminUsers(limit = 50) {
    const users = await prisma.user.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            createdAt: true,
            // Explicitly NOT selecting password
        }
    });
    return users;
}

// --- Financials ---
export async function getAdminFinancials() {
    // Global summary
    const transactions = await prisma.financialTransaction.findMany({
        select: {
            type: true,
            amount: true,
            date: true
        }
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
        if (t.type === "INCOME") totalIncome += Number(t.amount);
        if (t.type === "EXPENSE") totalExpense += Number(t.amount);
    });

    const balance = totalIncome - totalExpense;

    return {
        totalIncome,
        totalExpense,
        balance,
        transactionCount: transactions.length
    };
}

// --- Analytics ---
export async function getAdminAnalytics() {
    const totalBookings = await prisma.booking.count();
    const totalUsers = await prisma.user.count();
    const totalBarbershops = await prisma.barbershop.count();

    const topBarbershops = await prisma.barbershop.findMany({
        take: 5,
        orderBy: {
            bookings: {
                _count: "desc"
            }
        },
        include: {
            _count: { select: { bookings: true } }
        }
    });

    const recentBookings = await prisma.booking.findMany({
        take: 10,
        orderBy: { date: "desc" },
        include: {
            barbershop: { select: { name: true } },
            service: { select: { name: true } }
        }
    });

    return {
        totalBookings,
        totalUsers,
        totalBarbershops,
        topBarbershops: topBarbershops.map((b: any) => ({...b, bookingsCount: b._count.bookings, dailyGoal: Number(b.dailyGoal)})),
        recentBookings
    }
}
