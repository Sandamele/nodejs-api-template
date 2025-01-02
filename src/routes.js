const routers = require("express")();
const usersV1Routes = require("./api/users/users.routes");
const rateLimit = require("express-rate-limit");
routers.use(rateLimit.rateLimit({
    limit: 100,
    windowMs: 10 * 60 * 1000,
    message: "Too many request from this IP"
}))
routers.use("/v1/users/auth", usersV1Routes);
module.exports = routers;
