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
            const video = videoData?.data?.items?.[0];

            if (video) {
                const videoDetails = {
                    videoId: video?.id,
                    title: video?.snippet?.title || 'No title',
                    description: video?.snippet?.description || 'No description',
                    publishedAt: video?.snippet?.publishedAt || null,
                    channelId: video?.snippet?.channelId || 'No channelId',
                    channelTitle: video?.snippet?.channelTitle || 'No channel title',
                    views: parseInt(video?.statistics?.viewCount) || 0,
                    likes: parseInt(video?.statistics?.likeCount) || 0,
                    comments: parseInt(video?.statistics?.commentCount) || 0,
                };

                await Video.findOneAndUpdate({ videoId: videoId }, videoDetails, { upsert: true, new: true });
            } else {
                console.warn(`Video not found for ID: ${videoId}`);
            }
        } catch (error) {
            console.error(`Error fetching video ID ${videoId}:`, error.message);
        }
    }

    for (const channelId of channelIds) {
        try {
            const channelData = await axios.get(`https://www.googleapis.com/youtube/v3/channels?id=${channelId}&part=snippet,statistics&key=${process.env.YOUTUBE_API_KEY}`);
            const channel = channelData?.data?.items?.[0];

            if (channel) {
                const channelDetails = {
                    channelId: channel?.id,
                    title: channel?.snippet?.title || 'No title',
                    description: channel?.snippet?.description || 'No description',
                    subscriberCount: parseInt(channel?.statistics?.subscriberCount) || 0,
                    videoCount: parseInt(channel?.statistics?.videoCount) || 0,
                };

                await Channel.findOneAndUpdate({ channelId: channelId }, channelDetails, { upsert: true, new: true });
            } else {
                console.warn(`Channel not found for ID: ${channelId}`);
            }
        } catch (error) {
            console.error(`Error fetching channel ID ${channelId}:`, error.message);
        }
    }
}

module.exports = fetchData;
