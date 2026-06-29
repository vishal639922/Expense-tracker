import React, { useRef, useState } from 'react';
import { 
  Settings, 
  DollarSign, 
  FileDown, 
  FileUp, 
  RefreshCw, 
  ShieldAlert, 
  ChevronRight,
  Sparkles,
  HeartHandshake,
  Check
} from 'lucide-react';
import { Budget } from '../types';

interface BudgetSettingsProps {
  budget: Budget;
  onUpdateBudget: (newBudget: Budget) => void;
  onClearAll: () => void;
  onLoadSamples: () => void;
  onImportData: (expensesJson: string) => boolean;
  onExportData: () => void;
  expensesCount: number;
}

export default function BudgetSettings({
  budget,
  onUpdateBudget,
  onClearAll,
  onLoadSamples,
  onImportData,
  onExportData,
  expensesCount
}: BudgetSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [limitInput, setLimitInput] = useState(budget.limit.toString());
  const [selectedCurrency, setSelectedCurrency] = useState(budget.currency);
  const [importStatus, setImportStatus] = useState<{ success: boolean; msg: string } | null>(null);
  const [saveStatus, setSaveStatus] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLimit = parseFloat(limitInput);
    if (isNaN(parsedLimit) || parsedLimit < 0) {
      alert('Please enter a valid budget limit (0 or greater).');
      return;
    }

    onUpdateBudget({
      limit: parsedLimit,
      currency: selectedCurrency
    });

    setSaveStatus(true);
    setTimeout(() => {
      setSaveStatus(false);
    }, 2000);
  };

  // Import JSON handler
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = onImportData(content);
      if (success) {
        setImportStatus({ success: true, msg: 'Database imported successfully!' });
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setImportStatus({ success: false, msg: 'Invalid backup file format.' });
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div id="budget-settings-card" className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 transition-all hover:shadow-md">
      
      {/* Settings Header */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-4 bg-indigo-600 rounded-full block"></span>
          Control & Settings Panel
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure currencies, budget goals, and backup files locally
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSavePreferences} className="space-y-4 pt-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Budget Limit */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Monthly Limit Amount
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                {selectedCurrency}
              </span>
              <input
                type="number"
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
                placeholder="e.g. 2000"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-transparent font-mono font-bold"
              />
            </div>
          </div>

          {/* Currency Symbols */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Currency Symbol
            </label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            >
              <option value="$">USD / CAD / AUD ($)</option>
              <option value="€">EUR (€)</option>
              <option value="£">GBP (£)</option>
              <option value="¥">JPY / CNY (¥)</option>
              <option value="₹">INR (₹)</option>
              <option value="₩">KRW (₩)</option>
              <option value="₪">ILS (₪)</option>
            </select>
          </div>

        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-5 rounded-xl shadow-md shadow-indigo-100 hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5 active:scale-98"
        >
          {saveStatus ? (
            <>
              <Check size={13} id="save-check" />
              <span>Preferences Saved!</span>
            </>
          ) : (
            <>
              <Settings size={13} id="save-settings" />
              <span>Update Preferences</span>
            </>
          )}
        </button>
      </form>

      {/* Backups & Data Portability */}
      <div className="border-t border-slate-100 pt-5 space-y-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Data Portability & Backup
        </span>

        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Export */}
          <button
            onClick={onExportData}
            disabled={expensesCount === 0}
            className="flex-1 border border-slate-200 hover:border-slate-300 disabled:opacity-50 text-slate-700 bg-white hover:bg-slate-50 font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <FileDown size={14} id="icon-file-down" />
            <span>Export Backup (JSON)</span>
          </button>

          {/* Import */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 border border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <FileUp size={14} id="icon-file-up" />
            <span>Import Backup</span>
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            accept=".json"
            className="hidden"
          />

        </div>

        {importStatus && (
          <div className={`p-3.5 rounded-xl text-xs font-semibold border ${
            importStatus.success 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100 animate-fadeIn' 
              : 'bg-rose-50 text-rose-700 border-rose-100 animate-fadeIn'
          }`}>
            {importStatus.msg}
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="border-t border-slate-100 pt-5 space-y-3">
        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block flex items-center gap-1">
          <ShieldAlert size={12} id="danger-shield" /> Operations Hub & Danger Zone
        </span>

        <div className="flex flex-wrap gap-2.5">
          
          {/* Load Sample Data */}
          <button
            onClick={onLoadSamples}
            className="text-xs bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 border border-slate-200 font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles size={13} id="settings-sparkles" className="text-amber-500 animate-pulse" />
            <span>Load Sample Data</span>
          </button>

          {/* Wipe All Data */}
          <button
            onClick={onClearAll}
            className="text-xs text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-100 hover:border-rose-600 font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw size={13} id="icon-clear-database" />
            <span>Wipe Database</span>
          </button>

        </div>
      </div>

      {/* About Section */}
      <div className="bg-indigo-50/40 p-5 rounded-2xl border border-indigo-100/50">
        <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5 mb-1.5">
          <HeartHandshake size={13} id="about-handshake" className="text-indigo-600" />
          100% Client-Side Privacy
        </h4>
        <p className="text-[11px] leading-relaxed text-indigo-900/80 font-medium">
          All records, settings, and charts are computed and saved exclusively in your browser's <strong>localStorage</strong>. Your financial data is private and never transmitted to an external server. Feel free to export backups periodically to keep them safe.
        </p>
      </div>

    </div>
  );
}
