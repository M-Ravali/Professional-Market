require('dotenv').config();
const crypto = require('crypto');

// Generate a random JWT secret if one isn't provided
const generateJwtSecret = () => {
    return crypto.randomBytes(64).toString('hex');
};

module.exports = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/professionalmarketdb',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || generateJwtSecret(),
    emailHost: process.env.EMAIL_HOST || 'smtp.gmail.com',
    emailPort: process.env.EMAIL_PORT || 587,
    emailSecure: process.env.EMAIL_SECURE === 'true',
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS
};