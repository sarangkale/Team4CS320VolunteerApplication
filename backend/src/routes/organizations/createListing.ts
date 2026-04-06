import express from "express";
import { createSupabaseClient } from "../authRouting.ts";
import { bodyHasEntries, getAccountProfile, type OrganizationProfile } from "../../utils.ts";

export type ListingData = {
    capacity?: number | null;
    categories?: string | null;
    description?: string | null;
    distance?: number | null;
    duration?: string | null;
    listing_date?: string | null;
    listing_id?: string;
    listing_name?: string | null;
    needed_skill?: string | null;
    org_id: string;
    transport?: string | null;
    volunteer_time?: string | null;
};

export default async function createListing(req: express.Request, res: express.Response) {
    const validation = bodyHasEntries(["name", "capacity", "description", "listing_date", "duration"], req.body, res);

    if (validation) {
        return validation;
    }

    const { name, capacity, description, listing_date, duration } = req.body;

    const { accessToken, refreshToken } = req;
    if (!accessToken || !refreshToken) {
        return res.status(500).json({ error: "Failed to get access and refresh tokens" });
    }
    const supabase = await createSupabaseClient(accessToken!, refreshToken!);

    const { data, error } = await supabase.from("account roles").select("role");
    if (data) {
        if (data[0]!.role !== "Organization") {
            return res.status(401).json({ error: "Only organizations can create listings" });
        }
    } else {
        return res.status(400).json(error);
    }

    const accountResult = await getAccountProfile("Organization", supabase);
    if (accountResult.type === "error") {
        return res.status(500).json(accountResult.error);
    }

    const profile = accountResult.data.profile as OrganizationProfile;

    const listing: ListingData = {
        org_id: profile.org_id,
        listing_name: name,
        capacity,
        description,
        listing_date,
        duration
    };

    const { data: creationData, error: creationError } = await supabase.from("listing").insert(listing).select("listing_id");
    if (creationError) {
        return res.status(500).json(creationError);
    }

    // TODO: Implement Supabase row-level security policy for update
    await supabase.from("organization").update({ all_listings: `${profile.all_listings},${creationData}` });
    return res.json({ listing, id: creationData });
}
