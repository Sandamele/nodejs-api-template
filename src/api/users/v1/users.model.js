const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/db.connection");

const Users = sequelize.define(
    "users",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { timestamps: true },
);
const Otp = sequelize.define(
    "otps",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Users,
                key: "id",
            },
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        used: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        expiryDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    { timestamps: true },
);

const LoggedDeletedUsers = sequelize.define(
    "loggedDeletedUsers",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { timestamps: true },
);
module.exports = { Users, Otp, LoggedDeletedUsers };
