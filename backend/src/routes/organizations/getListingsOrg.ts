import express from "express";
import { createSupabaseClient } from "../authRouting.ts";
import { getAccountProfile, type OrganizationProfile } from "../../utils.ts";

export default async function getListings(req: express.Request, res: express.Response) {
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

    const { data: listings, error } = await supabase
        .from("listing")
        .select("*")
        .eq("org_id", profile.org_id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    return res.json({ data: listings ?? [] });
}