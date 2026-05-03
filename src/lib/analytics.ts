// Core analytics computation engine
// Processes raw trade data into all the stats needed by dashboards

export interface RawTrade {
  id: string;
  instrument: string;
  direction: string;
  entryPrice: number;
  exitPrice: number | null;
  quantity: number;
  entryTime: Date;
  exitTime: Date | null;
  grossPnl: number;
  commission: number;
  netPnl: number;
  tags: string;
  notes: string | null;
  session: string;
  source: string;
}

export interface CoreStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  grossProfit: number;
  grossLoss: number;
  profitFactor: number;
  expectancy: number;
  totalNetPnl: number;
  avgWin: number;
  avgLoss: number;
  largestWin: number;
  largestLoss: number;
  maxConsecutiveLosses: number;
  currentStreak: number; // positive = wins, negative = losses
  totalCommissions: number;
  commissionPercent: number;
}

export interface DirectionalStats {
  longWinRate: number;
  shortWinRate: number;
  longAvgPnl: number;
  shortAvgPnl: number;
  longTotalPnl: number;
  shortTotalPnl: number;
  longProfitFactor: number;
  shortProfitFactor: number;
  longCount: number;
  shortCount: number;
}

export interface HourlyBucket {
  hour: number;
  label: string;
  pnl: number;
  winRate: number;
  tradeCount: number;
  expectancy: number;
}

export interface DayOfWeekBucket {
  day: number;
  label: string;
  pnl: number;
  winRate: number;
  tradeCount: number;
}

export interface DailyPnl {
  date: string;
  pnl: number;
  cumPnl: number;
  tradeCount: number;
}

export interface MonthlyPnl {
  month: string;
  pnl: number;
  tradeCount: number;
}

export interface InstrumentBreakdown {
  instrument: string;
  pnl: number;
  winRate: number;
  tradeCount: number;
  profitFactor: number;
}

export interface TagBreakdown {
  tag: string;
  pnl: number;
  winRate: number;
  tradeCount: number;
  profitFactor: number;
}

export function computeCoreStats(trades: RawTrade[]): CoreStats {
  const totalTrades = trades.length;
  if (totalTrades === 0) {
    return {
      totalTrades: 0, winningTrades: 0, losingTrades: 0, winRate: 0,
      grossProfit: 0, grossLoss: 0, profitFactor: 0, expectancy: 0,
      totalNetPnl: 0, avgWin: 0, avgLoss: 0, largestWin: 0, largestLoss: 0,
      maxConsecutiveLosses: 0, currentStreak: 0, totalCommissions: 0, commissionPercent: 0,
    };
  }

  const winners = trades.filter(t => t.netPnl > 0);
  const losers = trades.filter(t => t.netPnl <= 0);
  const winningTrades = winners.length;
  const losingTrades = losers.length;
  const winRate = (winningTrades / totalTrades) * 100;

  const grossProfit = winners.reduce((a, t) => a + t.netPnl, 0);
  const grossLoss = Math.abs(losers.reduce((a, t) => a + t.netPnl, 0));
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 99 : 0;

  const totalNetPnl = trades.reduce((a, t) => a + t.netPnl, 0);
  const expectancy = totalNetPnl / totalTrades;

  const avgWin = winningTrades > 0 ? grossProfit / winningTrades : 0;
  const avgLoss = losingTrades > 0 ? grossLoss / losingTrades : 0;

  const largestWin = winners.length > 0 ? Math.max(...winners.map(t => t.netPnl)) : 0;
  const largestLoss = losers.length > 0 ? Math.min(...losers.map(t => t.netPnl)) : 0;

  // Consecutive losses
  let maxConsec = 0;
  let currentConsec = 0;
  let currentStreak = 0;
  const sorted = [...trades].sort((a, b) => new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime());
  
  for (const t of sorted) {
    if (t.netPnl <= 0) {
      currentConsec++;
      maxConsec = Math.max(maxConsec, currentConsec);
    } else {
      currentConsec = 0;
    }
  }

  // Current streak
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (i === sorted.length - 1) {
      currentStreak = sorted[i].netPnl > 0 ? 1 : -1;
    } else {
      const isWin = sorted[i].netPnl > 0;
      if ((currentStreak > 0 && isWin) || (currentStreak < 0 && !isWin)) {
        currentStreak += currentStreak > 0 ? 1 : -1;
      } else {
        break;
      }
    }
  }

  const totalCommissions = trades.reduce((a, t) => a + t.commission, 0);
  const commissionPercent = grossProfit > 0 ? (totalCommissions / grossProfit) * 100 : 0;

  return {
    totalTrades, winningTrades, losingTrades, winRate,
    grossProfit, grossLoss, profitFactor, expectancy,
    totalNetPnl, avgWin, avgLoss, largestWin, largestLoss,
    maxConsecutiveLosses: maxConsec, currentStreak,
    totalCommissions, commissionPercent,
  };
}

