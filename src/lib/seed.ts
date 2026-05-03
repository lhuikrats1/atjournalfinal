// Demo data seed script - generates realistic trading data
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getSession(hour: number): string {
  if (hour < 9 || hour >= 20) return "OVERNIGHT";
  if (hour < 9.5) return "PREMARKET";
  if (hour >= 16) return "AFTERHOURS";
  return "REGULAR";
}

const instruments = ["ES", "NQ", "MES", "MNQ", "CL", "GC"];
const tagOptions = ["Breakout", "Reversal", "Trend", "Scalp", "FOMO", "Plan", "News"];

async function seed() {
  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: "demo@tradingjournal.app" },
    update: {},
    create: {
      id: "user_123",
      email: "demo@tradingjournal.app",
      name: "Demo Trader",
      password: "$2a$10$placeholder", // hashed placeholder
    },
  });

  console.log("Created user:", user.id);

  // Delete existing trades for clean seed
  await prisma.trade.deleteMany({ where: { userId: user.id } });

  const trades = [];
  const now = new Date();

  for (let i = 0; i < 120; i++) {
    const daysAgo = Math.floor(i / 3); // ~3 trades per day
    const hour = randomBetween(8, 16);
    const minute = Math.floor(randomBetween(0, 59));
    
    const entryTime = new Date(now);
    entryTime.setDate(entryTime.getDate() - daysAgo);
    entryTime.setHours(Math.floor(hour), minute, 0, 0);

    const exitTime = new Date(entryTime);
    exitTime.setMinutes(exitTime.getMinutes() + Math.floor(randomBetween(2, 90)));

    const direction = Math.random() > 0.45 ? "LONG" : "SHORT";
    const instrument = instruments[Math.floor(Math.random() * instruments.length)];
    
    // Simulate realistic P&L with slight edge
    let basePnl: number;
    const isWin = Math.random() < (direction === "LONG" ? 0.58 : 0.42);
    
    // Make morning trades more profitable (time-of-day edge)
    const morningBonus = hour < 11 ? 1.3 : (hour > 14 ? 0.7 : 1.0);
    
    if (isWin) {
      basePnl = randomBetween(50, 800) * morningBonus;
    } else {
      basePnl = -randomBetween(30, 600);
    }

    const quantity = Math.floor(randomBetween(1, 5));
    const commission = quantity * 4.50;
    const grossPnl = Math.round(basePnl * 100) / 100;
    const netPnl = Math.round((grossPnl - commission) * 100) / 100;

    const entryPrice = instrument === "ES" ? randomBetween(5200, 5400) :
                       instrument === "NQ" ? randomBetween(18000, 19000) :
                       instrument === "CL" ? randomBetween(70, 85) :
                       instrument === "GC" ? randomBetween(2300, 2500) :
                       randomBetween(5200, 5400);

    const exitPrice = direction === "LONG" 
      ? entryPrice + (grossPnl / (quantity * (instrument.startsWith("M") ? 5 : 50)))
      : entryPrice - (grossPnl / (quantity * (instrument.startsWith("M") ? 5 : 50)));

    const numTags = Math.floor(randomBetween(0, 3));
    const tags: string[] = [];
    for (let t = 0; t < numTags; t++) {
      const tag = tagOptions[Math.floor(Math.random() * tagOptions.length)];
      if (!tags.includes(tag)) tags.push(tag);
    }

    trades.push({
      userId: user.id,
      instrument,
      direction,
      entryPrice: Math.round(entryPrice * 100) / 100,
      exitPrice: Math.round(exitPrice * 100) / 100,
      quantity,
      entryTime,
      exitTime,
      grossPnl,
      commission,
      netPnl,
      tags: JSON.stringify(tags),
      notes: i % 5 === 0 ? "Followed the plan. Good entry." : (i % 7 === 0 ? "FOMO entry, should have waited." : null),
      session: getSession(hour),
      source: "MANUAL",
    });
  }

  for (const trade of trades) {
    await prisma.trade.create({ data: trade });
  }
  console.log(`Seeded ${trades.length} trades`);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
