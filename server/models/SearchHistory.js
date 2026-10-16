import mongoose from 'mongoose';
const schema = new mongoose.Schema({ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, query: { type: String, required: true, trim: true, maxlength: 240 } }, { timestamps: true });
export default mongoose.model('SearchHistory', schema);
