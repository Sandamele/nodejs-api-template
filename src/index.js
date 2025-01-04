const express = require("express");
const { connection, close, sequelize } = require("./config/db.connection");
const app = express();
const PORT = process.env.PORT || 3000;
const allRoutes = require("./routes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
(async () => {
    // Initialise the database connection
    await connection();

    // Sync the database and models
    try {
        await sequelize.sync({ force: false }); // force: true drops the table if it exists
        console.log("Database synchronized.");
    } catch (error) {
        console.error("Error synchronizing database:", error);
    }
    app.use(express.json());

    // App routes here
    app.get("/", (req, res) => {
        res.send("Hello, World!");
    });
    app.use("/api", allRoutes);
    app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Handle 404 errors
    app.use((req, res, next) => {
        res.status(404).json({ error: "Not Found" });
    });

    // Global error handler
    app.use((err, req, res, next) => {
        console.error(err.stack);
        const isProduction = process.env.NODE_ENV === "production";
        res.status(err.status || 500).json({
            error: isProduction ? "Something went wrong!" : err.message,
        });
    });
    // Start the server
    const server = app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Handle graceful shutdown
    process.on("SIGINT", async () => {
        console.log("Shutting down gracefully...");
        await close();
        server.close(() => {
            console.log("Server closed.");
            process.exit(0);
        });
    });
})();
