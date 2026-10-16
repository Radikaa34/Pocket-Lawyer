import mongoose from 'mongoose';

const legalTopicSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, index: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String, index: true }],
  resources: [{ label: String, url: String }],
}, { timestamps: true });
legalTopicSchema.index({ title: 'text', category: 'text', description: 'text', content: 'text', tags: 'text' });
export default mongoose.model('LegalTopic', legalTopicSchema);
