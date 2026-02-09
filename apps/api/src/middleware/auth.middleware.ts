import type { Request, Response, NextFunction } from "express";
import { auth, type Session, type User } from "../auth/index.js";
import { fromNodeHeaders } from "better-auth/node";

// Extend Express Request type to include user and session
declare global {
    namespace Express {
        interface Request {
            user?: User;
            session?: Session;
        }
    }
}

/**
 * Middleware to require authentication
 * Attaches user and session to the request object
 */
export async function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "Please sign in to access this resource",
            });
        }

        req.user = session.user;
        req.session = session;

        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to authenticate request",
        });
    }
}

/**
 * Optional authentication middleware
 * Attaches user and session if available, but doesn't require it
 */
export async function optionalAuth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (session) {
            req.user = session.user;
            req.session = session;
        }

        next();
    } catch (error) {
        // Continue without auth on error
        next();
    }
}
