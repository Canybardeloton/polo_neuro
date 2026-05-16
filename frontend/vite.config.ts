import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
const prosemirrorPackages = [
  "prosemirror-view",
  "prosemirror-state",
  "prosemirror-model",
  "prosemirror-transform",
  "prosemirror-commands",
  "prosemirror-keymap",
  "prosemirror-history",
  "prosemirror-inputrules",
  "prosemirror-gapcursor",
  "prosemirror-schema-list",
  "prosemirror-dropcursor",
];

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: prosemirrorPackages,
  },
  optimizeDeps: {
    include: prosemirrorPackages,
  },
})
