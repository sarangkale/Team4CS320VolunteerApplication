import express from "express";
import { bodyHasEntries } from "../../utils.ts";
import { createSupabaseClient } from "../authRouting.ts";

export default async function getApplicationAnswers(req: express.Request, res: express.Response) {
    const validation = bodyHasEntries(["listing_id"], req.body, res);

    if (validation) {
        return validation;
    }

    const { listing_id } = req.body;

    const { accessToken, refreshToken } = req;
    if (!accessToken || !refreshToken) {
        return res.status(500).json({ error: "Failed to get access and refresh tokens" });
    }
    const supabase = await createSupabaseClient(accessToken, refreshToken);

    const { data, error } = await supabase.from("account roles").select("role").single();
    if (data) {
        if (data!.role !== "Organization") {
            return res.status(500).json({ error: "Only organizations can access applicants' answers" });
        }
    } else {
        return res.status(500).json(error);
    }

    const { data: applicationData, error: applicationError } = await supabase.from("application").select().eq("listing_id", listing_id);

    if (applicationError) {
        return res.status(500).json(applicationError);
    }

    return res.status(200).json(applicationData);
}
