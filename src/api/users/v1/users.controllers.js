const validationResponse = require("../../../utils/validationResponse");
const Users = require("./users.model");
const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
        return res.status(200).json({ data: saveUser });
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
        const msg = "Either email or password is incorrect";
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

module.exports = { register, login, resetPassword };
