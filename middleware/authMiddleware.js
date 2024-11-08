require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username === process.env.API_USERNAME && password === process.env.API_PASSWORD) {
        return next(); 
    } else {
        return res.status(403).json({ message: 'Access denied' });
    }
};

module.exports = authMiddleware;
