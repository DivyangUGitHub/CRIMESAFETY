/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        },
      // Add responsive font sizes
      fontSize: {
        'responsive-h1': 'clamp(1.5rem, 5vw, 3rem)',
        'responsive-h2': 'clamp(1.25rem, 4vw, 2rem)',
        'responsive-body': 'clamp(0.875rem, 4vw, 1rem)',
      },
    },
  },
  plugins: [],
}