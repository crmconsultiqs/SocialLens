const express = require('express');
const fetchPostData = require('../controllers/FacebookService');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/fetch-posts', async (req, res) => {
    const accessToken = req.query.access_token;

    if (!accessToken) {
        return res.status(400).send('Access token is required');
    }
    
    await fetchPostData(accessToken);
    res.send('Fetching posts...');
});

module.exports = router;
