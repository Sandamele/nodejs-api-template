const express = require("express");
const {
    register: registerV1,
    login: loginV1,
    resetPassword: resetPasswordV1,
    otps: otpsV1,
    forgotPassword: forgotPasswordV1,
    deleteAccount: deleteAccountV1,
} = require("./v1/users.controllers");
const {
    validateRegistration,
    validateLogin,
    validateResetPassword,
    validateOtp,
    validateForgotPassword,
    validateDeleteAccount,
} = require("../../middleware/users.validation");
const authorization = require("../../middleware/authorization");

const router = express.Router();

// Route for user registration
router.post("/register", validateRegistration, registerV1);
router.post("/login", validateLogin, loginV1);
router.post("/reset-password", authorization, validateResetPassword, resetPasswordV1);
router.post("/otps", validateOtp, otpsV1);
router.post("/forgot-password", validateForgotPassword, forgotPasswordV1);
router.delete("/delete-account", authorization, validateDeleteAccount, deleteAccountV1);
module.exports = router;
