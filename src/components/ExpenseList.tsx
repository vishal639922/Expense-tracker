import { useState, useMemo } from 'react';
import { 
  Search, 
  Trash2, 
  Calendar, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Tag, 
  BookOpen, 
  X,
  FileSpreadsheet
} from 'lucide-react';
import { Expense, Category, SortField, SortOrder } from '../types';
import CategoryIcon from './CategoryIcon';
import { getCategoryColor, getCategoryBgColor } from '../utils/categories';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  currency: string;
  onRemoveExpense: (id: string) => void;
}

export default function ExpenseList({ 
  expenses, 
  categories, 
  currency, 
  onRemoveExpense 
}: ExpenseListProps) {
  // Filters & Sorting state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('this-month'); // Defaulting to this month for precision
  const [sortBy, setSortBy] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Toggle sorting order or change sort field
  const handleSortChange = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // 1. Filter and Sort logic
  const filteredAndSortedExpenses = useMemo(() => {
    const today = new Date('2026-06-28T08:16:35-07:00');
    
    return expenses
      .filter(item => {
        // Search filter
        const matchesSearch = 
          item.title.toLowerCase().includes(search.toLowerCase()) || 
          (item.notes && item.notes.toLowerCase().includes(search.toLowerCase()));
        
        // Category filter
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

        // Date range filter
        let matchesDate = true;
        const itemDate = new Date(item.date);
        
        if (dateRange === 'this-month') {
          // Check if same year and month as June 2026
          matchesDate = itemDate.getFullYear() === 2026 && itemDate.getMonth() === 5; // Month is 0-indexed, so 5 is June
        } else if (dateRange === 'last-month') {
          // May 2026
          matchesDate = itemDate.getFullYear() === 2026 && itemDate.getMonth() === 4;
        } else if (dateRange === 'last-30-days') {
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 30);
          matchesDate = itemDate >= thirtyDaysAgo && itemDate <= today;
        }

        return matchesSearch && matchesCategory && matchesDate;
      })
      .sort((a, b) => {
        let comparison = 0;
        
        if (sortBy === 'date') {
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sortBy === 'amount') {
          comparison = a.amount - b.amount;
        } else if (sortBy === 'title') {
          comparison = a.title.localeCompare(b.title);
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [expenses, search, selectedCategory, dateRange, sortBy, sortOrder]);

  // Calculations for active list
  const activeTotalSpending = useMemo(() => {
    return filteredAndSortedExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredAndSortedExpenses]);

  // Helper to format date beautifully
  const formatDateString = (dateStr: string) => {
    const d = new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setDateRange('all-time');
  };

  return (
    <div id="expense-list-container" className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col h-full min-h-[480px] transition-all hover:shadow-md">
      
      {/* Header and Controls Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-4 bg-indigo-600 rounded-full block"></span>
            Transaction History
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing {filteredAndSortedExpenses.length} of {expenses.length} records
          </p>
        </div>

        {/* Search Input and Filter Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={14} id="icon-search-input" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search expenses..."
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all placeholder:text-slate-400 font-medium"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
              >
                <X size={12} id="clear-search" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
              showFilters || selectedCategory !== 'all' || dateRange !== 'this-month'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal size={14} id="sliders-icon" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {(showFilters || selectedCategory !== 'all' || dateRange !== 'this-month') && (
        <div id="filters-panel" className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-fadeIn">
          
          {/* Category Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Tag size={10} id="filter-tag" /> Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar size={10} id="filter-calendar" /> Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            >
              <option value="this-month">This Month (June 2026)</option>
              <option value="last-month">Last Month (May 2026)</option>
              <option value="last-30-days">Past 30 Days</option>
              <option value="all-time">All Time</option>
            </select>
          </div>

          {/* Reset Action */}
          <div className="flex items-end justify-between sm:col-span-2 md:col-span-1">
            <span className="text-[10px] text-slate-400 font-medium">
              Query filters applied
            </span>
            <button
              onClick={clearFilters}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

        </div>
      )}

      {/* Sorting Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-2">
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-400 font-semibold mr-2 flex items-center gap-1">
            <ArrowUpDown size={12} id="sort-indicators" /> Sort by:
          </span>
          
          <button
            onClick={() => handleSortChange('date')}
            className={`px-3 py-1.5 text-xs rounded-lg font-bold cursor-pointer transition-colors ${
              sortBy === 'date' 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          
          <button
            onClick={() => handleSortChange('amount')}
            className={`px-3 py-1.5 text-xs rounded-lg font-bold cursor-pointer transition-colors ${
              sortBy === 'amount' 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>

          <button
            onClick={() => handleSortChange('title')}
            className={`px-3 py-1.5 text-xs rounded-lg font-bold cursor-pointer transition-colors ${
              sortBy === 'title' 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>

        {/* Active List Summary Segment */}
        <div className="bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 text-right">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mr-1.5">Query total:</span>
          <span className="text-xs font-bold font-mono text-slate-800">
            {currency}{activeTotalSpending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* The Scrollable List */}
      <div className="flex-1 overflow-y-auto max-h-[380px] pr-1 space-y-2.5">
        {filteredAndSortedExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
            <div className="p-3 bg-slate-50 rounded-full mb-3 text-slate-300">
              <BookOpen size={24} id="empty-list-icon" />
            </div>
            <p className="text-sm font-bold text-slate-700">No expenses found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
              No transactions match your search keywords or active filters. Try resetting the filters.
            </p>
          </div>
        ) : (
          filteredAndSortedExpenses.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-xs transition-all duration-150"
            >
              
              {/* Category Icon and Info */}
              <div className="flex items-center gap-3 overflow-hidden mr-3">
                <div className={`p-2.5 rounded-xl ${getCategoryBgColor(item.category, categories)} flex-shrink-0`}>
                  <CategoryIcon iconName={categories.find(c => c.id === item.category)?.iconName || 'HelpCircle'} size={18} />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-800 truncate" title={item.title}>
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">
                      {formatDateString(item.date)}
                    </span>
                    {item.notes && (
                      <span className="text-[10px] text-slate-500 font-medium truncate max-w-[140px] md:max-w-[200px] flex items-center gap-0.5">
                        <span className="inline-block w-1 h-1 bg-slate-300 rounded-full"></span>
                        {item.notes}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price and Delete Segment */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-slate-900 block">
                    -{currency}{item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-[9px] font-extrabold text-indigo-600 uppercase tracking-wider bg-indigo-50/50 px-2 py-0.5 rounded-full">
                    {categories.find(c => c.id === item.category)?.name || 'Other'}
                  </span>
                </div>

                {/* Delete Trigger Button */}
                <button
                  onClick={() => onRemoveExpense(item.id)}
                  className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Delete log record"
                  title="Remove expense"
                >
                  <Trash2 size={14} id={`trash-icon-${item.id}`} />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
