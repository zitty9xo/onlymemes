/**
 * memeTemplates.js
 * Curated list of classic meme templates for the Meme Maker Studio.
 */

export const MEME_TEMPLATES = [
  {
    id: 'drake',
    name: 'Drake Hotline Bling',
    url: 'https://api.memegen.link/images/drake.png',
    aspectRatio: '1:1',
    defaultTopText: 'WRITING BORING CODE',
    defaultBottomText: 'BUILDING KINETIC MEME ENGINE'
  },
  {
    id: 'two-buttons',
    name: 'Two Buttons Dilemma',
    url: 'https://api.memegen.link/images/two-buttons.png',
    aspectRatio: '1:1',
    defaultTopText: 'FIX THE BUG',
    defaultBottomText: 'PUSH TO PROD ON FRIDAY'
  },
  {
    id: 'distracted',
    name: 'Distracted Boyfriend',
    url: 'https://api.memegen.link/images/distracted.png',
    aspectRatio: '16:9',
    defaultTopText: 'NEW JAVASCRIPT FRAMEWORK',
    defaultBottomText: 'MY EXISTING STABLE STACK'
  },
  {
    id: 'doge',
    name: 'Classic Doge',
    url: 'https://api.memegen.link/images/doge.png',
    aspectRatio: '1:1',
    defaultTopText: 'MUCH CODE',
    defaultBottomText: 'VERY ONLYMEME WOW'
  },
  {
    id: 'woman-cat',
    name: 'Woman Yelling At Cat',
    url: 'https://api.memegen.link/images/woman-cat.png',
    aspectRatio: '16:9',
    defaultTopText: 'YOU CANT DEPLOY WITHOUT TESTS',
    defaultBottomText: 'GIT PUSH --FORCE'
  }
];

export const FONT_OPTIONS = [
  { id: 'Impact', name: 'Impact (Classic Meme)', family: 'Impact, sans-serif' },
  { id: 'Modern No. 20', name: 'Modern No. 20 (Editorial)', family: "'Modern No. 20', 'MOD20', serif" },
  { id: 'Space Grotesk', name: 'Space Grotesk (Neo-Brutalist)', family: "'Space Grotesk', sans-serif" },
  { id: 'Space Mono', name: 'Space Mono (Monospace)', family: "'Space Mono', monospace" },
  { id: 'Arial Black', name: 'Arial Black', family: "'Arial Black', sans-serif" }
];

export const PRESET_COLORS = [
  { hex: '#FFFFFF', name: 'White' },
  { hex: '#4BE277', name: 'Electric Lime' },
  { hex: '#FFEB3B', name: 'Yellow' },
  { hex: '#00E5FF', name: 'Cyan' },
  { hex: '#D0BCFF', name: 'Cyber Violet' },
  { hex: '#FF5252', name: 'Red' },
  { hex: '#000000', name: 'Black' }
];
