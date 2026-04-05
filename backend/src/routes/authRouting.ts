import express from "express";
import { type SupabaseClient, createClient } from "@supabase/supabase-js";
import type { Database } from "../../../src/database.types.ts";
import logIn from "./auth/logIn.ts";
import { organizationSignUp, volunteerSignUp } from "./auth/signUp.ts";

const router = express.Router();

router.post("/login", logIn);
router.post("/signup_volunteer", volunteerSignUp);
router.post("/signup_organization", organizationSignUp);

export function createSupabaseClient(token: string): SupabaseClient<Database> {
    return createClient(
        process.env.VITE_SUPABASE_URL!,
        process.env.VITE_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Authorization: `Bearer: ${token}`
                }
            }
        });
}

export function createSupabaseClientNoAuth(): SupabaseClient<Database> {
    return createClient(
        process.env.VITE_SUPABASE_URL!,
        process.env.VITE_SUPABASE_ANON_KEY!,
    );
}

export default router;