export function computeDirectionalStats(trades: RawTrade[]): DirectionalStats {
  const longs = trades.filter(t => t.direction === "LONG");
  const shorts = trades.filter(t => t.direction === "SHORT");

  const longWins = longs.filter(t => t.netPnl > 0);
  const shortWins = shorts.filter(t => t.netPnl > 0);

  const longGrossProfit = longWins.reduce((a, t) => a + t.netPnl, 0);
  const longGrossLoss = Math.abs(longs.filter(t => t.netPnl <= 0).reduce((a, t) => a + t.netPnl, 0));
  const shortGrossProfit = shortWins.reduce((a, t) => a + t.netPnl, 0);
  const shortGrossLoss = Math.abs(shorts.filter(t => t.netPnl <= 0).reduce((a, t) => a + t.netPnl, 0));

  return {
    longWinRate: longs.length > 0 ? (longWins.length / longs.length) * 100 : 0,
    shortWinRate: shorts.length > 0 ? (shortWins.length / shorts.length) * 100 : 0,
    longAvgPnl: longs.length > 0 ? longs.reduce((a, t) => a + t.netPnl, 0) / longs.length : 0,
    shortAvgPnl: shorts.length > 0 ? shorts.reduce((a, t) => a + t.netPnl, 0) / shorts.length : 0,
    longTotalPnl: longs.reduce((a, t) => a + t.netPnl, 0),
    shortTotalPnl: shorts.reduce((a, t) => a + t.netPnl, 0),
    longProfitFactor: longGrossLoss > 0 ? longGrossProfit / longGrossLoss : longGrossProfit > 0 ? 99 : 0,
    shortProfitFactor: shortGrossLoss > 0 ? shortGrossProfit / shortGrossLoss : shortGrossProfit > 0 ? 99 : 0,
    longCount: longs.length,
    shortCount: shorts.length,
  };
}

export function computeHourlyStats(trades: RawTrade[]): HourlyBucket[] {
  const buckets: Map<number, RawTrade[]> = new Map();
  for (let h = 0; h < 24; h++) buckets.set(h, []);

  for (const t of trades) {
    const hour = new Date(t.entryTime).getHours();
    buckets.get(hour)?.push(t);
  }

  return Array.from(buckets.entries()).map(([hour, hTrades]) => {
    const wins = hTrades.filter(t => t.netPnl > 0).length;
    const pnl = hTrades.reduce((a, t) => a + t.netPnl, 0);
    return {
      hour,
      label: `${hour.toString().padStart(2, "0")}:00`,
      pnl: Math.round(pnl * 100) / 100,
      winRate: hTrades.length > 0 ? Math.round((wins / hTrades.length) * 100) : 0,
      tradeCount: hTrades.length,
      expectancy: hTrades.length > 0 ? Math.round((pnl / hTrades.length) * 100) / 100 : 0,
    };
  }).filter(b => b.tradeCount > 0);
}

export function computeDayOfWeekStats(trades: RawTrade[]): DayOfWeekBucket[] {
  const labels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const buckets: Map<number, RawTrade[]> = new Map();
  for (let d = 0; d < 7; d++) buckets.set(d, []);

  for (const t of trades) {
    const day = new Date(t.entryTime).getDay();
    buckets.get(day)?.push(t);
  }

  return Array.from(buckets.entries()).map(([day, dTrades]) => {
    const wins = dTrades.filter(t => t.netPnl > 0).length;
    return {
      day,
      label: labels[day],
      pnl: Math.round(dTrades.reduce((a, t) => a + t.netPnl, 0) * 100) / 100,
      winRate: dTrades.length > 0 ? Math.round((wins / dTrades.length) * 100) : 0,
      tradeCount: dTrades.length,
    };
  }).filter(b => b.tradeCount > 0);
}

export function computeDailyPnl(trades: RawTrade[]): DailyPnl[] {
  const sorted = [...trades].sort((a, b) => new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime());
  const byDay: Map<string, number[]> = new Map();

  for (const t of sorted) {
    const date = new Date(t.entryTime).toISOString().slice(0, 10);
    if (!byDay.has(date)) byDay.set(date, []);
    byDay.get(date)!.push(t.netPnl);
  }

  let cumPnl = 0;
  return Array.from(byDay.entries()).map(([date, pnls]) => {
    const dayPnl = pnls.reduce((a, b) => a + b, 0);
    cumPnl += dayPnl;
    return {
      date,
      pnl: Math.round(dayPnl * 100) / 100,
      cumPnl: Math.round(cumPnl * 100) / 100,
      tradeCount: pnls.length,
    };
  });
}

