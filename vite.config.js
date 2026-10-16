import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve('client'),
  publicDir: path.resolve('client/public'),
  resolve: { alias: { '@': path.resolve('client/src') } },
  build: { outDir: path.resolve('dist/public'), emptyOutDir: true },
  server: { host: true, allowedHosts: ['.manus.computer', '.manuspre.computer', 'localhost', '127.0.0.1'] },
});
