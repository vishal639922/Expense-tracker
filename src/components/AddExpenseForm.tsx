import React, { useState } from 'react';
import { Plus, Sparkles, Calendar, FileText, Check } from 'lucide-react';
import { Expense, Category } from '../types';
import CategoryIcon from './CategoryIcon';

interface AddExpenseFormProps {
  categories: Category[];
  currency: string;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

const QUICK_SUGGESTIONS = [
  { title: 'Specialty Coffee', category: 'food' },
  { title: 'Weekly Groceries', category: 'groceries' },
  { title: 'Uber Taxi Trip', category: 'transport' },
  { title: 'Restaurant Dinner', category: 'food' },
  { title: 'Gym Access Fee', category: 'health' },
  { title: 'Gasoline Refill', category: 'transport' },
];

export default function AddExpenseForm({ categories, currency, onAddExpense }: AddExpenseFormProps) {
  const todayStr = '2026-06-28'; // Preset default date
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || 'food');
  const [date, setDate] = useState(todayStr);
  const [notes, setNotes] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Suggestions handler
  const handleApplySuggestion = (sug: { title: string; category: string }) => {
    setTitle(sug.title);
    setSelectedCategory(sug.category);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!title.trim()) {
      setErrorMsg('Please enter an expense name or title.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg('Please enter a valid amount greater than zero.');
      return;
    }

    if (!date) {
      setErrorMsg('Please select a valid date.');
      return;
    }

    // Call onAddExpense callback
    onAddExpense({
      title: title.trim(),
      amount: parsedAmount,
      category: selectedCategory,
      date,
      notes: notes.trim() || undefined,
    });

    // Reset Form
    setTitle('');
    setAmount('');
    setNotes('');
    setDate(todayStr);

    // Show temporary confirmation toast
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
    }, 2500);
  };

  return (
    <div id="add-expense-form-card" className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs relative transition-all hover:shadow-md">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-6">
        <span className="w-1.5 h-4 bg-indigo-600 rounded-full block"></span>
        Log New Expense
      </h3>

      {errorMsg && (
        <div id="form-error-alert" className="mb-4 p-3.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold flex items-center gap-2 border border-rose-100 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
          {errorMsg}
        </div>
      )}

      {showConfirmation && (
        <div id="form-success-alert" className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md z-10 animate-bounce">
          <Check size={14} id="success-tick" />
          <span>Logged successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Title Input */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Expense Name / What was it?
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Whole Foods Groceries"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Quick Suggestions Pills */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
            <Sparkles size={11} id="icon-sparkles" className="text-amber-500 animate-pulse" /> Quick Templates:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleApplySuggestion(sug)}
                className="text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold px-3 py-1.5 rounded-full border border-slate-200 transition-colors cursor-pointer"
              >
                {sug.title}
              </button>
            ))}
          </div>
        </div>

        {/* Amount & Date Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Amount */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Amount ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-slate-400 text-sm font-semibold">
                {currency}
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all placeholder:text-slate-400 font-mono font-bold"
              />
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Transaction Date
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Calendar size={14} id="picker-calendar-icon" />
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-mono font-medium"
              />
            </div>
          </div>

        </div>

        {/* Category Visual Grid Selector */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Select Category
          </label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-150 flex items-center gap-2.5 cursor-pointer ${
                    isSelected 
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/20 text-white' : cat.bgColor} flex-shrink-0`}>
                    <CategoryIcon iconName={cat.iconName} size={14} />
                  </div>
                  <span className="text-xs font-bold truncate">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes (Optional) */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Add Notes (Optional)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-slate-400">
              <FileText size={14} id="icon-notes" />
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. split with roomies, business trip reimbursement, etc."
              rows={2}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all placeholder:text-slate-400 font-medium resize-none"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-md shadow-indigo-100 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <Plus size={16} id="add-plus" />
          <span>Add Expense Record</span>
        </button>

      </form>
    </div>
  );
}
