const axios = require('axios');
const mongoose = require('mongoose');
const Video = require('../models/Youtube/Video');
const Channel = require('../models/Youtube/Channel');

async function fetchData() {
    const videoIds = [
        'dQw4w9WgXcQ',
        'fHIHMFPHdy4',
      ];
      
      const channelIds = [
        'UCX6OQ3DkcsbYNE6H8uQQuVA',
        'UCNFmBuclxQPe57orKiQbyfA',
      ];
      

      for (const videoId of videoIds) {
        try {
            const videoData = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails,statistics&key=${process.env.YOUTUBE_API_KEY}`);
            const video = videoData.data.items[0];

            if (video) { // Check if video exists
                const videoDetails = {
                    videoId: video.id,
                    title: video.snippet.title,
                    description: video.snippet.description,
                    publishedAt: video.snippet.publishedAt,
                    channelId: video.snippet.channelId,
                    channelTitle: video.snippet.channelTitle,
                    views: video.statistics.viewCount,
                    likes: video.statistics.likeCount,
                    comments: video.statistics.commentCount,
                };

                await Video.findOneAndUpdate({ videoId: videoId }, videoDetails, { upsert: true, new: true });
            } else {
                console.warn(`Video not found for ID: ${videoId}`);
            }
        } catch (error) {
            console.error(`Error fetching video ID ${videoId}:`, error);
        }
    }

    for (const channelId of channelIds) {
        try {
            const channelData = await axios.get(`https://www.googleapis.com/youtube/v3/channels?id=${channelId}&part=snippet,statistics&key=${process.env.YOUTUBE_API_KEY}`);
            const channel = channelData.data.items[0];

            if (channel) { 
                const channelDetails = {
                    channelId: channel.id,
                    title: channel.snippet.title,
                    description: channel.snippet.description,
                    subscriberCount: channel.statistics.subscriberCount,
                    videoCount: channel.statistics.videoCount,
                };

                await Channel.findOneAndUpdate({ channelId: channelId }, channelDetails, { upsert: true, new: true });
            } else {
                console.warn(`Channel not found for ID: ${channelId}`);
            }
        } catch (error) {
            console.error(`Error fetching channel ID ${channelId}:`, error);
        }
    }
}

module.exports = fetchData; 