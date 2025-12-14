module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'kenyan-red': '#ED1C24',
        'kenyan-green': '#006600',
        'kenyan-black': '#000000',
        'kenyan-flag-green': '#006600',
        'kenyan-flag-red': '#BB0000',
        'kenyan-flag-black': '#000000',
        'kenyan-flag-white': '#FFFFFF',
        'matatu-yellow': '#F7B731',
        'pulse-orange': '#FF9800',
        'nairobi-blue': '#1E40AF',
        'matatu-green': '#10B981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        nairobi: ['Nairobi', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'drive': 'drive 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'vibrate': 'vibrate 0.3s linear infinite',
      },
      keyframes: {
        drive: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        vibrate: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        },
      },
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
}