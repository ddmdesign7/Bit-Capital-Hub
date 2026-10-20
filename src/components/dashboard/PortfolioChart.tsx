import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useTrading } from '../../context/TradingContext';
import {
  PortfolioTimeframe,
  PortfolioViewMode,
  generatePortfolioHistory,
  HISTORICAL_PORTFOLIO_MILESTONES,
} from '../../data/portfolioHistory';
import {
  TrendingUp,
  TrendingDown,
  Layers,
  Percent,
  Calendar,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';

interface PortfolioChartProps {
  currentValue?: number;
  cashBalance?: number;
  className?: string;
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({
  currentValue: propCurrentValue,
  cashBalance: propCashBalance,
  className = '',
}) => {
  const { totalPortfolioValue, cashBalanceUSD, theme } = useTrading();

  // Use props if provided, otherwise context
  const liveTotal = propCurrentValue ?? totalPortfolioValue;
  const liveCash = propCashBalance ?? cashBalanceUSD;

  const [timeframe, setTimeframe] = useState<PortfolioTimeframe>('7D');
  const [viewMode, setViewMode] = useState<PortfolioViewMode>('total');
  const [showBaseline, setShowBaseline] = useState<boolean>(true);
  const [showMilestones, setShowMilestones] = useState<boolean>(false);

  // Generate historical data points and period stats based on live numbers
  const { data: chartData, stats } = useMemo(() => {
    return generatePortfolioHistory(liveTotal, liveCash, timeframe);
  }, [liveTotal, liveCash, timeframe]);

  const timeframes: { key: PortfolioTimeframe; label: string }[] = [
    { key: '24H', label: '24H' },
    { key: '7D', label: '7D' },
    { key: '1M', label: '1M' },
    { key: '6M', label: '6M' },
    { key: '1Y', label: '1Y' },
    { key: 'ALL', label: 'ALL' },
  ];

  const viewModes: { key: PortfolioViewMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'total', label: 'Total Value', icon: TrendingUp },
    { key: 'breakdown', label: 'Cash vs Crypto', icon: Layers },
    { key: 'growth', label: 'ROI Growth %', icon: Percent },
  ];

  const isNetPositive = stats.netChange >= 0;
  const strokeColor = isNetPositive ? '#10b981' : '#f43f5e';
  const gradientId = isNetPositive ? 'portfolioGrowthGreen' : 'portfolioGrowthRed';

  // Format currency helper
  const formatUSD = (val: number) => {
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatCompactUSD = (val: number) => {
    if (Math.abs(val) >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (Math.abs(val) >= 1_000) return `$${(val / 1_000).toFixed(1)}k`;
    return `$${val.toFixed(0)}`;
  };

  return (
    <div
      className={`glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/60 shadow-xl relative overflow-hidden flex flex-col justify-between ${className}`}
    >
      {/* Top Header: Title, Live Status & Timeframe Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-slate-300">
              Portfolio Growth & Balance Trends
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">
              {timeframe === 'ALL'
                ? 'Historical Track Record (Since March 2019)'
                : `${timeframe} Trajectory`}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400 font-mono font-medium">Real-Time Valuation</span>
          </div>

          <div className="flex flex-wrap items-baseline gap-3 mt-1.5">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono text-slate-100 tracking-tight">
              {formatUSD(liveTotal)}
            </span>
            <div
              className={`text-xs sm:text-sm font-bold font-mono flex items-center gap-1 ${
                isNetPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isNetPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>
                {isNetPositive ? '+' : ''}{formatUSD(stats.netChange)} ({isNetPositive ? '+' : ''}{stats.netChangePercent.toFixed(2)}%)
              </span>
              <span className="text-slate-500 font-sans font-normal text-xs ml-0.5">
                this period
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls: View mode and timeframe selectors */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Timeframe Selector Button Group */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {timeframes.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTimeframe(key)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none whitespace-nowrap shrink-0 ${
                  timeframe === key
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                aria-label={`Select ${label} timeframe`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sub-bar: Visualization View Tabs & Baseline Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 py-3 border-b border-slate-800/40 text-xs">
        {/* View Mode Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {viewModes.map(({ key, label, icon: Icon }) => {
            const isActive = viewMode === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setViewMode(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 text-xs ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Chart Utility Controls */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <button
            type="button"
            onClick={() => setShowBaseline(!showBaseline)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer text-[11px] font-medium ${
              showBaseline
                ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                : 'border-transparent text-slate-500 hover:text-slate-400'
            }`}
            title="Toggle period start baseline reference"
          >
            <div
              className={`w-2.5 h-2.5 rounded-sm flex items-center justify-center border ${
                showBaseline ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600'
              }`}
            >
              {showBaseline && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>
            <span>Baseline Ref</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMilestones(!showMilestones)}
            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            <Calendar className="w-3 h-3" />
            <span>Milestones</span>
            {showMilestones ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Recharts Area */}
      <div className="h-64 sm:h-72 lg:h-80 w-full mt-3">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'growth' ? (
            <LineChart data={chartData} margin={{ top: 12, right: 12, left: -20, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`}
              />
              <ReferenceLine y={0} stroke="#475569" strokeDasharray="4 4" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload;
                    return (
                      <div className="bg-[#0b1220] border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs z-50">
                        <div className="text-[11px] font-semibold text-slate-400">
                          {dataPoint.fullDate}
                        </div>
                        <div className="text-base font-extrabold font-mono text-emerald-400 mt-0.5">
                          {dataPoint.growthPercent >= 0 ? '+' : ''}{dataPoint.growthPercent.toFixed(2)}%
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300 mt-1">
                          <span>Valuation:</span>
                          <strong>{formatUSD(dataPoint.value)}</strong>
                        </div>
                        {dataPoint.milestone && (
                          <div className="mt-1.5 pt-1.5 border-t border-slate-800 text-[10px] text-amber-300 flex items-center gap-1 font-medium">
                            <Sparkles className="w-3 h-3 shrink-0" />
                            <span>{dataPoint.milestone}</span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="growthPercent"
                stroke={strokeColor}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: strokeColor, stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          ) : viewMode === 'breakdown' ? (
            <AreaChart data={chartData} margin={{ top: 12, right: 12, left: -16, bottom: 4 }}>
              <defs>
                <linearGradient id="cashReserveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="cryptoHoldingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={['dataMin * 0.9', 'dataMax * 1.05']}
                tickFormatter={formatCompactUSD}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload;
                    return (
                      <div className="bg-[#0b1220] border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs min-w-[210px] z-50">
                        <div className="text-[11px] font-semibold text-slate-400">
                          {dataPoint.fullDate}
                        </div>
                        <div className="text-base font-extrabold font-mono text-slate-100 mt-0.5">
                          {formatUSD(dataPoint.value)}
                        </div>
                        <div className="space-y-1 mt-2 pt-2 border-t border-slate-800">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="flex items-center gap-1 text-sky-400">
                              <span className="w-2 h-2 rounded-full bg-sky-400" />
                              Available Cash:
                            </span>
                            <span className="font-mono font-semibold text-slate-200">
                              {formatUSD(dataPoint.cash)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="flex items-center gap-1 text-indigo-400">
                              <span className="w-2 h-2 rounded-full bg-indigo-400" />
                              Crypto Holdings:
                            </span>
                            <span className="font-mono font-semibold text-slate-200">
                              {formatUSD(dataPoint.crypto)}
                            </span>
                          </div>
                        </div>
                        {dataPoint.milestone && (
                          <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-amber-300 flex items-center gap-1 font-medium">
                            <Sparkles className="w-3 h-3 shrink-0" />
                            <span>{dataPoint.milestone}</span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="cash"
                name="Available Cash"
                stackId="1"
                stroke="#38bdf8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#cashReserveGradient)"
              />
              <Area
                type="monotone"
                dataKey="crypto"
                name="Crypto Holdings"
                stackId="1"
                stroke="#818cf8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#cryptoHoldingsGradient)"
              />
            </AreaChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 12, right: 12, left: -16, bottom: 4 }}>
              <defs>
                <linearGradient id="portfolioGrowthGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="portfolioGrowthRed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={['dataMin * 0.96', 'dataMax * 1.04']}
                tickFormatter={formatCompactUSD}
              />
              {showBaseline && (
                <ReferenceLine
                  y={stats.startValue}
                  stroke="#64748b"
                  strokeDasharray="4 4"
                  label={{
                    value: `Open ${formatCompactUSD(stats.startValue)}`,
                    fill: '#94a3b8',
                    fontSize: 10,
                    position: 'insideBottomRight',
                  }}
                />
              )}
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload;
                    const diffFromStart = dataPoint.value - stats.startValue;
                    const isPositiveDiff = diffFromStart >= 0;
                    return (
                      <div className="bg-[#0b1220] border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs min-w-[200px] z-50">
                        <div className="text-[11px] font-semibold text-slate-400">
                          {dataPoint.fullDate}
                        </div>
                        <div className="text-base font-extrabold font-mono text-emerald-400 mt-0.5">
                          {formatUSD(dataPoint.value)}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] font-mono">
                          <span className="text-slate-400">From Open:</span>
                          <span className={`font-semibold ${isPositiveDiff ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isPositiveDiff ? '+' : ''}{formatUSD(diffFromStart)} ({isPositiveDiff ? '+' : ''}{dataPoint.growthPercent.toFixed(2)}%)
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 pt-1.5 border-t border-slate-800">
                          <span>Cash: {formatCompactUSD(dataPoint.cash)}</span>
                          <span>Crypto: {formatCompactUSD(dataPoint.crypto)}</span>
                        </div>
                        {dataPoint.milestone && (
                          <div className="mt-1.5 pt-1.5 border-t border-slate-800 text-[10px] text-amber-300 flex items-center gap-1 font-medium">
                            <Sparkles className="w-3 h-3 shrink-0" />
                            <span>{dataPoint.milestone}</span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
                activeDot={{ r: 5, fill: strokeColor, stroke: '#ffffff', strokeWidth: 2 }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Historical Balance Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4 pt-3 border-t border-slate-800/80 text-xs">
        {/* Period Open */}
        <div className="bg-slate-900/50 rounded-xl p-2.5 border border-slate-800/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Period Open
          </div>
          <div className="font-mono font-bold text-slate-200 mt-0.5">
            {formatUSD(stats.startValue)}
          </div>
        </div>

        {/* Period High */}
        <div className="bg-slate-900/50 rounded-xl p-2.5 border border-slate-800/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Period High
          </div>
          <div className="font-mono font-bold text-emerald-400 mt-0.5">
            {formatUSD(stats.highValue)}
          </div>
        </div>

        {/* Period Low */}
        <div className="bg-slate-900/50 rounded-xl p-2.5 border border-slate-800/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Period Low
          </div>
          <div className="font-mono font-bold text-slate-300 mt-0.5">
            {formatUSD(stats.lowValue)}
          </div>
        </div>

        {/* Liquid Reserves vs Crypto Split */}
        <div className="bg-slate-900/50 rounded-xl p-2.5 border border-slate-800/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Cash / Crypto Split
          </div>
          <div className="font-mono font-bold text-slate-200 mt-0.5 flex items-center gap-1.5">
            <span className="text-sky-400">{stats.cashRatio}%</span>
            <span className="text-slate-600">/</span>
            <span className="text-indigo-400">{stats.cryptoRatio}%</span>
          </div>
        </div>
      </div>

      {/* Expandable Balance Milestones Section */}
      {showMilestones && (
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Historical Growth Milestones (2019 – Present)</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Inception: March 2019
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            {HISTORICAL_PORTFOLIO_MILESTONES.map((ms, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>{ms.date}</span>
                    <span className="font-mono font-bold text-emerald-400">{ms.amount}</span>
                  </div>
                  <div className="font-semibold text-slate-200 text-[11px]">
                    {ms.title}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                    {ms.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
