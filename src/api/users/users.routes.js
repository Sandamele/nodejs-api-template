const express = require("express");
const {
    register: registerV1,
    login: loginV1,
    resetPassword: resetPasswordV1,
} = require("./v1/users.controllers");
const {
    validateRegistration,
    validateLogin,
    validateResetPassword,
} = require("../../middleware/users.validation");
const authorization = require("../../middleware/authorization");

const router = express.Router();

// Route for user registration
router.post("/register", validateRegistration, registerV1);
router.post("/login", validateLogin, loginV1);
router.post("/reset-password", validateResetPassword, authorization, resetPasswordV1);
module.exports = router;
