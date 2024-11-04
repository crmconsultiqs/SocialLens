const axios = require('axios');
const YouTubeVideo = require('../models/YouTube');

const keywords = [
  'technology', 'programming', 'music', 'cooking', 'fitness',
  'education', 'science', 'space', 'news', 'movies', 
  'gaming', 'sports', 'travel', 'fashion', 'health',
  'business', 'marketing', 'finance', 'motivation', 'history'
];

const fetchYouTubeVideosForKeywords = async () => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const searchUrl = `https://www.googleapis.com/youtube/v3/search`;
  const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos`;
  const commentsUrl = `https://www.googleapis.com/youtube/v3/commentThreads`;

  try {
    for (const keyword of keywords) {
      // console.log(`Fetching videos for keyword: "${keyword}"`);

      const searchResponse = await axios.get(searchUrl, {
        params: {
          part: 'snippet',
          q: keyword,
          maxResults: 10,
          type: 'video',
          key: apiKey,
        },
      });

      const videoIds = searchResponse.data.items.map(item => item.id.videoId);

      const detailsResponse = await axios.get(videoDetailsUrl, {
        params: {
          part: 'statistics',
          id: videoIds.join(','),
          key: apiKey,
        },
      });

      const videoDetails = detailsResponse.data.items;

      for (const item of searchResponse.data.items) {
        const videoId = item.id.videoId;
        const stats = videoDetails.find(v => v.id === videoId)?.statistics || {};

        let comments = [];
        try {
          const commentsResponse = await axios.get(commentsUrl, {
            params: {
              part: 'snippet',
              videoId,
              maxResults: 10,
              key: apiKey,
            },
          });

          comments = commentsResponse.data.items.map(comment => ({
            authorName: comment.snippet.topLevelComment.snippet.authorDisplayName,
            text: comment.snippet.topLevelComment.snippet.textDisplay,
            publishedAt: new Date(comment.snippet.topLevelComment.snippet.publishedAt),
          }));
        } catch (error) {
          console.error(`Error fetching comments for video ID ${videoId}:`, error.message);
        }

        const videoData = {
          videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          publishedAt: new Date(item.snippet.publishedAt),
          channelTitle: item.snippet.channelTitle,
          thumbnails: {
            default: item.snippet.thumbnails.default.url,
            medium: item.snippet.thumbnails.medium.url,
            high: item.snippet.thumbnails.high.url,
          },
          keyword: keyword,
          likes: parseInt(stats.likeCount) || 0,
          commentsCount: parseInt(stats.commentCount) || 0,
          shares: 0,
          comments: comments,
        };

        await YouTubeVideo.updateOne(
          { videoId: videoData.videoId },
          videoData,
          { upsert: true }
        );
      }

      // console.log(`Videos for keyword "${keyword}" saved to MongoDB.`);
    }

    console.log('All keywords processed and saved.');
  } catch (error) {
    console.error('Error fetching YouTube videos:', error.message);
    throw new Error('Error fetching YouTube videos');
  }
};

module.exports = { fetchYouTubeVideosForKeywords };
