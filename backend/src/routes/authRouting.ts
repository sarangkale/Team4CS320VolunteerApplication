import express from "express";
import { type SupabaseClient, createClient } from "@supabase/supabase-js";
import type { Database } from "../../../src/database.types.ts";
import logIn from "./auth/logIn.ts";
import { organizationSignUp, volunteerSignUp } from "./auth/signUp.ts";
import logout from "./auth/logout.ts";

const router = express.Router();

router.post("/login", logIn);
router.post("/signup_volunteer", volunteerSignUp);
router.post("/signup_organization", organizationSignUp);
router.post("/logout", logout);

function getSupabaseEnv(): { url: string; anonKey: string } {
    const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        throw new Error("Missing Supabase environment variables. Set SUPABASE_URL/SUPABASE_ANON_KEY or VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY.");
    }

    return { url, anonKey };
}

export async function createSupabaseClient(accessToken: string, refreshToken: string): Promise<SupabaseClient<Database>> {
    const { url, anonKey } = getSupabaseEnv();
    const client = createClient(
        url,
        anonKey,
    );
    await client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
    return client;
}

export function createSupabaseClientNoAuth(): SupabaseClient<Database> {
    const { url, anonKey } = getSupabaseEnv();
    return createClient(
        url,
        anonKey,
    );
}

export default router;
