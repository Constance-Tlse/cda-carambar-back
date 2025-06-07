import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: './cda-carambar-back/frontend/',
    plugins: [react()],
})