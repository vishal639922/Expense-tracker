import { 
  Utensils, 
  ShoppingBag, 
  Home, 
  Car, 
  Tv, 
  Heart, 
  Apple, 
  HelpCircle 
} from 'lucide-react';
import { Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'food',
    name: 'Food & Dining',
    color: '#f97316', // Orange-500
    bgColor: 'bg-orange-50 text-orange-600',
    iconName: 'Utensils'
  },
  {
    id: 'shopping',
    name: 'Shopping',
    color: '#a855f7', // Purple-500
    bgColor: 'bg-purple-50 text-purple-600',
    iconName: 'ShoppingBag'
  },
  {
    id: 'housing',
    name: 'Housing & Utilities',
    color: '#3b82f6', // Blue-500
    bgColor: 'bg-blue-50 text-blue-600',
    iconName: 'Home'
  },
  {
    id: 'transport',
    name: 'Transport',
    color: '#eab308', // Yellow-500
    bgColor: 'bg-yellow-50 text-yellow-600',
    iconName: 'Car'
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    color: '#ec4899', // Pink-500
    bgColor: 'bg-pink-50 text-pink-600',
    iconName: 'Tv'
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    color: '#10b981', // Emerald-500
    bgColor: 'bg-emerald-50 text-emerald-600',
    iconName: 'Heart'
  },
  {
    id: 'groceries',
    name: 'Groceries',
    color: '#06b6d4', // Cyan-500
    bgColor: 'bg-cyan-50 text-cyan-600',
    iconName: 'Apple'
  },
  {
    id: 'other',
    name: 'Other',
    color: '#64748b', // Slate-500
    bgColor: 'bg-slate-50 text-slate-600',
    iconName: 'HelpCircle'
  }
];

export function getCategoryColor(categoryId: string, categories: Category[] = DEFAULT_CATEGORIES): string {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.color : '#64748b';
}

export function getCategoryBgColor(categoryId: string, categories: Category[] = DEFAULT_CATEGORIES): string {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.bgColor : 'bg-slate-50 text-slate-600';
}
