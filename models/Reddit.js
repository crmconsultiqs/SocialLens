const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  authorName: String,
  body: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const redditPostSchema = new mongoose.Schema({
  profileLink: String,
  authorName: String,
  handle: String,
  postUrl: String,
  title: String,
  body: String,
  commentsCount: Number,
  engagement: {
    likes: Number,
    shares: Number,
  },
  comments: [commentSchema], 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Reddit', redditPostSchema);
