const axios = require('axios');
const Post = require('../models/Facebook');

const fetchPostData = async (accessToken) => {
    try {
        const facebookResponse = await axios.get(`https://graph.facebook.com/v12.0/me/feed?access_token=${accessToken}`);
        const instagramResponse = await axios.get(`https://graph.instagram.com/me/media?access_token=${accessToken}`);

        const posts = [];

        for (let post of facebookResponse?.data?.data || []) {
            const postData = {
                profileLink: `https://facebook.com/${post?.id}`,
                authorName: post?.from?.name || 'Unknown',
                handle: `@${post?.from?.id || ''}`,
                postUrl: `https://facebook.com/${post?.id}`,
                comments: [],
                engagement: {
                    likes: post?.likes?.summary?.total_count || 0,
                    comments: post?.comments?.summary?.total_count || 0,
                    shares: post?.shares?.count || 0,
                },
            };
            posts.push(postData);
        }

        for (let media of instagramResponse?.data?.data || []) {
            const postData = {
                profileLink: `https://instagram.com/${media?.user?.id || ''}`,
                authorName: media?.user?.username || 'Unknown',
                handle: `@${media?.user?.username || ''}`,
                postUrl: media?.permalink || '',
                comments: [],
                engagement: {
                    likes: media?.likes?.count || 0,
                    comments: media?.comments_count || 0,
                    shares: 0, 
                },
            };
            posts.push(postData);
        }

        await Post.insertMany(posts);
        console.log('Posts saved to MongoDB');
    } catch (error) {
        console.error('Error fetching post data:', error);
    }
};

module.exports = fetchPostData;
