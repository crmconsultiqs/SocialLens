const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const newsRoutes = require('./routes/newsRoutes');
const youtubeRoutes = require('./routes/youtubeRoutes');
const facebookRoutes = require('./routes/facebookRoutes');
const redditRoutes = require('./routes/redditRoutes');
const youtubePaths = require('./routes/youTubePaths');

app.use('/news', newsRoutes);
// app.use('/youtube', youtubeRoutes);
app.use('/facebook', facebookRoutes);
app.use('/reddit', redditRoutes);
app.use('/youtube', youtubePaths);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
