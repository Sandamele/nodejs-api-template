const jwt = require("jsonwebtoken");
const authorization = async (req, res, next) => {
    try {
        if (req.headers.authorization === undefined)
            return res.status(401).json({
                error: { msg: "Unauthorised access: no token provided" },
            });
        const token = removeBearer(req.headers.authorization);
        const tokenIsValid = jwt.verify(token, process.env.JWT_SECRET);
        req.user = tokenIsValid;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                error: {
                    msg: "Unauthorised: Invalid token. Please log in again.",
                },
            });
        } else if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                error: {
                    msg: "Unauthorised: Your session has expired. Please log in again.",
                },
            });
        }
        return res.status(500).json({
            error: {
                msg: "An error occurred during authentication. Please try again later.",
            },
        });
    }
};

const removeBearer = (tokenWithBearer) => {
    return tokenWithBearer.replace("Bearer ", "");
};

module.exports = authorization;
