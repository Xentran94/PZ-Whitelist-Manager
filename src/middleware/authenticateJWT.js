const jwt = require('jsonwebtoken');

const authenticateJWT = (jwtSecret) => {
    return (req, res, next) => {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (token) {
            jwt.verify(token, jwtSecret, (err, user) => {
                if (err) {
                    return res.sendStatus(403);
                }
                req.user = user;
                next();
            });
        } else {
            res.sendStatus(401);
        }
    };
};

module.exports = authenticateJWT;