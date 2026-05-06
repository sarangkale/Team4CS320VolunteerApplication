import express from "express";
import { createSupabaseClient } from "../authRouting.ts";
import { getAccountProfile, type OrganizationProfile } from "../../utils.ts";

export default async function updateProfile(req: express.Request, res: express.Response) {
    const { accessToken, refreshToken } = req;
    if (!accessToken || !refreshToken) {
        return res.status(401).json({ error: "Missing tokens" });
    }

    const supabase = await createSupabaseClient(accessToken, refreshToken);

    const accountResult = await getAccountProfile("Organization", supabase);
    if (accountResult.type === "error") {
        return res.status(500).json(accountResult.error);
    }

    const profile = accountResult.data.profile as OrganizationProfile;

    const { org_name, email, phone, location, website, date_established, desired_skills } = req.body;

    const { error } = await supabase
        .from("organization")
        .update({ org_name, email, phone, location, website, date_established, desired_skills })
        .eq("org_id", profile.org_id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true });
}