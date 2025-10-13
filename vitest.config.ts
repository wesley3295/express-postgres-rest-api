import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.{test,spec}.ts'],
    exclude: ['node_modules', 'dist', 'coverage', 'prisma/migrations'],
    setupFiles: ['src/tests/setup.ts'], // create if you need DB/reset hooks
    testTimeout: 20000,
    hookTimeout: 30000,
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'src/tests/**',
        'src/**/types.ts',
        'src/**/validators.ts',
        'src/**/routes.ts',
        'src/**/mocks/**',
        'dist/**',
      ],
    },
    // Faster CI runs; bump if you need more parallelism
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
  resolve: {
    // Optional: if you don't use tsconfig paths, you can set manual aliases here
    // alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('test'),
  },
})
