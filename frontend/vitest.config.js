import react from '@vitejs/plugin-react'

export default {
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.js'
  },
  plugins: [react()]
}
