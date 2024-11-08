const mongoose = require('mongoose');

const EngagementSchema = new mongoose.Schema({
  likes: Number,
  comments: Number,
  shares: Number,
}, { _id: false });

const TwitterSchema = new mongoose.Schema({
  profile: {
    profileLink: String,
    authorName: String,
    handle: String,
    profileImageUrl: String,
    bio: String,
    followersCount: Number,
    followingCount: Number,
    tweetCount: Number,
  },
  tweet: {
    tweetId: String,
    postUrl: String,
    text: String,
    createdAt: Date,
    media: [{ mediaUrl: String, type: String }],
    engagement: EngagementSchema,
    comments: [{
      commentId: String,
      author: {
        authorName: String,
        handle: String,
        profileImageUrl: String,
      },
      text: String,
      likeCount: Number,
      createdAt: Date,
    }],
  },
});

module.exports = mongoose.model('Twitter', TwitterSchema);
