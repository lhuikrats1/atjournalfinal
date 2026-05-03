import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import Papa from "papaparse";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const text = await file.text();
    const { data, errors } = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    if (errors.length > 0) {
      console.error("CSV Parse Errors:", errors);
    }

    const tradesToCreate = [];

    for (const row of data as any[]) {
      const action = row["Action"] || "";
      // Regex to parse TradingView's Action string
      const regex = /Close (short|long) position for symbol (.*?) at price ([\d.]+) for (\d+) units\. Position AVG Price was ([\d.]+)/i;
      const match = action.match(regex);

      if (match) {
        const direction = match[1].toUpperCase() === "SHORT" ? "SHORT" : "LONG";
        const instrument = match[2];
        const exitPrice = parseFloat(match[3]);
        const quantity = parseInt(match[4]);
        const entryPrice = parseFloat(match[5]);
        const netPnl = parseFloat(row["Realized PnL (value)"] || "0");
        const exitTime = new Date(row["Time"]);
        
        // Since TV CSV only gives exit time in this format, we use it for both for now or leave entryTime as exitTime - 1min
        const entryTime = new Date(exitTime.getTime() - 60000); 

        tradesToCreate.push({
          userId: user.id,
          instrument,
          direction,
          entryPrice,
          exitPrice,
          quantity,
          entryTime,
          exitTime,
          grossPnl: netPnl, // We'll assume gross=net for now if not specified
          commission: 0,
          netPnl,
          session: "REGULAR", // Default
          source: "TRADINGVIEW_IMPORT",
        });
      }
    }

    if (tradesToCreate.length === 0) {
      return NextResponse.json({ error: "No valid trades found in CSV" }, { status: 400 });
    }

    const created = await prisma.trade.createMany({
      data: tradesToCreate,
      skipDuplicates: true, // Requires externalId for this to work well, but we can rely on manual checks
    });

    return NextResponse.json({ 
      success: true, 
      count: created.count,
      message: `Successfully imported ${created.count} trades.`
    });

  } catch (error: any) {
    console.error("Import Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
