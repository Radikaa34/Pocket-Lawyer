import Bookmark from '../models/Bookmark.js';
import SearchHistory from '../models/SearchHistory.js';
import Document from '../models/Document.js';
import LegalTopic from '../models/LegalTopic.js';
export async function listBookmarks(req, res) { res.json(await Bookmark.find({ userId: req.user._id }).populate('topicId').sort({ createdAt: -1 })); }
export async function addBookmark(req, res) { const topic = await LegalTopic.findById(req.body.topicId); if (!topic) return res.status(404).json({ message: 'Topic not found.' }); const bookmark = await Bookmark.findOneAndUpdate({ userId: req.user._id, topicId: topic._id }, { userId: req.user._id, topicId: topic._id }, { upsert: true, new: true, setDefaultsOnInsert: true }).populate('topicId'); res.status(201).json(bookmark); }
export async function removeBookmark(req, res) { await Bookmark.findOneAndDelete({ userId: req.user._id, topicId: req.params.topicId }); res.json({ success: true }); }
export async function listHistory(req, res) { res.json(await SearchHistory.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(20)); }
export async function addHistory(req, res) { const query = String(req.body.query || '').trim(); if (query.length < 2) return res.status(400).json({ message: 'Search query is too short.' }); res.status(201).json(await SearchHistory.create({ userId: req.user._id, query })); }
export async function removeHistory(req, res) { await SearchHistory.findOneAndDelete({ _id: req.params.id, userId: req.user._id }); res.json({ success: true }); }
export async function dashboardStats(req, res) { const [bookmarks, views, documents, history] = await Promise.all([Bookmark.countDocuments({ userId: req.user._id }), SearchHistory.countDocuments({ userId: req.user._id }), Document.countDocuments({ userId: req.user._id }), SearchHistory.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(5)]); res.json({ bookmarks, views, documents, history }); }
