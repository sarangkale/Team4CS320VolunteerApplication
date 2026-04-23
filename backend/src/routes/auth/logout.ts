import express from "express";
import { createSupabaseClientNoAuth } from "../authRouting.ts";
import { clearCookies } from "../../utils.ts";

export default async function logout(_req: express.Request, res: express.Response) {
    const supabase = createSupabaseClientNoAuth();
    const {error} = await supabase.auth.signOut();
    if (error) {
        return res.status(500).json(error);
    }

    clearCookies(res);

    return res.status(200).send("Logged out");
}
