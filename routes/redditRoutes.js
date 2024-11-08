const express = require('express');
const { fetchRedditPosts } = require('../controllers/RedditService');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/:subreddit', async (req, res) => {
    const { subreddit } = req.params;
    
    try {
        await fetchRedditPosts(subreddit);
        res.send(`Reddit posts from r/${subreddit} fetched and saved to MongoDB`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching Reddit posts');
    }
});

module.exports = router;
