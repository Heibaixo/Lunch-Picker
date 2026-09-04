import { LunchOption, PresetMenu } from '../types';

export const VIBRANT_PALETTE = [
  '#FF6B6B', // Coral Red
  '#4D96FF', // Sky Blue
  '#6BCB77', // Mint Green
  '#FFD93D', // Sunshine Yellow
  '#9D65C9', // Geometric Purple
  '#FFA447', // Warm Tangerine
  '#38B6FF', // Bright Cyan
  '#FF8080', // Watermelon
  '#54BAB9', // Seafoam Teal
  '#E78EA9', // Rosy Pink
];

export const INITIAL_OPTIONS: LunchOption[] = [
  { id: '1', name: 'Chicken Rice', emoji: '🍗', color: '#FF6B6B', enabled: true },
  { id: '2', name: 'Mala Hotpot', emoji: '🌶️', color: '#4D96FF', enabled: true },
  { id: '3', name: 'Salad Bar', emoji: '🥗', color: '#6BCB77', enabled: true },
  { id: '4', name: 'Cai Fan', emoji: '🍱', color: '#FFD93D', enabled: true },
  { id: '5', name: 'Ramen', emoji: '🍜', color: '#9D65C9', enabled: true },
  { id: '6', name: 'Sandwiches', emoji: '🥪', color: '#FFA447', enabled: true },
];

export const PRESETS: PresetMenu[] = [
  {
    id: 'original',
    title: 'The Classics',
    icon: '✨',
    options: [
      { name: 'Chicken Rice', emoji: '🍗', color: '#FF6B6B' },
      { name: 'Mala Hotpot', emoji: '🌶️', color: '#4D96FF' },
      { name: 'Salad Bar', emoji: '🥗', color: '#6BCB77' },
      { name: 'Cai Fan', emoji: '🍱', color: '#FFD93D' },
      { name: 'Ramen', emoji: '🍜', color: '#A06CD5' },
      { name: 'Sandwiches', emoji: '🥪', color: '#FFA447' },
    ],
  },
  {
    id: 'hawker',
    title: 'Hawker Favorites',
    icon: '🥢',
    options: [
      { name: 'Chicken Rice', emoji: '🍗', color: '#FF6B6B' },
      { name: 'Laksa', emoji: '🍜', color: '#FFA447' },
      { name: 'Char Kway Teow', emoji: '🥢', color: '#FFD93D' },
      { name: 'Nasi Lemak', emoji: '🥥', color: '#6BCB77' },
      { name: 'Bak Chor Mee', emoji: '🥣', color: '#4D96FF' },
      { name: 'Roti Prata', emoji: '🥞', color: '#A06CD5' },
    ],
  },
  {
    id: 'healthy',
    title: 'Fresh & Light',
    icon: '🥑',
    options: [
      { name: 'Poke Bowl', emoji: '🐟', color: '#4D96FF' },
      { name: 'Salad Bar', emoji: '🥗', color: '#6BCB77' },
      { name: 'Grilled Chicken Wrap', emoji: '🌯', color: '#FFA447' },
      { name: 'Soba Noodles', emoji: '🥢', color: '#A06CD5' },
      { name: 'Grain Bowl', emoji: '🥑', color: '#FFD93D' },
      { name: 'Clear Fish Soup', emoji: '🍲', color: '#FF6B6B' },
    ],
  },
  {
    id: 'comfort',
    title: 'Comfort Food',
    icon: '🍔',
    options: [
      { name: 'Cheeseburger', emoji: '🍔', color: '#FFA447' },
      { name: 'Pizza Slice', emoji: '🍕', color: '#FF6B6B' },
      { name: 'Fried Chicken', emoji: '🍗', color: '#FFD93D' },
      { name: 'Burrito Bowl', emoji: '🌯', color: '#6BCB77' },
      { name: 'Sushi Combo', emoji: '🍣', color: '#4D96FF' },
      { name: 'Pasta Carbonara', emoji: '🍝', color: '#A06CD5' },
    ],
  },
];

export const WINNER_QUOTES = [
  "The wheel of destiny has chosen!",
  "Your stomach's true calling for today!",
  "No more debating — treat yourself!",
  "Bon appétit, lunch champion!",
  "A sensational pick for your lunch break!",
  "Decision made! Go feast!",
];
