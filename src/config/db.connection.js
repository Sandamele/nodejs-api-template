const { Sequelize } = require("sequelize");
require("dotenv").config();
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "postgres",
    pool: {
        max: 10,
        min: 0,
        idle: 10000,
        acquire: 30000,
    },
    logging: (msg) => {},
});
const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

const close = async () => {
    if (sequelize) {
        try {
            await sequelize.close();
            console.log("Database connection closed.");
        } catch (error) {
            console.error("Error closing database connection:", error);
            throw error;
        }
    } else {
        console.log("No database connection to close.");
    }
};

// Export the sequelize instance
module.exports = { sequelize, connection, close };
