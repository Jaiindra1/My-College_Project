// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // 🚨 CRITICAL FIX: The 'content' array must be present 
  // and list all files where you use Tailwind classes.
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  
  // This enables class-based dark mode (e.g., adding a 'dark' class to the <body>)
  darkMode: "class", 
  
  theme: {
    extend: {
      // Custom Colors
      colors: {
        "primary": "#11d411", // A bright green
        "background-light": "#f6f8f6", // Very light background
        "background-dark": "#102210", // Very dark background
      },
      
      // Custom Font Family
      fontFamily: {
        // Use with the class: font-display
        display: ["Inter", "sans-serif"], 
      },
      
      // Custom Border Radius
      borderRadius: {
        // Overrides default 'rounded' class
        DEFAULT: "0.25rem", 
        // Additional sizes
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  
  plugins: [
    // Add any necessary plugins here (e.g., @tailwindcss/forms)
  ],
};