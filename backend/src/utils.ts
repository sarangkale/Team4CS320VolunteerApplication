import type { PostgrestError, Session, SupabaseClient } from "@supabase/supabase-js";
import express from "express";
import type { CookieOptions } from "react-router";
import { type AccountRole, type Result, type Account, success, failure } from "../../shared/types.ts";

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

const cookieOpts: CookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
};

export function createCookies(session: Session, res: express.Response) {
    res.cookie(
        "supabase-access-token", session.access_token,
        cookieOpts
    );
    res.cookie(
        "supabase-refresh-token", session.refresh_token,
        cookieOpts
    );
}

export function clearCookies(res: express.Response) {
    res.clearCookie(
        "supabase-access-token",
        cookieOpts
    );

    res.clearCookie(
        "supabase-refresh-token",
        cookieOpts
    );
}

export async function getAccountProfile(role: AccountRole, supabase: SupabaseClient): Promise<Result<Account, PostgrestError>> {
    if (role === "User") {
        const { data, error } = await supabase.from("profiles").select();
        if (data) {
            const account: Account = {
                role: "User",
                profile: data![0],
            };
            return success(account);
        } else {
            return failure(error);
        }
    } else {
        const { data, error } = await supabase.from("organization").select();
        if (data) {
            const account: Account = {
                role: "Organization",
                profile: data![0],
            };
            return success(account);
        } else {
            return failure(error);
        }
    }
}
