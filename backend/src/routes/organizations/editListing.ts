import Express from "express";
import { createSupabaseClient } from "../authRouting.ts";
import { bodyHasEntries } from "../../utils.ts";
import type { ListingData } from "../../../../shared/types.ts";

export default async function editListing(req: Express.Request, res: Express.Response) {
    const validation = bodyHasEntries(
        ["listing_id", "name", "capacity", "description", "listing_date", "duration", "categories", "street", "city", "state", "zip_code", "needed_skill", "transport"]
        , req.body, res);

    if (validation) {
        return validation;
    }

    const { listing_id, name, capacity, description, listing_date, duration, categories, street, city, state, zip_code, needed_skill, transport } = req.body;

    const { accessToken, refreshToken } = req;
    if (!accessToken || !refreshToken) {
        return res.status(500).json({ error: "Failed to get access and refresh tokens" });
    }
    const supabase = await createSupabaseClient(accessToken, refreshToken);

    const { data, error } = await supabase.from("account roles").select("role").single();
    if (data) {
        if (data!.role !== "Organization") {
            return res.status(401).json({ error: "Only organizations can update listings" });
        }
    } else {
        return res.status(400).json(error);
    }

    const { error: updateError } = await supabase.from("listing").update({
        listing_name: name,
        capacity: Number(capacity),
        description,
        listing_date,
        duration,
        categories,
        street,
        city,
        state,
        zip_code,
        needed_skill,
        transport,
    } as ListingData).eq("listing_id", listing_id);

    if (error) {
        return res.status(400).json(updateError);
    }

    return res.send("Successfully updated listing " + listing_id);
}
