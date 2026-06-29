import { useState, useEffect } from 'react';
import { 
  Plus, 
  Settings, 
  Trash2, 
  LineChart, 
  Sparkles, 
  Wallet, 
  Layers, 
  Check, 
  AlertTriangle,
  History,
  TrendingDown,
  Info
} from 'lucide-react';
import { Expense, Category, Budget } from './types';
import { DEFAULT_CATEGORIES } from './utils/categories';
import { SAMPLE_EXPENSES } from './utils/sampleData';

import DashboardCharts from './components/DashboardCharts';
import AddExpenseForm from './components/AddExpenseForm';
import ExpenseList from './components/ExpenseList';
import BudgetSettings from './components/BudgetSettings';

export default function App() {
  // 1. Core States
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<Budget>({ limit: 2500, currency: '$' });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'add' | 'settings'>('dashboard');
  const [isUsingSamples, setIsUsingSamples] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 2. Initialize and Load from localStorage
  useEffect(() => {
    // Load expenses
    const storedExpenses = localStorage.getItem('expense_tracker_records');
    if (storedExpenses) {
      try {
        setExpenses(JSON.parse(storedExpenses));
      } catch (e) {
        console.error('Error parsing stored expenses:', e);
        setExpenses([]);
      }
    } else {
      // If first-time user, load SAMPLE_EXPENSES so the UI isn't a dry blank slate
      setExpenses(SAMPLE_EXPENSES);
      setIsUsingSamples(true);
      localStorage.setItem('expense_tracker_records', JSON.stringify(SAMPLE_EXPENSES));
    }

    // Load budget settings
    const storedBudget = localStorage.getItem('expense_tracker_budget');
    if (storedBudget) {
      try {
        setBudget(JSON.parse(storedBudget));
      } catch (e) {
        console.error('Error parsing stored budget:', e);
      }
    } else {
      localStorage.setItem('expense_tracker_budget', JSON.stringify({ limit: 2500, currency: '$' }));
    }

    setIsInitialized(true);
  }, []);

  // 3. Persistent State Hooks
  const saveExpenses = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    localStorage.setItem('expense_tracker_records', JSON.stringify(newExpenses));
  };

  const saveBudget = (newBudget: Budget) => {
    setBudget(newBudget);
    localStorage.setItem('expense_tracker_budget', JSON.stringify(newBudget));
  };

  // 4. Database Operations
  const handleAddExpense = (newExpenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...newExpenseData,
      id: `exp-${Math.random().toString(36).substr(2, 9)}`
    };
    const updated = [newExpense, ...expenses];
    saveExpenses(updated);
    
    // If they add an expense, clear the sample data notice banner (they are active now)
    if (isUsingSamples) {
      setIsUsingSamples(false);
    }
  };

  const handleRemoveExpense = (id: string) => {
    const updated = expenses.filter(e => e.id !== id);
    saveExpenses(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to completely wipe out your transaction history? This cannot be undone.')) {
      saveExpenses([]);
      setIsUsingSamples(false);
    }
  };

  const handleLoadSamples = () => {
    saveExpenses(SAMPLE_EXPENSES);
    setIsUsingSamples(true);
  };

  const handleDismissSampleBanner = () => {
    setIsUsingSamples(false);
  };

  // Export database as JSON file
  const handleExportData = () => {
    const dataStr = JSON.stringify(expenses, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import database from JSON backup file
  const handleImportData = (expensesJson: string): boolean => {
    try {
      const parsed = JSON.parse(expensesJson);
      
      // Basic type checks to prevent database corruptions
      if (Array.isArray(parsed)) {
        const isValid = parsed.every(item => 
          typeof item.title === 'string' &&
          typeof item.amount === 'number' &&
          typeof item.category === 'string' &&
          typeof item.date === 'string'
        );

        if (isValid) {
          saveExpenses(parsed);
          setIsUsingSamples(false);
          return true;
        }
      }
      return false;
    } catch (e) {
      console.error('Error importing backup:', e);
      return false;
    }
  };

  if (!isInitialized) {
    return (
      <div id="loader-fallback" className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mb-2"></div>
        <span className="text-xs font-semibold uppercase tracking-wider">Starting Wallet Ledger...</span>
      </div>
    );
  }

  return (
    <div id="app-wrapper" className="min-h-screen bg-[#f8fafc] text-slate-900 pb-12">
      
      {/* Top Professional Header */}
      <header id="main-header" className="sticky top-0 bg-white border-b border-slate-200 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand Segment - Bento Styled */}
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-100 flex items-center justify-center">
              <Wallet size={18} id="header-wallet-icon" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-slate-950 flex items-center gap-1.5 leading-none">
                Bento Ledger
              </h1>
              <span className="text-[9px] text-indigo-600 font-bold font-mono tracking-wider block mt-1 uppercase">
                Secure Client Console
              </span>
            </div>
          </div>

          {/* Current Month Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Accounting Cycle</span>
              <span className="text-xs font-bold text-slate-800">June 2026</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block animate-pulse" title="System synced locally"></span>
          </div>

        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Optional: Onboarding Sample Banner */}
        {isUsingSamples && (
          <div id="sample-data-onboarding" className="mb-6 p-5 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fadeIn border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-white/10 rounded-xl text-amber-400 flex items-center justify-center flex-shrink-0">
                <Sparkles size={16} id="onboarding-sparkles" />
              </span>
              <div>
                <h4 className="text-xs font-bold">Loaded with Interactive Demonstration Data</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  We have populated your dashboard with some mock expenses for June 2026. This lets you inspect charts and metrics immediately!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  saveExpenses([]);
                  setIsUsingSamples(false);
                }}
                className="text-[10px] uppercase tracking-wider bg-rose-600 hover:bg-rose-700 font-extrabold px-3.5 py-2 rounded-xl transition-colors cursor-pointer text-center flex-1 sm:flex-none"
              >
                Clear Mock Data
              </button>
              <button
                onClick={handleDismissSampleBanner}
                className="text-[10px] uppercase tracking-wider bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-extrabold px-3.5 py-2 rounded-xl transition-colors cursor-pointer text-center flex-1 sm:flex-none"
              >
                Keep & Edit
              </button>
            </div>
          </div>
        )}

        {/* Responsive Dual Column / Single Column Layout */}
        <div id="app-grid-layout" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Column A (Left-Side Nav Controls & Logs Input) - 4 Columns on Desktop */}
          <div id="sidebar-controls" className="lg:col-span-4 space-y-6">
            
            {/* Nav Cards */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-3">
                Navigation Rail
              </span>
              <nav className="space-y-1.5">
                
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <LineChart size={15} id="tab-dashboard-icon" />
                  <span>Overview Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    activeTab === 'history'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <History size={15} id="tab-history-icon" />
                  <span>Transaction Ledger</span>
                </button>

                <button
                  onClick={() => setActiveTab('add')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-150 cursor-pointer lg:hidden ${
                    activeTab === 'add'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Plus size={15} id="tab-add-icon" />
                  <span>Log New Expense</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Settings size={15} id="tab-settings-icon" />
                  <span>Preferences & Backups</span>
                </button>

              </nav>
            </div>

            {/* Log New Expense Widget (Always visible on Desktop side, saves tab switches!) */}
            <div className="hidden lg:block">
              <AddExpenseForm 
                categories={DEFAULT_CATEGORIES} 
                currency={budget.currency} 
                onAddExpense={handleAddExpense} 
              />
            </div>

          </div>

          {/* Column B (Right-Side Interactive Panels) - 8 Columns on Desktop */}
          <div id="main-panels-container" className="lg:col-span-8 space-y-6">
            
            {/* TAB CONTENT PANEL */}
            {activeTab === 'dashboard' && (
              <div id="tab-dashboard" className="space-y-6">
                
                {/* Dashboard Metrics and Charts */}
                <DashboardCharts 
                  expenses={expenses} 
                  categories={DEFAULT_CATEGORIES} 
                  budgetLimit={budget.limit} 
                  currency={budget.currency} 
                />

                {/* Mobile Log Expense (Stacked only on mobile under dashboard tab for frictionless flow) */}
                <div className="block lg:hidden">
                  <AddExpenseForm 
                    categories={DEFAULT_CATEGORIES} 
                    currency={budget.currency} 
                    onAddExpense={handleAddExpense} 
                  />
                </div>

                {/* Quick List (Bottom preview under Overview dashboard) */}
                <ExpenseList 
                  expenses={expenses} 
                  categories={DEFAULT_CATEGORIES} 
                  currency={budget.currency} 
                  onRemoveExpense={handleRemoveExpense} 
                />

              </div>
            )}

            {activeTab === 'history' && (
              <div id="tab-history">
                <ExpenseList 
                  expenses={expenses} 
                  categories={DEFAULT_CATEGORIES} 
                  currency={budget.currency} 
                  onRemoveExpense={handleRemoveExpense} 
                />
              </div>
            )}

            {activeTab === 'add' && (
              <div id="tab-add" className="block lg:hidden">
                <AddExpenseForm 
                  categories={DEFAULT_CATEGORIES} 
                  currency={budget.currency} 
                  onAddExpense={handleAddExpense} 
                />
              </div>
            )}

            {activeTab === 'settings' && (
              <div id="tab-settings">
                <BudgetSettings 
                  budget={budget} 
                  onUpdateBudget={saveBudget} 
                  onClearAll={handleClearAll} 
                  onLoadSamples={handleLoadSamples} 
                  onImportData={handleImportData} 
                  onExportData={handleExportData} 
                  expensesCount={expenses.length}
                />
              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}
