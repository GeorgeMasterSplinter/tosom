module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'heading-1': ['3.5rem', {
          lineHeight: '1.4',
          fontWeight: '700',
        }],
        'heading-2': ['2.5rem', {
          lineHeight: '1.35',
          fontWeight: '700',
        }],
        'heading-3': ['1.875rem', {
          lineHeight: '1.4',
          fontWeight: '700',
        }],
        'heading-4': ['1.5rem', {
          lineHeight: '1.5',
          fontWeight: '700',
        }],
        'body-lg': ['1.25rem', {
          lineHeight: '1.65',
          fontWeight: '400',
        }],
        'body-md': ['1.125rem', {
          lineHeight: '1.65',
          fontWeight: '400',
        }],
        'body-sm': ['1rem', {
          lineHeight: '1.65',
          fontWeight: '400',
        }],
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      colors: {
        'background': ['#FAFAF9', {}],
        'light-gray': ['#F3F3F2', {}],
        'beige': ['#EDEAE6', {}],
        'dark': ['#1A1A1A', {}],
        'secondary': ['#4A4A4A', {}],
        'gold': ['#CBAA7A', {}],
      },
    },
  },
  plugins: [],
}