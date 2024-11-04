const express = require('express');
const fetchPostData = require('../controllers/FacebookService');

const router = express.Router();

router.get('/fetch-posts', async (req, res) => {
    const accessToken = req.query.access_token;

    if (!accessToken) {
        return res.status(400).send('Access token is required');
    }
    
    await fetchPostData(accessToken);
    res.send('Fetching posts...');
});

module.exports = router;
