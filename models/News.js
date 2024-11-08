const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    source: { type: String },
    publishedAt: { type: Date },
    keyword: { type: String },
    country: { type: String },
}, { timestamps: true });

const News = mongoose.model('News', newsSchema);

module.exports = News;
