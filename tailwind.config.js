/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        secondary: '#2563eb',
        accent: '#6b21a8',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#0ea5e9',
        light: '#f7f8fb',
        dark: '#0f172a',
        slate: {
          50: '#f9fafb',
          100: '#f3f4f6',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
      },
      boxShadow: {
        sm: '0 4px 6px rgba(15, 23, 42, 0.05)',
        md: '0 12px 26px rgba(15, 23, 42, 0.05)',
        lg: '0 16px 40px rgba(15, 23, 42, 0.08)',
        xl: '0 20px 50px rgba(15, 23, 42, 0.1)',
      },
    },
  },
  plugins: [],
}
