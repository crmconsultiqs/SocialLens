const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    profileLink: {
        type: String,
        required: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    handle: {
        type: String,
        required: true,
    },
    postUrl: {
        type: String,
        required: true,
    },
    comments: [{
        type: String,
    }],
    engagement: {
        likes: {
            type: Number,
            default: 0,
        },
        comments: {
            type: Number,
            default: 0,
        },
        shares: {
            type: Number,
            default: 0,
        },
    },
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
