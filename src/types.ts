export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind hex color for SVG and border accent
  bgColor: string; // Tailwind bg-class or hex
  iconName: string; // Lucide icon identifier
}

export interface Budget {
  limit: number;
  currency: string;
}

export type SortField = 'date' | 'amount' | 'title';
export type SortOrder = 'asc' | 'desc';
