import mongoose from 'mongoose';
const sourceSchema = new mongoose.Schema({ section: String, text: String }, { _id: false });
const schema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  question: { type: String, required: true, maxlength: 500 }, answer: { type: String, required: true }, sources: [sourceSchema],
}, { timestamps: true });
export default mongoose.model('DocumentQuestion', schema);
