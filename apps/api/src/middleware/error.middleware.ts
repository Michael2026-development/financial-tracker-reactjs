import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

/**
 * Global error handling middleware
 */
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error("Error:", err);

    // Handle Zod validation errors
    if (err instanceof ZodError) {
        return res.status(400).json({
            error: "Validation Error",
            message: "Invalid request data",
            details: err.errors.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            })),
        });
    }

    // Handle known error types
    if (err.name === "NotFoundError") {
        return res.status(404).json({
            error: "Not Found",
            message: err.message || "Resource not found",
        });
    }

    if (err.name === "UnauthorizedError") {
        return res.status(401).json({
            error: "Unauthorized",
            message: err.message || "Authentication required",
        });
    }

    if (err.name === "ForbiddenError") {
        return res.status(403).json({
            error: "Forbidden",
            message: err.message || "Access denied",
        });
    }

    // Default to 500 Internal Server Error
    return res.status(500).json({
        error: "Internal Server Error",
        message:
            process.env.NODE_ENV === "production"
                ? "An unexpected error occurred"
                : err.message,
    });
}

/**
 * Custom error classes
 */
export class NotFoundError extends Error {
    constructor(message = "Resource not found") {
        super(message);
        this.name = "NotFoundError";
    }
}

export class UnauthorizedError extends Error {
    constructor(message = "Authentication required") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export class ForbiddenError extends Error {
    constructor(message = "Access denied") {
        super(message);
        this.name = "ForbiddenError";
    }
}
