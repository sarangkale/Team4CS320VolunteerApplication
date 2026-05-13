import express from "express";
import { createSupabaseClient } from "../authRouting.ts";
import { getAccountProfile } from "../../utils.ts";
import type { OrganizationProfile, UserProfile } from "../../../../shared/types.ts";

export default async function updateProfile(req: express.Request, res: express.Response) {
    const { accessToken, refreshToken } = req;
    if (!accessToken || !refreshToken) {
        return res.status(500).json({ error: "Missing tokens" });
    }

    const supabase = await createSupabaseClient(accessToken, refreshToken);

    const accountResult = await getAccountProfile("User", supabase);
    if (accountResult.type === "error") {
        return res.status(500).json(accountResult.error);
    }

    const profile = accountResult.data.profile as UserProfile;

    const { bio, first_name, last_name, school, major, graduation_year, phone } = req.body;

    const { error } = await supabase
        .from("profiles")
        .update({ bio, first_name, last_name, school, major, graduation_year: Number(graduation_year), phone } as UserProfile)
        .eq("user_id", profile.user_id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true });
}
