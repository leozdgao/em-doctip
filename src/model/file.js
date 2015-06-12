import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let fileSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    key: { type: String, required: true },
    date: { type: Date, default: new Date() },
    meta: { type: {
        mime: { type: String },
        size: { type: String },
        name: { type: String }
    }}
}, { collection: 'files', versionKey: false });

export default mongoose.model('File', fileSchema);
