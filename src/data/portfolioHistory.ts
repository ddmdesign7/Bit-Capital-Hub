export type PortfolioTimeframe = '24H' | '7D' | '1M' | '6M' | '1Y' | 'ALL';
export type PortfolioViewMode = 'total' | 'breakdown' | 'growth';

export interface PortfolioDataPoint {
  time: string;
  fullDate: string;
  value: number;
  cash: number;
  crypto: number;
  growthPercent: number;
  growthValue: number;
  milestone?: string;
}

export interface PortfolioPeriodStats {
  startValue: number;
  endValue: number;
  netChange: number;
  netChangePercent: number;
  highValue: number;
  highDate: string;
  lowValue: number;
  lowDate: string;
  avgValue: number;
  cashRatio: number;
  cryptoRatio: number;
}

interface TimeframeTemplatePoint {
  time: string;
  fullDate: string;
  valueRatio: number; // ratio relative to target final value (1.0 = final value)
  cashRatio: number;  // ratio of total that is cash
  milestone?: string;
}

const TIMEFRAME_TEMPLATES: Record<PortfolioTimeframe, TimeframeTemplatePoint[]> = {
  '24H': [
    { time: '00:00', fullDate: 'Today 00:00 UTC', valueRatio: 0.982, cashRatio: 0.44 },
    { time: '02:00', fullDate: 'Today 02:00 UTC', valueRatio: 0.985, cashRatio: 0.44 },
    { time: '04:00', fullDate: 'Today 04:00 UTC', valueRatio: 0.981, cashRatio: 0.44 },
    { time: '06:00', fullDate: 'Today 06:00 UTC', valueRatio: 0.987, cashRatio: 0.44 },
    { time: '08:00', fullDate: 'Today 08:00 UTC', valueRatio: 0.991, cashRatio: 0.44 },
    { time: '10:00', fullDate: 'Today 10:00 UTC', valueRatio: 0.988, cashRatio: 0.44 },
    { time: '12:00', fullDate: 'Today 12:00 UTC', valueRatio: 0.994, cashRatio: 0.44 },
    { time: '14:00', fullDate: 'Today 14:00 UTC', valueRatio: 0.992, cashRatio: 0.44 },
    { time: '16:00', fullDate: 'Today 16:00 UTC', valueRatio: 0.996, cashRatio: 0.44 },
    { time: '18:00', fullDate: 'Today 18:00 UTC', valueRatio: 0.998, cashRatio: 0.44 },
    { time: '20:00', fullDate: 'Today 20:00 UTC', valueRatio: 0.995, cashRatio: 0.44 },
    { time: '22:00', fullDate: 'Today 22:00 UTC', valueRatio: 0.999, cashRatio: 0.44 },
    { time: 'Now', fullDate: 'Current Real-Time Tick', valueRatio: 1.0, cashRatio: 0.44 },
  ],
  '7D': [
    { time: 'Day -6', fullDate: '6 Days Ago', valueRatio: 0.942, cashRatio: 0.46 },
    { time: 'Day -5', fullDate: '5 Days Ago', valueRatio: 0.951, cashRatio: 0.45 },
    { time: 'Day -4', fullDate: '4 Days Ago', valueRatio: 0.948, cashRatio: 0.45 },
    { time: 'Day -3', fullDate: '3 Days Ago', valueRatio: 0.965, cashRatio: 0.44 },
    { time: 'Day -2', fullDate: '2 Days Ago', valueRatio: 0.978, cashRatio: 0.44 },
    { time: 'Yesterday', fullDate: 'Yesterday', valueRatio: 0.989, cashRatio: 0.44 },
    { time: 'Today', fullDate: 'Current Valuation', valueRatio: 1.0, cashRatio: 0.44 },
  ],
  '1M': [
    { time: 'Day 1', fullDate: '30 Days Ago', valueRatio: 0.885, cashRatio: 0.48 },
    { time: 'Day 4', fullDate: '27 Days Ago', valueRatio: 0.892, cashRatio: 0.47 },
    { time: 'Day 7', fullDate: '24 Days Ago', valueRatio: 0.908, cashRatio: 0.47 },
    { time: 'Day 10', fullDate: '21 Days Ago', valueRatio: 0.895, cashRatio: 0.46 },
    { time: 'Day 13', fullDate: '18 Days Ago', valueRatio: 0.921, cashRatio: 0.45 },
    { time: 'Day 16', fullDate: '15 Days Ago', valueRatio: 0.935, cashRatio: 0.45 },
    { time: 'Day 19', fullDate: '12 Days Ago', valueRatio: 0.928, cashRatio: 0.45 },
    { time: 'Day 22', fullDate: '9 Days Ago', valueRatio: 0.954, cashRatio: 0.44 },
    { time: 'Day 25', fullDate: '6 Days Ago', valueRatio: 0.968, cashRatio: 0.44 },
    { time: 'Day 28', fullDate: '3 Days Ago', valueRatio: 0.985, cashRatio: 0.44 },
    { time: 'Day 30', fullDate: 'Current Valuation', valueRatio: 1.0, cashRatio: 0.44 },
  ],
  '6M': [
    { time: 'Month -5', fullDate: '5 Months Ago', valueRatio: 0.765, cashRatio: 0.52 },
    { time: 'Month -4.5', fullDate: '4.5 Months Ago', valueRatio: 0.789, cashRatio: 0.51 },
    { time: 'Month -4', fullDate: '4 Months Ago', valueRatio: 0.812, cashRatio: 0.50 },
    { time: 'Month -3.5', fullDate: '3.5 Months Ago', valueRatio: 0.805, cashRatio: 0.49 },
    { time: 'Month -3', fullDate: '3 Months Ago', valueRatio: 0.845, cashRatio: 0.48 },
    { time: 'Month -2.5', fullDate: '2.5 Months Ago', valueRatio: 0.872, cashRatio: 0.47 },
    { time: 'Month -2', fullDate: '2 Months Ago', valueRatio: 0.898, cashRatio: 0.46 },
    { time: 'Month -1.5', fullDate: '1.5 Months Ago', valueRatio: 0.925, cashRatio: 0.45 },
    { time: 'Month -1', fullDate: '1 Month Ago', valueRatio: 0.958, cashRatio: 0.45 },
    { time: 'Current', fullDate: 'Current Valuation', valueRatio: 1.0, cashRatio: 0.44 },
  ],
  '1Y': [
    { time: 'Q4 25', fullDate: '12 Months Ago', valueRatio: 0.62, cashRatio: 0.55 },
    { time: 'Nov 25', fullDate: '11 Months Ago', valueRatio: 0.66, cashRatio: 0.54 },
    { time: 'Dec 25', fullDate: '10 Months Ago', valueRatio: 0.71, cashRatio: 0.52 },
    { time: 'Q1 26', fullDate: '9 Months Ago', valueRatio: 0.75, cashRatio: 0.50 },
    { time: 'Feb 26', fullDate: '8 Months Ago', valueRatio: 0.79, cashRatio: 0.49 },
    { time: 'Mar 26', fullDate: '7 Months Ago', valueRatio: 0.82, cashRatio: 0.48 },
    { time: 'Q2 26', fullDate: '6 Months Ago', valueRatio: 0.86, cashRatio: 0.47 },
    { time: 'May 26', fullDate: '5 Months Ago', valueRatio: 0.89, cashRatio: 0.46 },
    { time: 'Jun 26', fullDate: '4 Months Ago', valueRatio: 0.91, cashRatio: 0.45 },
    { time: 'Q3 26', fullDate: '3 Months Ago', valueRatio: 0.94, cashRatio: 0.45 },
    { time: 'Aug 26', fullDate: '2 Months Ago', valueRatio: 0.97, cashRatio: 0.44 },
    { time: 'Current', fullDate: 'Current Valuation', valueRatio: 1.0, cashRatio: 0.44 },
  ],
  'ALL': [
    { time: 'Mar 2019', fullDate: 'March 8, 2019', valueRatio: 0.046, cashRatio: 0.90, milestone: 'Initial Account Deposit ($5,000)' },
    { time: 'Apr 2019', fullDate: 'April 2, 2019', valueRatio: 0.108, cashRatio: 0.80, milestone: 'Yield Realized & $11.75k Withdrawn' },
    { time: 'Oct 2019', fullDate: 'October 29, 2019', valueRatio: 0.145, cashRatio: 0.70, milestone: '$4,000 Capital Allocation' },
    { time: 'Jan 2020', fullDate: 'January 6, 2020', valueRatio: 0.195, cashRatio: 0.65 },
    { time: 'Jul 2020', fullDate: 'July 14, 2020', valueRatio: 0.285, cashRatio: 0.60, milestone: '$7,000 Expansion Deposit' },
    { time: 'Feb 2021', fullDate: 'February 10, 2021', valueRatio: 0.440, cashRatio: 0.55 },
    { time: 'Sep 2021', fullDate: 'September 20, 2021', valueRatio: 0.685, cashRatio: 0.50, milestone: '$10,000 Major Allocation' },
    { time: 'Oct 2021', fullDate: 'October 24, 2021', valueRatio: 0.520, cashRatio: 0.52, milestone: '$31,000 Profit Distribution' },
    { time: 'Apr 2022', fullDate: 'April 12, 2022', valueRatio: 0.480, cashRatio: 0.50, milestone: '$4,000 Investment Deposit' },
    { time: 'Jul 2022', fullDate: 'July 7, 2022', valueRatio: 0.560, cashRatio: 0.48, milestone: '$12,000 Compounding Reinvestment' },
    { time: '2023', fullDate: 'December 2023', valueRatio: 0.680, cashRatio: 0.46 },
    { time: '2024', fullDate: 'December 2024', valueRatio: 0.810, cashRatio: 0.45 },
    { time: '2025', fullDate: 'December 2025', valueRatio: 0.920, cashRatio: 0.44 },
    { time: '2026', fullDate: 'Present Live Valuation', valueRatio: 1.0, cashRatio: 0.44, milestone: 'All-Time High Net Balance' },
  ]
};

