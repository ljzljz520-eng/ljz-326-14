import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        minecraft: {
          green: '#71A600',
          darkGreen: '#5A8500',
          lightGreen: '#8BC34A',
          brown: '#8B4513',
          darkBrown: '#654321',
          stone: '#808080',
          dirt: '#9B7653',
          grass: '#7CFC00',
          sky: '#87CEEB',
          night: '#191970',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.15)',
          medium: 'rgba(255, 255, 255, 0.25)',
          dark: 'rgba(0, 0, 0, 0.3)',
        },
      },
      backgroundImage: {
        'minecraft-gradient': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        minecraft: ['Minecraft', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #71A600, 0 0 10px #71A600, 0 0 15px #71A600' },
          '100%': { boxShadow: '0 0 10px #71A600, 0 0 20px #71A600, 0 0 30px #71A600' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
