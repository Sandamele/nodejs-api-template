const validationResponse = require("../../../utils/validationResponse");
const { Users, Otp, LoggedDeletedUsers } = require("./users.model");
const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../../../utils/generateToken");
const register = async (req, res) => {
    try {
        const errors = validationResult(req);

        // Validates if the fields are missing
        if (errors.array().length > 0) return validationResponse(res, errors);

        const { email, username, password } = req.body;

        const emailExist = await Users.findOne({ where: { email } });

        const usernameExist = await Users.findOne({ where: { username } });

        if (emailExist !== null) {
            return res.status(400).json({ error: { msg: "Email already exists" } });
        }

        if (usernameExist !== null) {
            return res.status(400).json({ error: { msg: "Username already exists" } });
        }

        // Hashes the password
        const hashedPassword = await bcryptjs.hash(password, 10);
        const newUser = Users.build({
            email,
            username,
            password: hashedPassword,
        });

        // Save the user to the database
        const saveUser = await newUser.save();
        return res
            .status(200)
            .json({
                data: {
                    id: saveUser.getDataValue("id"),
                    email: saveUser.getDataValue("email"),
                    username: saveUser.getDataValue("username"),
                },
            });
    } catch (error) {
        console.log("Register error: ", error);
        return res.status(500).json({ error: { msg: "Internal server error" } });
    }
};

const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors.array().length > 0) return validationResponse(res, errors);
        const { email, password } = req.body;
        const user = await Users.findOne({ where: { email } });
        const msg = "Invalid email or password ";
        if (!user) return res.status(400).json({ error: { msg } });
        const comparePassword = await bcryptjs.compare(password, user.getDataValue("password"));

        // Validate password
        if (!comparePassword) return res.status(400).json({ errors: { msg } });

        // Generate JWT token
        const payload = {
            id: user.getDataValue("id"),
            email: user.getDataValue("email"),
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });
        return res.status(200).json({ data: { token } });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: { msg: "Internal server error" } });
    }
};

const resetPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors.array().length > 0) return validationResponse(res, errors);
        const { currentPassword, password, confirmationPassword } = req.body;
        if (password !== confirmationPassword) {
            return res.status(400).json({ error: { msg: "Confirmation password do not match" } });
        }
        const user = await Users.findOne({ where: { id: req.user.id } });
        const userPassword = await bcryptjs.compare(currentPassword, user.getDataValue("password"));

        if (!userPassword) return res.status(400).json({ error: { msg: "User not found" } });

        // Hash the new password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Update the user's password in the database
        await Users.update({ password: hashedPassword }, { where: { id: req.user.id } });

        return res.status(200).json({ data: { msg: "Password has been reset successfully" } });
    } catch (error) {
        console.error("Reset Password error:", error);
        return res.status(500).json({ error: { msg: "Internal server error" } });
    }
};

const otps = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors.array().length > 0) return validationResponse(res, errors);
        const { email } = req.body;
        const user = await Users.findOne({ where: { email } });
        if (user === null) return res.status(400).json({ error: { msg: "User not found" } });

        const date = new Date();
        date.setMinutes(date.getMinutes() + 5); // expires in five minutes
        const expireAt = date.toUTCString();

        const otp = Otp.build({
            userId: user.getDataValue("id"),
            token: generateToken(64),
            expiryDate: expireAt,
        });
        await otp.save();
        return res.status(200).json({
            data: {
                token: otp.getDataValue("token"),
                expiryDate: otp.getDataValue("expiryDate"),
            },
        });
    } catch (error) {
        console.error("Otp error:", error);
        return res.status(500).json({ error: { msg: "Internal server error" } });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors.array().length > 0) return validationResponse(res, errors);
        const { token, password, confirmationPassword } = req.body;
        if (password !== confirmationPassword) {
            return res.status(400).json({ error: { msg: "Confirmation password do not match" } });
        }
        const getToken = await Otp.findOne({ where: { token } });

        if (getToken === null) {
            return res.status(400).json({ error: { msg: "Invalid credentials" } });
        }

        // If the token was used
        if (getToken.getDataValue("used")) {
            return res
                .status(400)
                .json({ error: { msg: "Token has expired. Request for new token" } });
        }
        const currentDate = new Date();
        const otpExipery = new Date(getToken.getDataValue("expiryDate"));
        if (currentDate > otpExipery) {
            return res
                .status(400)
                .json({ error: { msg: "Token has expired. Request for new token" } });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        await Users.update(
            { password: hashedPassword },
            { where: { id: getToken.getDataValue("userId") } },
        );
        await Otp.update({ used: true }, { where: { id: getToken.getDataValue("id") } });
        return res.status(200).json({ data: { msg: "Password has been reset successfully" } });
    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({ error: { msg: "Internal server error" } });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors.array().length > 0) return validationResponse(res, errors);
        // Token is from otp and password is required for added extra security
        const { otp, password } = req.body;
        const getToken = await Otp.findOne({ where: { token: otp } });
        if (getToken === null) {
            return res.status(400).json({ error: { msg: "Invalid otp" } });
        }

        // If the token was used
        if (getToken.getDataValue("used")) {
            return res
                .status(400)
                .json({ error: { msg: "Token has expired. Request for new token" } });
        }
        const currentDate = new Date();
        const otpExipery = new Date(getToken.getDataValue("expiryDate"));
        if (currentDate > otpExipery) {
            return res
                .status(400)
                .json({ error: { msg: "Token has expired. Request for new token" } });
        }

        const user = req.user;

        // Check if the account belongs to owner
        if (user.id !== getToken.getDataValue("userId")) {
            return res.status(400).json({ error: { msg: "User not found" } });
        }
        const getUserInfo = await Users.findOne({ where: { id: getToken.getDataValue("userId") } });
        const comparePassword = await bcryptjs.compare(
            password,
            getUserInfo.getDataValue("password"),
        );

        if (!comparePassword) return res.status(400).json({ error: { msg: "User not found" } });

        const deleteUsersOtps = await Otp.findAll({
            where: { userId: getToken.getDataValue("userId") },
        });
        await Promise.all(
            deleteUsersOtps.map(async (deleteUsersOtp) => await deleteUsersOtp.destroy()),
        );

        await getUserInfo.destroy();
        const loggedDeletedUsers = LoggedDeletedUsers.build({
            email: getUserInfo.getDataValue("email"),
            username: getUserInfo.getDataValue("username"),
        });
        await loggedDeletedUsers.save();
        return res.status(200).json({ data: { msg: "Account deleted successfully" } });
    } catch (error) {
        console.error("Delete account error:", error);
        return res.status(500).json({ error: { msg: "Internal server error" } });
    }
};
module.exports = { register, login, resetPassword, otps, forgotPassword, deleteAccount };
