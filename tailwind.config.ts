import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        tastemaker: {
          "primary": "#ff6b6b",
          "secondary": "#4ecdc4",
          "accent": "#ffe66d",
          "neutral": "#2b2d42",
          "base-100": "#ffffff",
          "info": "#38bdf8",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444"
        }
      },
      "light"
    ]
  }
} satisfies Config
