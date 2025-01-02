const routers = require("express")();
const usersV1Routes = require("./api/users/users.routes");
const authorization = require("./middleware/authorization");
routers.use("/v1/users/auth", usersV1Routes);
routers.get("/v1/testing", authorization, (req, res) => {
    res.send("End");
});
module.exports = routers;
