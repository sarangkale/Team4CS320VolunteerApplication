import Express from "express";
import { createSupabaseClient } from "../authRouting.ts";
import { getAccountProfile, type OrganizationProfile } from "../../utils.ts";

export default async function ownedListings(req: Express.Request, res: Express.Response) {
    const supabase = await createSupabaseClient(req.accessToken!, req.refreshToken!);

    const profile = await getAccountProfile("Organization", supabase);

    if (profile.type == "error") {
        return res.status(500).json({error: profile.error});
    }

    const id = (profile.data.profile as OrganizationProfile).org_id;
    
    const { data, error } = await supabase.from("listing").select().eq("org_id", id);

    if (error) {
        return res.status(500).json(error);
    }

    return res.json(data);
}
