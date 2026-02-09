import express from "express";
import cors from "cors";
import helmet from "helmet";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth/index.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";

export function createApp() {
    const app = express();

    // Security middleware
    app.use(helmet());

    // Trust Proxy for Railway/Vercel
    app.set("trust proxy", 1);

    // CORS configuration - support multiple origins from environment
    const allowedOrigins: string[] = [
        process.env.FRONTEND_URL || "http://localhost:5173",
        process.env.FRONTEND_PRODUCTION_URL,
        "https://financial-tracker-weld.vercel.app",
        "https://financial-tracker-bu1g410nr-michaels-projects-85e1584b.vercel.app"
    ].filter((origin): origin is string => Boolean(origin)); // Remove undefined values

    app.use(
        cors({
            origin: allowedOrigins,
            credentials: true,
        })
    );

    // Body parsing
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true }));

    // Better Auth routes - mount at /api/auth
    app.all("/api/auth/*", toNodeHandler(auth));

    // API routes
    app.use("/api", routes);

    // Error handling
    app.use(errorHandler);

    return app;
}
