import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define structure of a document
const postSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:  [true, 'User id required']
    },
    title: {
        type: String,
        required: [true, 'Title required']
    },
    content: {
        type: String,
        required: [true, 'Content required']
    },
    tags: {
        type: Array,
        required: false,
        default: []
    }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post;