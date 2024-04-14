const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for a post
const postSchema = new Schema({
    content: String,
    username: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [{
        content: String,
        username: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});

const Post = mongoose.model('Post', postSchema);

export default Post;
