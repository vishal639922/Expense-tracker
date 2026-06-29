import { useState } from 'react';
import { 
  TrendingUp, 
  AlertCircle, 
  DollarSign, 
  Activity, 
  CalendarDays,
  Flame,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { Expense, Category } from '../types';
import CategoryIcon from './CategoryIcon';
import { getCategoryBgColor } from '../utils/categories';

interface DashboardChartsProps {
  expenses: Expense[];
  categories: Category[];
  budgetLimit: number;
  currency: string;
}

export default function DashboardCharts({ 
  expenses, 
  categories, 
  budgetLimit, 
  currency 
}: DashboardChartsProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);

  // 1. Calculations
  const totalSpending = expenses.reduce((sum, e) => sum + e.amount, 0);
  const percentOfBudget = budgetLimit > 0 ? (totalSpending / budgetLimit) * 100 : 0;

  // Spending by Category
  const categorySpending = categories.map(cat => {
    const amount = expenses
      .filter(e => e.category === cat.id)
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      ...cat,
      amount
    };
  }).filter(cat => cat.amount > 0);

  // Sort descending by amount
  categorySpending.sort((a, b) => b.amount - a.amount);
  const categoryTotalSum = categorySpending.reduce((sum, c) => sum + c.amount, 0);

  // Calculate donut slices
  let accumulatedPercent = 0;
  const donutSlices = categorySpending.map(cat => {
    const percentage = categoryTotalSum > 0 ? (cat.amount / categoryTotalSum) * 100 : 0;
    const offset = accumulatedPercent;
    accumulatedPercent += percentage;
    return {
      ...cat,
      percentage,
      offset
    };
  });

  // Daily Spending Trend (Last 7 days)
  const getLast7DaysData = () => {
    const data = [];
    const today = new Date('2026-06-28T08:16:35-07:00');
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayLabel = d.toLocaleDateString('en-US', { day: 'numeric' });
      
      const amount = expenses
        .filter(e => e.date === dateString)
        .reduce((sum, e) => sum + e.amount, 0);

      data.push({
        dateString,
        label: `${dayName} ${dayLabel}`,
        amount
      });
    }
    return data;
  };

  const last7Days = getLast7DaysData();
  const maxDaySpending = Math.max(...last7Days.map(d => d.amount), 10); // avoid div-by-zero

  // High Spending category
  const topCategory = categorySpending.length > 0 ? categorySpending[0] : null;

  // budget health status
  const budgetStatus = () => {
    if (percentOfBudget >= 100) return { label: 'Over Budget', color: 'text-rose-600 bg-rose-50 border-rose-200', icon: AlertCircle };
    if (percentOfBudget >= 85) return { label: 'Danger Zone', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: AlertCircle };
    if (percentOfBudget >= 50) return { label: 'Moderate Spending', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Activity };
    return { label: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: TrendingDown };
  };
  const StatusIcon = budgetStatus().icon;

  return (
    <div id="dashboard-charts-container" className="space-y-6">
      
      {/* Metrics Row */}
      <div id="metrics-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Spending - Elegant Bento Card */}
        <div id="metric-total-spending" className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full uppercase tracking-wider">Total Expenses</span>
            <span className="p-2 rounded-xl bg-slate-50 text-slate-400">
              <TrendingUp size={18} id="icon-trending-up" />
            </span>
          </div>
          <div className="mt-6">
            <div className="text-4xl font-extrabold tracking-tight text-slate-900 font-sans">
              {currency}{totalSpending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <CalendarDays size={12} id="icon-calendar-days" /> Active period ledger
            </p>
          </div>
        </div>

        {/* Budget Limit Card - High Contrast Indigo Bento Card */}
        <div id="metric-budget-limit" className="bg-indigo-600 text-white p-8 rounded-3xl border border-indigo-700 flex flex-col justify-between shadow-lg shadow-indigo-100 transition-all hover:shadow-xl">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-indigo-500/30 text-indigo-100 text-[10px] font-bold rounded-full uppercase tracking-wider">Monthly Budget</span>
            <span className="p-1.5 rounded-lg bg-indigo-500 text-indigo-100 font-mono text-[10px] font-bold">
              GOAL
            </span>
          </div>
          <div className="mt-6">
            <div className="text-4xl font-extrabold tracking-tight font-sans">
              {currency}{budgetLimit.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs font-medium text-indigo-200 mb-1.5">
                <span>{percentOfBudget.toFixed(0)}% Spent</span>
                <span>Remains: {currency}{(Math.max(0, budgetLimit - totalSpending)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
              </div>
              <div className="w-full bg-indigo-700/50 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    percentOfBudget >= 100 ? 'bg-rose-400' : percentOfBudget >= 85 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, percentOfBudget)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Spending Health - Dark Slate-900 Bento Card */}
        <div id="metric-status" className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col justify-between shadow-md transition-all hover:shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">System Status</span>
            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
              percentOfBudget >= 100 ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 
              percentOfBudget >= 85 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 
              'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
            }`}>
              {budgetStatus().label}
            </span>
          </div>
          <div className="mt-6">
            {topCategory ? (
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Top Sector</span>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/10 text-white">
                    <CategoryIcon iconName={topCategory.iconName} size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{topCategory.name}</h4>
                    <p className="text-xs text-slate-400 font-mono">
                      {currency}{topCategory.amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ({((topCategory.amount / totalSpending) * 100).toFixed(0)}%)
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 text-slate-400 py-3">
                <StatusIcon size={20} id="status-icon" />
                <span className="text-xs font-medium">No activity log records.</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Visual Charts Layout: Two Columns (Desktop) / One Column (Mobile) */}
      <div id="charts-layout" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Breakdown (Donut Chart) - 5 Columns */}
        <div id="chart-category-breakdown" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs lg:col-span-5 flex flex-col transition-all hover:shadow-md">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-6">
            <span className="w-1.5 h-4 bg-indigo-600 rounded-full block"></span>
            Category Split
          </h3>

          {categorySpending.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-slate-400">
              <span className="p-3 bg-slate-50 rounded-full mb-3 text-slate-300">
                <TrendingUp size={24} id="empty-share-icon" />
              </span>
              <p className="text-sm font-medium">No distribution data available.</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6">
              
              {/* Interactive SVG Donut */}
              <div className="relative w-40 h-40 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  {/* Background Track */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="#f8fafc"
                    strokeWidth="3.2"
                  />
                  {/* Colored Segments */}
                  {donutSlices.map((slice, idx) => {
                    const isHovered = hoveredCategory === slice.id;
                    return (
                      <circle
                        key={slice.id}
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="none"
                        stroke={slice.color}
                        strokeWidth={isHovered ? "4" : "3.2"}
                        strokeDasharray={`${slice.percentage} ${100 - slice.percentage}`}
                        strokeDashoffset={100 - slice.offset}
                        className="transition-all duration-200 cursor-pointer"
                        onMouseEnter={() => setHoveredCategory(slice.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      />
                    );
                  })}
                </svg>
                {/* Donut Center Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3">
                  {hoveredCategory ? (
                    (() => {
                      const slice = donutSlices.find(s => s.id === hoveredCategory);
                      return (
                        <>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider line-clamp-1 max-w-[90px]">
                            {slice?.name}
                          </span>
                          <span className="text-sm font-extrabold font-mono text-slate-800 mt-0.5">
                            {slice?.percentage.toFixed(0)}%
                          </span>
                        </>
                      );
                    })()
                  ) : (
                    <>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        Categories
                      </span>
                      <span className="text-xs font-bold text-slate-700 mt-0.5">
                        {categorySpending.length} Total
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Legends List */}
              <div className="flex-1 w-full space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                {categorySpending.map(cat => {
                  const percentage = categoryTotalSum > 0 ? (cat.amount / categoryTotalSum) * 100 : 0;
                  const isHovered = hoveredCategory === cat.id;
                  return (
                    <div 
                      key={cat.id}
                      className={`flex items-center justify-between p-1.5 rounded-xl transition-colors duration-150 ${
                        isHovered ? 'bg-slate-50 font-medium' : ''
                      }`}
                      onMouseEnter={() => setHoveredCategory(cat.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      <div className="flex items-center gap-2 overflow-hidden mr-2">
                        <span 
                          className="w-2 rounded-full h-2 flex-shrink-0" 
                          style={{ backgroundColor: cat.color }} 
                        />
                        <span className="text-xs font-medium text-slate-700 truncate">{cat.name}</span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-bold font-mono text-slate-800">
                          {currency}{cat.amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono block">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </div>

        {/* Weekly/Recent Activity (Bar Chart) - 7 Columns */}
        <div id="chart-spending-trend" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs lg:col-span-7 flex flex-col transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-600 rounded-full block"></span>
              Daily Activity (Last 7 Days)
            </h3>
            <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full font-mono uppercase">
              Current Cycle
            </span>
          </div>

          {expenses.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-slate-400">
              <span className="p-3 bg-slate-50 rounded-full mb-3 text-slate-300">
                <CalendarDays size={24} id="empty-trend-icon" />
              </span>
              <p className="text-sm font-medium">No activity recorded over the past week.</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-end">
              {/* Bars Container */}
              <div className="flex items-end justify-between h-40 gap-3 md:gap-5 px-1">
                {last7Days.map((day, index) => {
                  const barHeightPercent = (day.amount / maxDaySpending) * 100;
                  return (
                    <div key={day.dateString} className="flex-1 flex flex-col items-center group relative">
                      
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] font-mono py-1 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-10 shadow-md">
                        {currency}{day.amount.toFixed(2)}
                      </div>

                      {/* The Bar - changed color to Indigo/Violet to match bento specs */}
                      <div className="w-full bg-slate-50 rounded-t-xl h-full flex items-end overflow-hidden">
                        <div 
                          className={`w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80 ${
                            day.amount > 0 ? 'bg-indigo-600' : 'bg-slate-200'
                          }`}
                          style={{ height: `${Math.max(4, barHeightPercent)}%` }}
                        />
                      </div>

                      {/* X-Axis Label */}
                      <span className="text-[10px] font-bold text-slate-600 mt-2 text-center truncate w-full">
                        {day.label.split(' ')[0]}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {day.label.split(' ')[1]}
                      </span>

                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
