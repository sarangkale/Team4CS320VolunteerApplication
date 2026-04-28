import express from "express";
import { createSupabaseClient } from "../authRouting.ts";
import { bodyHasEntries, getAccountProfile } from "../../utils.ts";
import type { ListingData, OrganizationProfile } from "../../../../shared/types.ts";

export default async function createListing(req: express.Request, res: express.Response) {
    const validation = bodyHasEntries(
        ["name", "capacity", "description", "listing_date", "duration", "categories", "street", "city", "state", "zip_code", "needed_skill", "transport"]
        , req.body, res);

    if (validation) {
        return validation;
    }

    const { name, capacity, description, listing_date, duration, categories, street, city, state, zip_code, needed_skill, transport } = req.body;

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

    const coords = await geocodeAddress(street, city, state, zip_code);

    if (typeof coords === "string") {
        return res.status(500).json({ error: "Error while calculating longitude and latitude coordinates", message: coords })
    }

    const { latitude, longitude } = coords;

    const listing: ListingData = {
        org_id: profile.org_id,
        org_name: profile.org_name!,
        listing_name: name,
        description,
        listing_date,
        duration,
        capacity,
        categories,
        needed_skill,
        transport,
        street,
        city,
        state,
        zip_code,
        latitude,
        longitude,
    };

    const { data: creationData, error: creationError } = await supabase.from("listing").insert(listing).select("listing_id").single();
    if (creationError) {
        return res.status(500).json({message: "Error while creating listing.", creationError});
    }

    if (profile.all_listings !== undefined) {
        const updatedListings = profile.all_listings
            ? `${profile.all_listings},${creationData.listing_id}`
            : `${creationData.listing_id}`;

        const { error: updateError } = await supabase
            .from("organization")
            .update({ all_listings: updatedListings })
            .eq("org_id", profile.org_id);

        if (updateError) {
            return res.status(500).json({message: "Error while updating organization information.", updateError});
        }
    }

    return res.json({ listing, id: creationData.listing_id });
}

export async function geocodeAddress(
    street: string,
    city: string,
    state: string,
    zip_code: string
): Promise<{ latitude: number; longitude: number } | string> {
    try {
        const query = encodeURIComponent(
            `${street}, ${city}, ${state} ${zip_code}`
        );

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
            {
                headers: {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0"
                },
            }
        );
        if (!response.ok) {
            return response.statusText;
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            return "Malformed data";
        }

        return {
            latitude: Number(data[0].lat),
            longitude: Number(data[0].lon),
        };
    } catch (error) {
        return "Geocoding failed:" + error;
    }
}
