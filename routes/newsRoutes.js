const express = require('express');
const { fetchNews } = require('../controllers/newsService');

const router = express.Router();

router.get('/fetch-news', async (req, res) => {
    await fetchNews();
    res.send('News fetching started, check console for updates.');
});

module.exports = router;
