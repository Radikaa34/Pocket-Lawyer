import User from '../models/User.js';
import LegalTopic from '../models/LegalTopic.js';
import Document from '../models/Document.js';
export async function stats(req, res) { const [users, topics, documents] = await Promise.all([User.countDocuments(), LegalTopic.countDocuments(), Document.countDocuments()]); res.json({ users, topics, documents }); }
export async function listUsers(req, res) { res.json(await User.find().select('-password').sort({ createdAt: -1 }).limit(100)); }
