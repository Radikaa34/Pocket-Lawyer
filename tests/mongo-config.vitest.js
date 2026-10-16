import { describe, expect, it } from 'vitest';
import { spawn } from 'node:child_process';

function waitForHealth(port) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + 10000;
    const attempt = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:${port}/api/health`);
        resolve(await response.json());
      } catch (error) {
        if (Date.now() > deadline) reject(error);
        else setTimeout(attempt, 150);
      }
    };
    attempt();
  });
}

describe('MongoDB configuration', () => {
  it('recognizes the supplied MONGO_URI through the health endpoint', async () => {
    const port = 4321;
    const child = spawn(process.execPath, ['server.js'], {
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: 'test', PORT: String(port), MONGO_URI: 'mongodb://localhost:27017/' },
      stdio: 'ignore',
    });
    try {
      const health = await waitForHealth(port);
      expect(health).toMatchObject({ ok: true, stack: 'mern', mongoConfigured: true });
    } finally {
      child.kill('SIGTERM');
    }
  }, 15000);
});
