const express = require('express');
const fetchData = require('../controllers/youTubeService');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/fetch-youtube', async (req, res) => {
    try {
        await fetchData();
        res.send('Data fetched and saved to MongoDB');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

module.exports = router;
