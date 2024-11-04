const express = require('express');
const router = express.Router();
const { fetchYouTubeVideosForKeywords } = require('../controllers/youtubeController');

router.get('/fetch-all', async (req, res) => {
  try {
    await fetchYouTubeVideosForKeywords();
    res.send('YouTube videos for all keywords fetched and saved to MongoDB.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching YouTube videos');
  }
});

module.exports = router;
