/// <reference types="vitest/config" />

// Configure Vitest (https://vitest.dev/config/)

import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
  },
  server: {
    port: 5300,
  }
})
