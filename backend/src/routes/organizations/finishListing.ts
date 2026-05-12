import express from "express";
import { bodyHasEntries } from "../../utils.ts";
import { createSupabaseClient } from "../authRouting.ts";

export default async function finishListing(req: express.Request, res: express.Response) {
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
            return res.status(401).json({ error: "Only organizations can finish events" });
        }
    } else {
        return res.status(500).json(error);
    }

    const { data: listingData, error: listingError } = await supabase.from("listing").select().eq("listing_id", listing_id).single();
    if (listingError) {
        return res.status(500).json(listingError);
    }

    const applicants = listingData.applicants;

    for (const applicant_id of applicants || []) {
        const { data: currentData, error: fetchError } = await supabase
            .from("profiles")
            .select("total_hours_completed, listing_history, upcoming_listings")
            .eq("user_id", applicant_id)
            .single();

        if (fetchError) {
            return res.status(500).json({ type: "error", error: fetchError });
        }

        const updatedHours = currentData!.total_hours_completed! + Number(listingData.duration!);
        const updatedHistory = currentData.listing_history;
        updatedHistory.push(listing_id);
        const updatedUpcomingListings = currentData.upcoming_listings.filter(e => e !== listing_id);

        const { error: updateError } = await supabase
            .from("profiles")
            .update({ total_hours_completed: updatedHours, listing_history: updatedHistory, upcoming_listings: updatedUpcomingListings})
            .eq("user_id", applicant_id)
            .select().single();

        if (updateError) {
            return res.status(500).json(updateError)
        }
    }

    await supabase.from("listing").delete().eq("listing_id", listing_id);

    await supabase.from("past_listings").insert(listingData);
}
