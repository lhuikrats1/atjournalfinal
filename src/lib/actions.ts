"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTrade(formData: any) {
  try {
    const { 
      instrument, 
      direction, 
      entryPrice, 
      exitPrice, 
      quantity, 
      entryTime, 
      exitTime, 
      grossPnl, 
      commission, 
      netPnl, 
      tags, 
      notes, 
      session,
      userId 
    } = formData;

    const trade = await prisma.trade.create({
      data: {
        userId,
        instrument,
        direction,
        entryPrice: Number(entryPrice),
        exitPrice: exitPrice ? Number(exitPrice) : null,
        quantity: Number(quantity),
        entryTime: new Date(entryTime),
        exitTime: exitTime ? new Date(exitTime) : null,
        grossPnl: Number(grossPnl),
        commission: Number(commission),
        netPnl: Number(netPnl),
        tags: JSON.stringify(tags || []),
        notes,
        session,
        source: "MANUAL"
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/trades");
    
    return { success: true, trade };
  } catch (error) {
    console.error("Failed to create trade:", error);
    return { success: false, error: "Failed to save trade" };
  }
}
