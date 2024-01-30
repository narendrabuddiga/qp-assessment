const jwt = require("jsonwebtoken");

const config = require('../config/config');

const verifyToken = (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, config.jwt.SECRET_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

const extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.headers["x-access-token"]) {
        return req.headers["x-access-token"];
    }
    return null;
}

const generateToken = (userId, role) => {
    return {
        accessToken: jwt.sign({ id: userId, role: role }, config.jwt.SECRET_KEY, {
            algorithm: 'HS256',
            expiresIn: config.jwt.EXPIRES_IN
        }), expiresIn: config.jwt.EXPIRES_IN
    }
}

module.exports = { verifyToken, generateToken };