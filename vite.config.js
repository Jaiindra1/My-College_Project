import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // ✅ Optional: Silence HMR console logs
  server: {
    hmr: {
      overlay: true,  // keeps error overlay visible
    },
    // Reduce console clutter
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
  },
  
  // ✅ Optional: Reduce log level for a cleaner terminal
  logLevel: 'warn', // choices: 'info', 'warn', 'error', 'silent'
})
