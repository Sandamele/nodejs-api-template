const swaggerJSDoc = require("swagger-jsdoc");
const userDocs = require("../documentation/user.docs");
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Node.js API Template",
            version: "1.0.0",
            description: `This system serves as a modular base for various web applications that require user registration, authentication, password management, email notifications, and image uploads. It is ideal for platforms such as e-commerce sites, social media applications, and online services.`,
        },
        tags: [...userDocs.tags],
        paths: { ...userDocs.paths },
    },
    apis: [], // Adjust the path as necessary
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
