import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function authMiddleware(req, res, next) {
  try {
    if (!process.env.JWT_SECRET) return res.status(503).json({ message: 'JWT_SECRET is not configured.' });
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Authentication required.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'Session is no longer valid.' });
    req.user = user;
    next();
  } catch { res.status(401).json({ message: 'Authentication required.' }); }
}
export function adminMiddleware(req, res, next) { if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin access required.' }); next(); }