export function computeMonthlyPnl(trades: RawTrade[]): MonthlyPnl[] {
  const byMonth: Map<string, { pnl: number; count: number }> = new Map();

  for (const t of trades) {
    const month = new Date(t.entryTime).toISOString().slice(0, 7);
    if (!byMonth.has(month)) byMonth.set(month, { pnl: 0, count: 0 });
    const m = byMonth.get(month)!;
    m.pnl += t.netPnl;
    m.count++;
  }

  return Array.from(byMonth.entries()).map(([month, data]) => ({
    month,
    pnl: Math.round(data.pnl * 100) / 100,
    tradeCount: data.count,
  }));
}

export function computeInstrumentBreakdown(trades: RawTrade[]): InstrumentBreakdown[] {
  const byInst: Map<string, RawTrade[]> = new Map();
  for (const t of trades) {
    if (!byInst.has(t.instrument)) byInst.set(t.instrument, []);
    byInst.get(t.instrument)!.push(t);
  }

  return Array.from(byInst.entries()).map(([instrument, iTrades]) => {
    const wins = iTrades.filter(t => t.netPnl > 0);
    const gp = wins.reduce((a, t) => a + t.netPnl, 0);
    const gl = Math.abs(iTrades.filter(t => t.netPnl <= 0).reduce((a, t) => a + t.netPnl, 0));
    return {
      instrument,
      pnl: Math.round(iTrades.reduce((a, t) => a + t.netPnl, 0) * 100) / 100,
      winRate: Math.round((wins.length / iTrades.length) * 100),
      tradeCount: iTrades.length,
      profitFactor: gl > 0 ? Math.round((gp / gl) * 100) / 100 : gp > 0 ? 99 : 0,
    };
  }).sort((a, b) => b.pnl - a.pnl);
}

export function computeTagBreakdown(trades: RawTrade[]): TagBreakdown[] {
  const byTag: Map<string, RawTrade[]> = new Map();
  for (const t of trades) {
    const tags: string[] = JSON.parse(t.tags || "[]");
    for (const tag of tags) {
      if (!byTag.has(tag)) byTag.set(tag, []);
      byTag.get(tag)!.push(t);
    }
  }

  return Array.from(byTag.entries()).map(([tag, tTrades]) => {
    const wins = tTrades.filter(t => t.netPnl > 0);
    const gp = wins.reduce((a, t) => a + t.netPnl, 0);
    const gl = Math.abs(tTrades.filter(t => t.netPnl <= 0).reduce((a, t) => a + t.netPnl, 0));
    return {
      tag,
      pnl: Math.round(tTrades.reduce((a, t) => a + t.netPnl, 0) * 100) / 100,
      winRate: Math.round((wins.length / tTrades.length) * 100),
      tradeCount: tTrades.length,
      profitFactor: gl > 0 ? Math.round((gp / gl) * 100) / 100 : gp > 0 ? 99 : 0,
    };
  }).sort((a, b) => b.pnl - a.pnl);
}

export function computeMaxDrawdown(trades: RawTrade[]): { maxDrawdown: number; maxDrawdownPercent: number; peak: number } {
  const daily = computeDailyPnl(trades);
  let peak = 0;
  let maxDD = 0;

  for (const d of daily) {
    if (d.cumPnl > peak) peak = d.cumPnl;
    const dd = peak - d.cumPnl;
    if (dd > maxDD) maxDD = dd;
  }

  return {
    maxDrawdown: Math.round(maxDD * 100) / 100,
    maxDrawdownPercent: peak > 0 ? Math.round((maxDD / peak) * 10000) / 100 : 0,
    peak: Math.round(peak * 100) / 100,
  };
}

// Find the best/worst 2-hour trading window by expectancy
export function computeBestWorstWindow(trades: RawTrade[]): { best: { start: number; end: number; expectancy: number }; worst: { start: number; end: number; expectancy: number } } {
  const hourly = computeHourlyStats(trades);
  let bestExp = -Infinity, worstExp = Infinity;
  let best = { start: 9, end: 11, expectancy: 0 };
  let worst = { start: 14, end: 16, expectancy: 0 };

  for (let h = 0; h < 23; h++) {
    const h1 = hourly.find(b => b.hour === h);
    const h2 = hourly.find(b => b.hour === h + 1);
    if (!h1 || !h2 || h1.tradeCount + h2.tradeCount < 3) continue;

    const totalPnl = h1.pnl + h2.pnl;
    const totalCount = h1.tradeCount + h2.tradeCount;
    const exp = totalPnl / totalCount;

    if (exp > bestExp) { bestExp = exp; best = { start: h, end: h + 2, expectancy: Math.round(exp * 100) / 100 }; }
    if (exp < worstExp) { worstExp = exp; worst = { start: h, end: h + 2, expectancy: Math.round(exp * 100) / 100 }; }
  }

  return { best, worst };
}

