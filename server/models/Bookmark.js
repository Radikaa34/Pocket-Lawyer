import mongoose from 'mongoose';
const schema = new mongoose.Schema({ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'LegalTopic', required: true } }, { timestamps: true });
schema.index({ userId: 1, topicId: 1 }, { unique: true });
export default mongoose.model('Bookmark', schema);
