import {defineConfig, mergeConfig} from 'vitest/config'
import viteConfig from './vite.config'
import {resolve} from "path";

export default mergeConfig(viteConfig, defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: 'tests/setup.ts',
    coverage: {
      provider: "v8",
      // exclude: ["src/utils/types.tsx"], //uncomment when to exclude file
    },
  }
}))