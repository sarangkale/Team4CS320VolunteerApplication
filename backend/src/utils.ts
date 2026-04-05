import type { Session } from "@supabase/supabase-js";
import express from "express";

export function bodyHasEntries(requiredKeys: string[], body: Record<string, string>, res: express.Response): express.Response | undefined {
    const keysSet = new Set(requiredKeys);
    const bodyKeys = new Set(Object.keys(body))
    const missingKeys = keysSet.difference(bodyKeys);

    if (missingKeys.size !== 0) {
        return res.status(400).json({
            error: "Missing body parameters: "
                + missingKeys.entries().map(([e, _]) => e).toArray().join(", ")
        });
    }
}

export function createCookies(session: Session, res: express.Response) {
    res.cookie(
        "supabase-access-token", session.access_token,
        {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        }
    );
    res.cookie(
        "supabase-refresh-token", session.refresh_token,
        {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        }
    );
}

export function clearCookies(res: express.Response) {
    res.clearCookie(
        "supabase-access-token",
        {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        }
    );

    res.clearCookie(
        "supabase-refresh-token",
        {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        }
    );
}
