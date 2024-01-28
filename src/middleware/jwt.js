const jwt = require("jsonwebtoken");

const config = require('../config/config');

const verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.params.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

const generateToken = (userId, role) => {
    return {
        accessToken: jwt.sign({ id: userId, role: role }, config.jwt.SECRET_KEY, {
            algorithm: 'HS256',
            expiresIn: config.jwt.EXPIRES_IN
        }), expiresIn: config.jwt.EXPIRES_IN
    }
}

module.exports = { verifyToken, generateToken };