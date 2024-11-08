const axios = require('axios');

const axiosGet = async (baseUrl, route, params) => {
    try {
        const response = await axios.get(`${baseUrl}${route}`, { params });
        return response.data;
    } catch (error) {
        console.error(`Error in axiosGet: ${error.message}`);
        throw error; 
    }
};

module.exports = { axiosGet };
