"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
exports.default = Post;
//# sourceMappingURL=post.js.map