export function generatePortfolioHistory(
  targetTotalValue: number,
  targetCashValue: number,
  timeframe: PortfolioTimeframe
): { data: PortfolioDataPoint[]; stats: PortfolioPeriodStats } {
  const safeTotal = Math.max(100, targetTotalValue);
  const safeCash = Math.max(0, Math.min(targetCashValue, safeTotal));
  const currentCashRatio = safeCash / safeTotal;

  const template = TIMEFRAME_TEMPLATES[timeframe] || TIMEFRAME_TEMPLATES['7D'];
  const startTemplatePoint = template[0];
  const startValueCalculated = Number((safeTotal * startTemplatePoint.valueRatio).toFixed(2));

  let highValue = -Infinity;
  let highDate = '';
  let lowValue = Infinity;
  let lowDate = '';
  let sumValue = 0;

  const data: PortfolioDataPoint[] = template.map((pt, idx) => {
    const isLast = idx === template.length - 1;
    const value = isLast ? safeTotal : Number((safeTotal * pt.valueRatio).toFixed(2));
    
    // Scale cash smoothly toward current live cash balance
    const cashPortion = isLast 
      ? safeCash 
      : Number((value * (pt.cashRatio * 0.5 + currentCashRatio * 0.5)).toFixed(2));
    
    const cryptoPortion = Number((Math.max(0, value - cashPortion)).toFixed(2));
    const growthValue = Number((value - startValueCalculated).toFixed(2));
    const growthPercent = startValueCalculated > 0 
      ? Number(((growthValue / startValueCalculated) * 100).toFixed(2)) 
      : 0;

    if (value > highValue) {
      highValue = value;
      highDate = pt.fullDate;
    }
    if (value < lowValue) {
      lowValue = value;
      lowDate = pt.fullDate;
    }
    sumValue += value;

    return {
      time: pt.time,
      fullDate: pt.fullDate,
      value,
      cash: cashPortion,
      crypto: cryptoPortion,
      growthPercent,
      growthValue,
      milestone: pt.milestone,
    };
  });

  const startValue = data[0]?.value || safeTotal;
  const endValue = safeTotal;
  const netChange = Number((endValue - startValue).toFixed(2));
  const netChangePercent = startValue > 0 ? Number(((netChange / startValue) * 100).toFixed(2)) : 0;
  const avgValue = Number((sumValue / data.length).toFixed(2));

  const stats: PortfolioPeriodStats = {
    startValue,
    endValue,
    netChange,
    netChangePercent,
    highValue: highValue === -Infinity ? safeTotal : highValue,
    highDate,
    lowValue: lowValue === Infinity ? safeTotal : lowValue,
    lowDate,
    avgValue,
    cashRatio: Number(((safeCash / safeTotal) * 100).toFixed(1)),
    cryptoRatio: Number((((safeTotal - safeCash) / safeTotal) * 100).toFixed(1)),
  };

  return { data, stats };
}

export const HISTORICAL_PORTFOLIO_MILESTONES = [
  {
    date: 'March 8, 2019',
    title: 'Initial Account Deposit',
    amount: '$5,000.00',
    type: 'deposit',
    description: 'First initial investment capital credited via TRC20 network',
  },
  {
    date: 'April 2, 2019',
    title: 'First Profit Realization',
    amount: '$11,750.00',
    type: 'withdraw',
    description: 'Initial yield and principal withdrawal following high-yield trade cycle',
  },
  {
    date: 'October 24, 2021',
    title: 'Major Bull Cycle Distribution',
    amount: '$31,000.00',
    type: 'withdraw',
    description: 'Capital profit extraction at 2021 market cycle peak',
  },
  {
    date: 'July 7, 2022',
    title: 'Capital Compounding Reinvestment',
    amount: '$12,000.00',
    type: 'reinvestment',
    description: 'Automated profit compounding reinvested into core portfolio assets',
  },
  {
    date: '2025–2026',
    title: 'All-Time High Valuation',
    amount: 'Consolidated Growth',
    type: 'growth',
    description: 'Multi-asset expansion across Bitcoin, Ethereum, Solana and Tier-1 holdings',
  },
];
