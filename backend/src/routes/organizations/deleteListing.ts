import express from "express";
import { bodyHasEntries, getAccountProfile } from "../../utils.ts";
import type { OrganizationProfile } from "../../../../shared/types.ts";
import { createSupabaseClient } from "../authRouting.ts";

export default async function deleteListing(req: express.Request, res: express.Response) {
    const validation = bodyHasEntries(["listing_id"], req.body, res);

    if (validation) {
        return validation;
    }

    const { listing_id } = req.body;

    const { accessToken, refreshToken } = req;
    if (!accessToken || !refreshToken) {
        return res.status(500).json({ error: "Failed to get access and refresh tokens" });
    }
    const supabase = await createSupabaseClient(accessToken!, refreshToken!);

    const accountResult = await getAccountProfile("Organization", supabase);
    if (accountResult.type === "error") {
        return res.status(500).json(accountResult.error);
    }

    const profile = accountResult.data.profile as OrganizationProfile;

    if (profile.all_listings !== undefined) {
        const updatedListings = profile.all_listings?.split(",").filter(listing => listing != listing_id).join(",") || "";

        const { error: updateError } = await supabase
            .from("organization")
            .update({ all_listings: updatedListings })
            .eq("org_id", profile.org_id);

        if (updateError) {
            return res.status(500).json({message: "Error while updating organization information.", updateError});
        }
    }

    const { data: listingApplicants, error: listingApplicantsError } = await supabase.from("listing").select().eq("listing_id", listing_id).single();

    if (listingApplicantsError) {
        return res.status(500).json(listingApplicantsError);
    }

    for (const applicant of listingApplicants?.applicants || []) {
        const { data: applicantData, error: applicantError } = await supabase.from("profiles").select().eq("user_id", applicant).single();
        if (applicantError) {
            return res.status(500).json(applicantError);
        }

        const updatedUpcomingListings = applicantData.upcoming_listings.filter(e => e !== listing_id);

        await supabase.from("profiles").update({upcoming_listings: updatedUpcomingListings}).eq("user_id", applicant);
    }

    await supabase.from("listing").delete().eq("listing_id", listing_id).select();

    return res.status(200);
}
