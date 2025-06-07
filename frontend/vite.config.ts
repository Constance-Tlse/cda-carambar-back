import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: 'https://constance-tlse.github.io/cda-carambar-back/',
    plugins: [react()],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
});