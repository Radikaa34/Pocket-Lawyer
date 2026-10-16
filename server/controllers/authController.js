import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function tokenFor(user) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required for authentication.');
  return jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}
export async function register(req, res) { const { name, email, password, confirmPassword } = req.body; if (!name || !email || !password || password !== confirmPassword) return res.status(400).json({ message: 'Name, email, password, and matching confirmation are required.' }); if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' }); const normalized = email.trim().toLowerCase(); if (await User.exists({ email: normalized })) return res.status(409).json({ message: 'An account with that email already exists.' }); const user = await User.create({ name: name.trim(), email: normalized, password }); res.status(201).json({ user: user.safe(), token: tokenFor(user) }); }
export async function login(req, res) { const { email, password } = req.body; const user = await User.findOne({ email: String(email || '').trim().toLowerCase() }).select('+password'); if (!user || !(await user.comparePassword(password || ''))) return res.status(401).json({ message: 'Email or password is incorrect.' }); res.json({ user: user.safe(), token: tokenFor(user) }); }
export function me(req, res) { res.json({ user: req.user.safe() }); }
