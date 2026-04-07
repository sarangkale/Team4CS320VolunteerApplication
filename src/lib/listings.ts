import { failure, getAccountProfile, success, type OrganizationProfile } from "../auth/auth";
import { supabase } from "./supabase";
import {type Result} from "../auth/auth.ts";
import { PostgrestError } from "@supabase/supabase-js";

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
    applicants?: string | null;
};

export async function createListing(name: string, capacity: number, description: string, date: string, duration: string): Promise<Result<null, PostgrestError | string>> {
    const accountResult = await getAccountProfile();
    if (accountResult.type == "error") {
        return failure(accountResult.error);
    }

    const { data, error } = await supabase.from("account roles").select("role");
    if (data) {
        if (data[0].role !== "Organization") {
            console.error("Only organizations can create listings.");
            return failure("Only organizations can create listings.");
        }
    } else {
        return failure(error);
    }

    const profile = accountResult.data.profile as OrganizationProfile;

    const listing: ListingData = {
        org_id: profile.org_id,
        listing_name: name,
        capacity,
        description,
        listing_date: date,
        duration,
    };

    const newListing = await supabase.from("listing").insert(listing).select("listing_id");

    // TODO: Implement Supabase row-level security policy for update
    await supabase.from("organization").update({all_listings: `${profile.all_listings},${newListing}`});
    return success(null);
}

export async function retrieveListings(rangeStart: number, rangeEnd: number): Promise<Result<ListingData[], PostgrestError>> {
    const { data, error } = await supabase.from("listing").select().range(rangeStart, rangeEnd);
    if (data) {
        return success(data);
    } else {
        return failure(error);
    }
}

export async function updateListingApplicant(listingId: string, username: string) {
    const { data: currentData, error: fetchError } = await supabase
        .from('listing')
        .select('applicants')
        .eq('listing_id', listingId)
        .single();

    if (fetchError) {
        console.error("Error fetching current applicants:", fetchError);
        return { type: "error", error: fetchError };
    }

    const existingApplicants = currentData?.applicants;
    let newApplicantsString = "";

    if (!existingApplicants) {
        newApplicantsString = username;
    } else if (existingApplicants.includes(username)) {
        console.log("User has already applied.");
        return { type: "success", data: currentData, message: "Already applied" };
    } else {
        newApplicantsString = `${existingApplicants}, ${username}`;
    }

    const { data: updateData, error: updateError } = await supabase
        .from('listing')
        .update({ applicants: newApplicantsString })
        .eq('listing_id', listingId)
        .select();

    if (updateError) {
        console.error("Error updating applicants:", updateError);
        return { type: "error", error: updateError };
    }

    return { type: "success", data: updateData };
}
