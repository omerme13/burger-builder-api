const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        const bearerHeader = req.headers.authorization;
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        const decoded = jwt.verify(bearerToken, 'cheese');
        
        req.userData = decoded;
        next();
    } catch (error) {
        res.status(401).json('Authentication failed');
    }
}

module.exports = {
    verifyToken: verifyToken
};