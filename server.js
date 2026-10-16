import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { connectDB } from './server/config/db.js';
import apiRouter from './server/routes/index.js';
import { seedTopics } from './server/utils/seed.js';
import { errorMiddleware } from './server/middleware/errorMiddleware.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(path.join(root, 'server/uploads')));
app.get('/api/health', (req, res) => res.json({ ok: true, stack: 'mern', mongoConfigured: Boolean(process.env.MONGO_URI) }));
app.use('/api', apiRouter);
if (process.env.NODE_ENV === 'development') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa', root: path.resolve(root, 'client'), configFile: path.resolve(root, 'vite.config.js') });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(root, 'dist/public')));
  app.get('*', (req, res) => res.sendFile(path.join(root, 'dist/public/index.html')));
}
app.use(errorMiddleware);
const port = Number(process.env.PORT || 3000);
const mongoConnected = await connectDB();
if (mongoConnected) await seedTopics();
createServer(app).listen(port, '0.0.0.0', () => console.log(`Server running on http://localhost:${port}/`));
