const axios = require('axios');
const YouTubeVideo = require('../models/YouTube');
const {youtubeConstants} = require('../common/constants');
const {youtubeUrl} = require('../common/baseUrls')

const fetchYouTubeVideosForKeywords = async () => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const searchUrl = `${youtubeUrl}/search`;
  const videoDetailsUrl = `${youtubeUrl}/videos`;
  const commentsUrl = `${youtubeUrl}/commentThreads`;

  try {
    for (const keyword of youtubeConstants.keywords) {
      const searchResponse = await axios.get(searchUrl, {
        params: {
          part: 'snippet',
          q: keyword,
          maxResults: 10,
          type: 'video',
          key: apiKey,
        },
      });

      const videoIds = searchResponse?.data?.items?.map(item => item?.id?.videoId) || [];

      const detailsResponse = await axios.get(videoDetailsUrl, {
        params: {
          part: 'statistics',
          id: videoIds.join(','),
          key: apiKey,
        },
      });

      const videoDetails = detailsResponse?.data?.items || [];

      for (const item of searchResponse?.data?.items || []) {
        const videoId = item?.id?.videoId;
        const stats = videoDetails.find(v => v?.id === videoId)?.statistics || {};

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

          comments = commentsResponse?.data?.items?.map(comment => ({
            authorName: comment?.snippet?.topLevelComment?.snippet?.authorDisplayName || 'Anonymous',
            text: comment?.snippet?.topLevelComment?.snippet?.textDisplay || '',
            publishedAt: comment?.snippet?.topLevelComment?.snippet?.publishedAt ? new Date(comment.snippet.topLevelComment.snippet.publishedAt) : null,
          })) || [];
        } catch (error) {
          console.error(`Error fetching comments for video ID ${videoId}:`, error.message);
        }

        const videoData = {
          videoId,
          title: item?.snippet?.title || 'No title',
          description: item?.snippet?.description || 'No description',
          publishedAt: item?.snippet?.publishedAt ? new Date(item.snippet.publishedAt) : null,
          channelTitle: item?.snippet?.channelTitle || 'Unknown channel',
          thumbnails: {
            default: item?.snippet?.thumbnails?.default?.url || '',
            medium: item?.snippet?.thumbnails?.medium?.url || '',
            high: item?.snippet?.thumbnails?.high?.url || '',
          },
          keyword: keyword,
          likes: parseInt(stats?.likeCount) || 0,
          commentsCount: parseInt(stats?.commentCount) || 0,
          shares: 0,
          comments: comments,
        };

        await YouTubeVideo.updateOne(
          { videoId: videoData.videoId },
          videoData,
          { upsert: true }
        );
      }
    }

    console.log('All keywords processed and saved.');
  } catch (error) {
    console.error('Error fetching YouTube videos:', error.message);
    throw new Error('Error fetching YouTube videos');
  }
};

module.exports = { fetchYouTubeVideosForKeywords };
