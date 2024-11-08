const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  authorName: String,
  text: String,
  publishedAt: Date,
});

const YouTubeVideoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  publishedAt: { type: Date },
  channelTitle: { type: String },
  thumbnails: {
    default: { type: String },
    medium: { type: String },
    high: { type: String },
  },
  keyword: { type: String },
  likes: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  comments: [CommentSchema], 
});

module.exports = mongoose.model('YouTubeVideo', YouTubeVideoSchema);
