const axios = require('axios');
const RedditPost = require('../models/Reddit');
const { redditUrl } = require('../common/baseUrls');

const fetchRedditPosts = async (subreddit) => {
  const url = `${process.env.REDDIT_BASE_URL}/${subreddit}/hot.json?limit=10`;
  try {
    const response = await axios.get(url);
    const posts = response?.data?.data?.children?.map(post => post?.data) || [];

    // console.log(redditUrl);
    
    for (const post of posts) {
      const commentsUrl = `${redditUrl}${post?.permalink}.json`;
      // console.log(commentsUrl);

      const commentsResponse = await axios.get(commentsUrl);
      const comments = commentsResponse?.data?.[1]?.data?.children?.map(comment => ({
        authorName: comment?.data?.author,
        body: comment?.data?.body,
        createdAt: comment?.data?.created_utc ? comment?.data?.created_utc * 1000 : null,
      })) || [];

      const redditPost = {
        profileLink: `${redditUrl}/user/${post?.author}`,
        authorName: post?.author,
        handle: `u/${post?.author}`,
        postUrl: `${redditUrl}${post?.permalink}`,
        title: post?.title,
        body: post?.selftext || null,
        commentsCount: post?.num_comments,
        engagement: {
          likes: post?.ups,
          shares: post?.num_crossposts,
        },
        comments: comments,
      };

      await RedditPost.create(redditPost);
    }

    console.log('Reddit posts with comments saved to MongoDB');
  } catch (error) {
    console.error('Error fetching Reddit posts:', error.message);
    throw new Error('Error fetching Reddit posts');
  }
};

module.exports = { fetchRedditPosts };
