const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  title: String,
  description: String,
  publishedAt: Date,
  channelId: String,
  channelTitle: String,
  views: Number,
  likes: Number,
  comments: Number,
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;
