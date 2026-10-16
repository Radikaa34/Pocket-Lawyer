import fs from 'node:fs/promises';
import path from 'node:path';
import Document from '../models/Document.js';
import { extractText } from '../services/documentService.js';

const allowed = new Set(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']);
export async function uploadDocument(req, res) {
  if (!req.file || !allowed.has(req.file.mimetype)) return res.status(400).json({ message: 'Upload a PDF, DOC, DOCX, or TXT file.' });
  const doc = await Document.create({ userId: req.user._id, fileName: req.file.originalname, fileType: req.file.mimetype, filePath: req.file.path, status: 'processing' });
  try { const extractedText = await extractText(req.file.path, req.file.mimetype, req.file.originalname); doc.extractedText = extractedText.slice(0, 2_000_000); doc.status = 'ready'; await doc.save(); res.status(201).json(doc); }
  catch (error) { doc.status = 'failed'; doc.errorMessage = 'The document could not be processed.'; await doc.save(); res.status(422).json({ message: 'Document processing failed. Please upload it again.', document: doc }); }
}
export async function listDocuments(req, res) { res.json(await Document.find({ userId: req.user._id }).select('-extractedText').sort({ createdAt: -1 })); }
export async function getDocument(req, res) { const doc = await Document.findOne({ _id: req.params.id, userId: req.user._id }).select('-extractedText'); if (!doc) return res.status(404).json({ message: 'Document not found.' }); res.json(doc); }
export async function deleteDocument(req, res) { const doc = await Document.findOneAndDelete({ _id: req.params.id, userId: req.user._id }); if (!doc) return res.status(404).json({ message: 'Document not found.' }); await fs.unlink(doc.filePath).catch(() => {}); res.json({ success: true }); }
