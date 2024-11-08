const News = require('../models/News');
const { NEWS_API_KEY } = process.env;
const { newsUrl } = require('../common/baseUrls');
const { axiosGet } = require('../common/axiosHelper');
const { newsConstants } = require('../common/constants');

const fetchNewsForKeywords = async (keyword = 'technology') => {
    if (Array.isArray(keyword)) {
        for (const k of keyword) {
            const params = { q: k, apiKey: NEWS_API_KEY };
            const response = await axiosGet(newsUrl, '/everything', params);
            const articles = response?.articles || [];
            await saveArticles(articles, k, null);  
        }
    } else {
        const params = { q: keyword, apiKey: NEWS_API_KEY };
        const response = await axiosGet(newsUrl, '/everything', params);

        const articles = response?.articles || [];
        await saveArticles(articles, keyword, null);
    }
};

const fetchNewsForCountries = async () => {
    for (const country of newsConstants.countries) {
        const params = { country: country, apiKey: NEWS_API_KEY };
        const response = await axiosGet(newsUrl, '/top-headlines', params);

        const articles = response?.articles || [];
        await saveArticles(articles, null, country);
    }
};

const saveArticles = async (articles, keyword, country) => {
    for (const article of articles) {
        const newsData = {
            title: article?.title || 'No title',
            description: article?.description || 'No description',
            url: article?.url || '',
            source: article?.source?.name || 'Unknown source',
            publishedAt: article?.publishedAt ? new Date(article.publishedAt) : null,
            keyword: keyword,
            country: country
        };

        const newsEntry = new News(newsData);
        await newsEntry.save();
    }
};

const fetchNews = async (keyword) => {
    try {
        if (keyword) {
            await fetchNewsForKeywords(keyword);  
        } else {
            await fetchNewsForKeywords();  
        }
        
        await fetchNewsForCountries();
        
        console.log('Data fetching and saving completed!');
    } catch (error) {
        console.error('Error fetching news:', error.message);
    }
};

module.exports = { fetchNews };
