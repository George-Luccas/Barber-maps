"use server";

import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

// --- Barbershops ---
export async function getAdminBarbershops() {
  const barbershops = await prisma.barbershop.findMany({
    orderBy: { name: "asc" },
    include: {
        _count: {
            select: { bookings: true }
        }
    }
  });

  return barbershops.map((b: any) => ({
    ...b,
    dailyGoal: Number(b.dailyGoal), // Convert Decimal
    bookingsCount: b._count.bookings
  }));
}

export async function toggleBarbershopSuspension(id: string, isSuspended: boolean) {
    await prisma.barbershop.update({
        where: { id },
        data: { isSuspended }
    });
}

export async function deleteBarbershop(id: string) {
    await prisma.barbershop.delete({
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
