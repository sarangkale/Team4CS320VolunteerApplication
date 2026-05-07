import Express from "express";
import { bodyHasEntries } from "../../utils.ts";
import { createSupabaseClient } from "../authRouting.ts";

export default async function editProfile(req: Express.Request, res: Express.Response) {
    const validation = bodyHasEntries(["bio", "org_name", "website", "org_id"], req.body, res);

    if (validation) {
        return validation;
    }

    const { bio, org_name, website, org_id } = req.body;

    const { accessToken, refreshToken } = req;
    if (!accessToken || !refreshToken) {
        return res.status(500).json({ error: "Failed to get access and refresh tokens" });
    }
    const supabase = await createSupabaseClient(accessToken, refreshToken);

    const { data, error } = await supabase.from("organization").update({
        bio,
        org_name,
        website,
    }).eq("org_id", org_id).select().single();

    if (error) {
        return res.status(500).json(error);
    }

    return res.json(data);
}
