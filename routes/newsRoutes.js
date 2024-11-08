const express = require('express');
const { fetchNews } = require('../controllers/newsService');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/fetch-news', async (req, res) => {
    try {
        const keyword = req.query.keyword || null;  

        await fetchNews(keyword);

        res.status(200).json({ message: 'News fetching completed!' });
    } catch (error) {
        console.error('Error fetching news:', error.message);
        res.status(500).json({ message: 'Error fetching news' });
    }
});

module.exports = router;
