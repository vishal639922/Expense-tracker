import { Expense } from '../types';

// Let's generate dates dynamically relative to current date 2026-06-28 so they are always relevant!
const getPastDateString = (daysAgo: number): string => {
  const date = new Date('2026-06-28T08:16:35-07:00');
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

export const SAMPLE_EXPENSES: Expense[] = [
  {
    id: 'sample-1',
    title: 'Whole Foods Groceries',
    amount: 124.50,
    category: 'groceries',
    date: getPastDateString(1), // June 27
    notes: 'Weekly organic grocery haul.'
  },
  {
    id: 'sample-2',
    title: 'Monthly Apartment Rent',
    amount: 1450.00,
    category: 'housing',
    date: getPastDateString(27), // June 1
    notes: 'Includes water bill allocation'
  },
  {
    id: 'sample-3',
    title: 'Shell Gas Station Refill',
    amount: 48.20,
    category: 'transport',
    date: getPastDateString(3), // June 25
    notes: 'Premium unleaded fuel.'
  },
  {
    id: 'sample-4',
    title: 'Netflix Premium Plan',
    amount: 22.99,
    category: 'entertainment',
    date: getPastDateString(13), // June 15
    notes: 'Family account shared monthly subscription'
  },
  {
    id: 'sample-5',
    title: 'Ramen & Gyoza Dinner',
    amount: 42.50,
    category: 'food',
    date: getPastDateString(2), // June 26
    notes: 'Dinner out with Sarah'
  },
  {
    id: 'sample-6',
    title: 'Equinox Fitness Club',
    amount: 180.00,
    category: 'health',
    date: getPastDateString(23), // June 5
    notes: 'Monthly gym and locker access fee'
  },
  {
    id: 'sample-7',
    title: 'Patagonia Fleece Jacket',
    amount: 139.00,
    category: 'shopping',
    date: getPastDateString(10), // June 18
    notes: 'Warm fleece on sale!'
  },
  {
    id: 'sample-8',
    title: 'Blue Bottle Specialty Coffee',
    amount: 8.75,
    category: 'food',
    date: getPastDateString(0), // June 28 (Today)
    notes: 'Latte and chocolate croissant.'
  },
  {
    id: 'sample-9',
    title: 'Electric Grid Utility Bill',
    amount: 87.35,
    category: 'housing',
    date: getPastDateString(16), // June 12
    notes: 'Summer AC usage hike.'
  },
  {
    id: 'sample-10',
    title: 'Uber Ride to Airport',
    amount: 52.40,
    category: 'transport',
    date: getPastDateString(6), // June 22
    notes: 'Early morning flight transfer.'
  },
  {
    id: 'sample-11',
    title: 'Trader Joe\'s Snack Prep',
    amount: 36.15,
    category: 'groceries',
    date: getPastDateString(5), // June 23
    notes: 'Snacks, cheeses, and cold brew'
  },
  {
    id: 'sample-12',
    title: 'Pharmacy Vitamins',
    amount: 28.90,
    category: 'health',
    date: getPastDateString(18), // June 10
    notes: 'Vitamin D3 and fish oil bottles'
  }
];
