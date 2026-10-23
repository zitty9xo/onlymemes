/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Stitch Surface Graphite Tiers
        'surface-container-lowest': '#0c0e14',
        'surface-container-low': '#191b22',
        'surface-container': '#1e1f26',
        'surface-container-high': '#282a30',
        'surface-container-highest': '#33343b',
        'surface': '#111319',
        'surface-dim': '#111319',
        'surface-bright': '#373940',
        'surface-variant': '#33343b',
        'background': '#111319',

        // Content & Outline Tokens
        'on-surface': '#e2e2eb',
        'on-surface-variant': '#bccbb9',
        'on-background': '#e2e2eb',
        'outline': '#869585',
        'outline-variant': '#3d4a3d',

        // Primary: Electric Lime
        'primary': '#4be277',
        'on-primary': '#003915',
        'primary-container': '#22c55e',
        'on-primary-container': '#004b1e',
        'primary-fixed': '#6bff8f',
        'primary-fixed-dim': '#4ae176',

        // Secondary: Cyber Violet
        'secondary': '#d0bcff',
        'on-secondary': '#3c0091',
        'secondary-container': '#571bc1',
        'on-secondary-container': '#c4abff',
        'secondary-fixed': '#e9ddff',
        'secondary-fixed-dim': '#d0bcff',

        // Tertiary: Neon Magenta
        'tertiary': '#ffb0ce',
        'on-tertiary': '#640039',
        'tertiary-container': '#ff83b8',
        'on-tertiary-container': '#80004b',
        'tertiary-fixed': '#ffd9e4',

        // Error / Alert / Takedown: Crimson
        'error': '#ffb4ab',
        'on-error': '#690005',
        'error-container': '#93000a',
        'on-error-container': '#ffdad6',
      },
      fontFamily: {
        'grotesk': ['"Space Grotesk"', '"DM Sans"', 'sans-serif'],
        'modern-20': ['"Modern No. 20"', '"Modern No 20"', 'serif'],
        'headline': ['"Modern No. 20"', '"Modern No 20"', '"Space Grotesk"', 'serif'],
        'body': ['"DM Sans"', 'sans-serif'],
        'mono': ['"Space Mono"', 'monospace'],
        'headline-xl': ['"Modern No. 20"', '"Modern No 20"', '"Space Grotesk"', 'serif'],
        'headline-lg': ['"Modern No. 20"', '"Modern No 20"', '"Space Grotesk"', 'serif'],
        'headline-md': ['"Modern No. 20"', '"Modern No 20"', '"Space Grotesk"', 'serif'],
        'headline-sm': ['"Modern No. 20"', '"Modern No 20"', '"Space Grotesk"', 'serif'],
        'body-lg': ['"DM Sans"', 'sans-serif'],
        'body-md': ['"DM Sans"', 'sans-serif'],
        'body-sm': ['"DM Sans"', 'sans-serif'],
        'label-lg': ['"Space Mono"', 'monospace'],
        'label-md': ['"Space Mono"', 'monospace'],
        'label-sm': ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        'hard': '2px 2px 0px #000000',
        'hard-lg': '4px 4px 0px #000000',
        'glow-primary': '0 0 12px rgba(75, 226, 119, 0.4)',
        'glow-secondary': '0 0 12px rgba(87, 27, 193, 0.6)',
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        'sm': '0.125rem',
        'md': '0.25rem',
        'lg': '0.375rem',
        'xl': '0.5rem',
        '2xl': '0.75rem',
        'full': '9999px',
      },
      spacing: {
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2.5rem',
      }
    },
  },
  plugins: [],
};
