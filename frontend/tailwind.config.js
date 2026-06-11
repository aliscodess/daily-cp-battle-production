/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette — soft terracotta/amber
        brand: {
          50:  '#fdf5f0',
          100: '#faeae0',
          200: '#f4d0b8',
          300: '#e8ab86',
          400: '#D9885A',
          500: '#C9775A',
          600: '#b8644a',
          700: '#9a5140',
          800: '#7c4133',
          900: '#5e3027',
        },
        // Paper surface tokens
        surface: {
          base:    '#FAF8F3',
          paper:   '#F8F6F1',
          warm:    '#F2EEE7',
          muted:   '#ECE7DF',
          elevated: '#FFFFFF',
          card:    '#FCFAF7',
        },
        // Pastel accents
        sage:    '#93A189',
        mustard: '#C8A45D',
        dusty:   '#8EA0B6',
        rose:    '#C49791',
        apricot: '#D9A17A',
        // Text
        ink: {
          primary:   '#2D2A26',
          secondary: '#6E685F',
          muted:     '#9A9590',
          faint:     '#B8B3AC',
        },
        // Border
        border: {
          DEFAULT: '#DDD6CC',
          light:   '#E8E3DB',
          strong:  '#C8C0B5',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
        sans:    ['"DM Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'paper-texture':   'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(201,119,90,0.06), transparent)',
      },
      animation: {
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up':    'slideUp 0.3s ease-out',
        'slide-down':  'slideDown 0.3s ease-out',
        'fade-in':     'fadeIn 0.4s ease-out',
      },
      keyframes: {
        slideUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      boxShadow: {
        'card':     '0 1px 3px rgba(45,42,38,0.06), 0 1px 2px rgba(45,42,38,0.04)',
        'card-md':  '0 4px 12px rgba(45,42,38,0.08), 0 1px 3px rgba(45,42,38,0.06)',
        'card-lg':  '0 8px 24px rgba(45,42,38,0.1), 0 2px 6px rgba(45,42,38,0.06)',
        'inset-sm': 'inset 0 1px 2px rgba(45,42,38,0.06)',
      },
    },
  },
  plugins: [],
};
