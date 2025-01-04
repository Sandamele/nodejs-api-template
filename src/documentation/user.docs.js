/**
 * Swagger Documentation for Users
 */
const userDocs = {
    tags: [
        {
            name: "Users",
            description: "User management and authentication",
        },
    ],
    paths: {
        "/api/v1/users/auth/register": {
            post: {
                summary: "Register a new user",
                tags: ["Users"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: {
                                        type: "string",
                                        example: "user@example.com",
                                    },
                                    username: {
                                        type: "string",
                                        example: "user123",
                                    },
                                    password: {
                                        type: "string",
                                        example: "strongPassword123",
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "User registered successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            type: "object",
                                            example: {
                                                id: 1,
                                                email: "user@example.com",
                                                username: "user123",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Validation error or duplicate user",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        error: {
                                            type: "object",
                                            example: { msg: "Email already exists" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    500: {
                        description: "Internal server error",
                    },
                },
            },
        },
        "/api/v1/users/auth/login": {
            post: {
                summary: "Log in a user",
                tags: ["Users"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: {
                                        type: "string",
                                        example: "user@example.com",
                                    },
                                    password: {
                                        type: "string",
                                        example: "strongPassword123",
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Login successful",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            type: "object",
                                            example: { token: "jwt-token-string" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Invalid credentials",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        error: {
                                            type: "object",
                                            example: {
                                                msg: "Either email or password is incorrect",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    500: {
                        description: "Internal server error",
                    },
                },
            },
        },
        "/api/v1/users/auth/reset-password": {
            post: {
                summary: "Reset a user's password",
                tags: ["Users"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    currentPassword: {
                                        type: "string",
                                        example: "oldPassword123",
                                    },
                                    password: {
                                        type: "string",
                                        example: "newPassword123",
                                    },
                                    confirmationPassword: {
                                        type: "string",
                                        example: "newPassword123",
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Password has been reset successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            type: "object",
                                            example: {
                                                msg: "Password has been reset successfully",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description:
                            "Bad request due to password mismatch or incorrect current password",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        error: {
                                            type: "object",
                                            example: { msg: "User not found" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    500: {
                        description: "Internal server error",
                    },
                },
            },
        },
        "/api/v1/users/auth/otps": {
            post: {
                summary: "Generate OTP for Password Reset",
                tags: ["Users"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: {
                                        type: "string",
                                        example: "user@example.com",
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "OTP token generated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            type: "object",
                                            properties: {
                                                token: {
                                                    type: "string",
                                                    example: "generated-otp-token",
                                                },
                                                expiryDate: {
                                                    type: "string",
                                                    example: "2025-01-01T10:30:00Z",
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "User not found or invalid request",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        error: {
                                            type: "object",
                                            example: { msg: "User not found" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    500: {
                        description: "Internal server error",
                    },
                },
            },
        },
        "/api/v1/users/auth/forgot-password": {
            post: {
                summary: "Reset Password Using OTP",
                tags: ["Users"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    token: {
                                        type: "string",
                                        example: "generated-otp-token",
                                    },
                                    password: {
                                        type: "string",
                                        example: "newPassword123",
                                    },
                                    confirmationPassword: {
                                        type: "string",
                                        example: "newPassword123",
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Password has been reset successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            type: "object",
                                            properties: {
                                                msg: {
                                                    type: "string",
                                                    example: "Password has been reset successfully",
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Invalid token, expired token, or mismatched passwords",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        error: {
                                            type: "object",
                                            example: {
                                                msg: "Token has expired. Request for new token",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    500: {
                        description: "Internal server error",
                    },
                },
            },
        },
        "/api/v1/users/auth/delete-account": {
            delete: {
                summary: "Delete a user account",
                description:
                    "Deletes a user account permanently. Requires OTP and password for security verification.",
                tags: ["Users"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    otp: {
                                        type: "string",
                                        description: "OTP token for account deletion verification.",
                                        example: "abc123xyz456",
                                    },
                                    password: {
                                        type: "string",
                                        description:
                                            "The user's current password for additional security.",
                                        example: "securepassword123",
                                    },
                                },
                                required: ["otp", "password"],
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Account deleted successfully.",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            type: "object",
                                            properties: {
                                                msg: {
                                                    type: "string",
                                                    example: "Account deleted successfully",
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description:
                            "Bad request. Possible issues include invalid token, expired token, incorrect password, or unauthorised access.",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        error: {
                                            type: "object",
                                            properties: {
                                                msg: {
                                                    type: "string",
                                                    example: "Invalid token",
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    500: {
                        description: "Internal server error.",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        error: {
                                            type: "object",
                                            properties: {
                                                msg: {
                                                    type: "string",
                                                    example: "Internal server error",
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

module.exports = userDocs;
