const { model, Schema } = require('mongoose');
const { ObjectId } = Schema;

const CommentSchema = new Schema({
    image_id: { type: ObjectId, ref: 'Image', required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    gravatar: { type: String },
    comment: { type: String, required: true },
    timestamp: { type: Date, default: new Date() }
});

module.exports = model('Comment', CommentSchema);