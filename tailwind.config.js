// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    // 🚨 CRITICAL FIX: The 'content' array must be present 
    // and list all files where you use Tailwind classes.
    content: [
      "./src/**/*.{js,jsx,ts,tsx,html}",
    ],
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: '#11d411',
            'background-light': '#f6f8f6',
            'background-dark': '#102210',
            'card-light': '#ffffff',
            'card-dark': '#182c18',
            'border-light': '#e5e7eb',
            'border-dark': '#374151',
            'subtle-light': '#9ca3af',
            'subtle-dark': '#6b7280',
          },
          fontFamily: {
            display: ['Inter', 'sans-serif'],
          },
          borderRadius: {
            DEFAULT: '0.5rem',
            lg: '0.75rem',
            xl: '1rem',
            full: '9999px',
          },
        },
      },
      plugins: [require('@tailwindcss/forms'), require('@tailwindcss/container-queries')],

};