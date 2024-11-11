const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
          
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
        

            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                console.log('User not found'); // Log if user not found
                return res.status(404).json({ message: 'User not found' });
            }

           
            next();
        } catch (error) {
            console.error('Token verification failed:', error.message); // Log the error message
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        console.log('No token provided'); // Log if no token provided
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = protect;