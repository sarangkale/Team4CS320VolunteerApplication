import express from "express";
import { type User } from "@supabase/supabase-js";
import { createSupabaseClientNoAuth } from "../routes/authRouting.ts";
import { clearCookies, createCookies } from "../utils.ts";

declare global {
    namespace Express {
        interface Request {
            user?: User,
            accessToken?: string,
            refreshToken?: string,
        }
    }
}

export default async function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    let accessToken = req.cookies["supabase-access-token"];
    let refreshToken = req.cookies["supabase-refresh-token"];

    if (!accessToken || !refreshToken) {
        return res.status(401).json({ error: "No token found" });
    }

    const supabase = createSupabaseClientNoAuth();

    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error) {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
        if (refreshError) {
            return res.status(401).json(refreshError);
        }

        createCookies(refreshData.session!, res);
        refreshToken = refreshData.session?.refresh_token;
        accessToken = refreshData.session?.access_token;
    }

    req.user = data.user!;
    req.accessToken = accessToken;
    req.refreshToken = refreshToken;

    return next();
}
