import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  fileName: { type: String, required: true }, fileType: { type: String, required: true }, filePath: { type: String, required: true },
  extractedText: { type: String, default: '' }, status: { type: String, enum: ['uploaded', 'processing', 'ready', 'failed'], default: 'uploaded' },
  errorMessage: String,
}, { timestamps: true });
export default mongoose.model('Document', schema);
