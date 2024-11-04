const axios = require('axios');
const News = require('../models/News');
const { NEWS_API_KEY } = process.env;

const keywords = [
    'bitcoin', 'ethereum', 'blockchain', 'cryptocurrency', 'NFT', 
    'dogecoin', 'Litecoin', 'Ripple', 'Solana', 'Cardano', 
    'financial technology', 'digital currency', 'ICO', 'DeFi', 
    'mining', 'wallet', 'crypto exchange', 'stablecoin', 
    'fintech', 'investing', 'market trends', 'web3', 'DAO'
];

const countries = [
    'us', 'ca', 'gb', 'au', 'in', 
    'de', 'fr', 'jp', 'cn', 'br'
];

const fetchNews = async () => {
    try {
        for (const keyword of keywords) {
            const response = await axios.get(`https://newsapi.org/v2/everything`, {
                params: {
                    q: keyword,
                    apiKey: NEWS_API_KEY
                }
            });

            const articles = response.data.articles;

            for (const article of articles) {
                const newsData = {
                    title: article.title,
                    description: article.description,
                    url: article.url,
                    source: article.source.name,
                    publishedAt: new Date(article.publishedAt),
                    keyword: keyword,
                    country: null 
                };

                const newsEntry = new News(newsData);
                await newsEntry.save(); 
            }
        }

        for (const country of countries) {
            const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
                params: {
                    country: country,
                    apiKey: NEWS_API_KEY
                }
            });

            const articles = response.data.articles;

            for (const article of articles) {
                const newsData = {
                    title: article.title,
                    description: article.description,
                    url: article.url,
                    source: article.source.name,
                    publishedAt: new Date(article.publishedAt),
                    keyword: null,
                    country: country
                };

                const newsEntry = new News(newsData);
                await newsEntry.save(); 
            }
        }

        console.log('Data fetching and saving completed!');
    } catch (error) {
        console.error('Error fetching news:', error.message);
    }
};



module.exports = { fetchNews };
