const { body } = require("express-validator");

const validateRegistration = [
    body("email")
        .trim()
        .escape()
        .isEmail()
        .withMessage("Email is required")
        .normalizeEmail()
        .withMessage("Invalid email"),
    body("username")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 10, max: 100 })
        .withMessage("Min character is 10 and Max character is 100"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Min character is 8"),
];

const validateLogin = [
    body("email").trim().escape().isEmail().withMessage("Email is required"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Min character is 8"),
];

const validateResetPassword = [
    body("currentPassword").trim().notEmpty().withMessage("Current password is required"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Min character is 8"),
    body("confirmationPassword").trim().notEmpty().withMessage("Confirmation password is required"),
];

const validateOtp = [
    body("email")
        .trim()
        .escape()
        .isEmail()
        .withMessage("Email is required")
        .normalizeEmail()
        .withMessage("Invalid email"),
];

const validateForgotPassword = [
    body("token").trim().notEmpty().withMessage("Token/OTP is required"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Min character is 8"),
    body("confirmationPassword").trim().notEmpty().withMessage("Confirmation password is required"),
];

const validateDeleteAccount = [
    body("otp").trim().notEmpty().withMessage("Token/OTP is required"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Min character is 8"),
];
module.exports = {
    validateRegistration,
    validateLogin,
    validateResetPassword,
    validateOtp,
    validateForgotPassword,
    validateDeleteAccount,
};