// Generate rule-based coaching tips
export function generateCoachingTips(trades: RawTrade[]): string[] {
  const tips: string[] = [];
  const stats = computeCoreStats(trades);
  const dir = computeDirectionalStats(trades);
  const hourly = computeHourlyStats(trades);
  const windows = computeBestWorstWindow(trades);
  const tags = computeTagBreakdown(trades);

  if (stats.totalTrades === 0) return ["Start logging trades to receive personalized coaching tips."];

  // Win Rate Alert
  if (stats.winRate < 40) {
    tips.push(`⚠️ Your win rate is ${stats.winRate.toFixed(1)}%, below the break-even threshold for a 1:1 R:R. Review your setups or tighten entry criteria.`);
  }

  // Consecutive losses
  if (stats.maxConsecutiveLosses > 3) {
    tips.push(`🔴 You had a streak of ${stats.maxConsecutiveLosses} consecutive losses. Consider implementing a daily loss limit or reducing size after 3 losses.`);
  }

  // Long/Short Bias
  if (dir.longCount >= 5 && dir.shortCount >= 5) {
    if (dir.longWinRate - dir.shortWinRate > 15) {
      tips.push(`📊 Your long WR is ${dir.longWinRate.toFixed(0)}% vs ${dir.shortWinRate.toFixed(0)}% on shorts. Consider focusing on long setups or reviewing your short thesis.`);
    } else if (dir.shortWinRate - dir.longWinRate > 15) {
      tips.push(`📊 Your short WR is ${dir.shortWinRate.toFixed(0)}% vs ${dir.longWinRate.toFixed(0)}% on longs. You may have a short-side edge — lean into it.`);
    }
  }

  // Stop time recommendation
  const bestHours = hourly.filter(h => h.tradeCount >= 3).sort((a, b) => b.expectancy - a.expectancy);
  const worstHours = hourly.filter(h => h.tradeCount >= 3).sort((a, b) => a.expectancy - b.expectancy);
  
  if (bestHours.length > 0 && worstHours.length > 0 && worstHours[0].expectancy < 0) {
    tips.push(`⏰ Your best hour is ${bestHours[0].label} (${bestHours[0].winRate}% WR, $${bestHours[0].expectancy}/trade). Your worst is ${worstHours[0].label} (${worstHours[0].winRate}% WR). Consider stopping before ${worstHours[0].label}.`);
  }

  // Best trading window
  if (windows.best.expectancy > 0) {
    tips.push(`🟢 Your best 2-hour window is ${windows.best.start}:00–${windows.best.end}:00 with $${windows.best.expectancy} expectancy per trade. Focus your energy here.`);
  }

  // Commission drain
  if (stats.commissionPercent > 20) {
    tips.push(`💸 Commissions are eating ${stats.commissionPercent.toFixed(0)}% of your gross profit ($${stats.totalCommissions.toFixed(0)} total). Consider reducing trade frequency.`);
  }

  // Best setup tag
  if (tags.length > 0) {
    const bestTag = tags.filter(t => t.tradeCount >= 3).sort((a, b) => b.profitFactor - a.profitFactor)[0];
    if (bestTag && bestTag.profitFactor > 1.5) {
      tips.push(`🏆 Your "${bestTag.tag}" trades have a ${bestTag.winRate}% WR and ${bestTag.profitFactor} PF — your best setup. Take more of these.`);
    }
  }

  // Drawdown warning
  const dd = computeMaxDrawdown(trades);
  if (dd.maxDrawdownPercent > 10) {
    tips.push(`📉 Your max drawdown reached ${dd.maxDrawdownPercent}% ($${dd.maxDrawdown}). Consider reducing size by 50% until you recover the equity high.`);
  }

  // Positive reinforcement
  if (stats.profitFactor > 1.5 && stats.totalTrades > 20) {
    tips.push(`✅ Your profit factor is ${stats.profitFactor.toFixed(2)} — solid edge. Keep executing your process.`);
  }

  return tips.length > 0 ? tips : ["Looking good! Keep logging trades to unlock deeper insights."];
}
