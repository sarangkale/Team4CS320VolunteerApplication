import { failure, success } from "../auth/auth";
import { supabase } from "./supabase";
import { type Result } from "../auth/auth.ts";
import { axios_post, axios_get, type RequestError } from "./axios.ts";

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

export async function createListing(name: string, capacity: number, description: string, date: string, duration: string): Promise<Result<{ listing: ListingData, id: string }, RequestError>> {
    const res = await axios_post<{ listing: ListingData, id: string }>("/organization/create_listing", {
        name,
        capacity,
        description,
        listing_date: date,
        duration,
    });

    if (res.type == "success") {
        return success(res.data.data)
    } else {
        return failure(res.error)
    }
}

export async function retrieveListings(_rangeStart: number, _rangeEnd: number): Promise<Result<ListingData[], RequestError>> {
    const res = await axios_get<ListingData[]>("/volunteer/listings");
    if (res.type == "success") {
        return success(res.data.data);
    } else {
        return failure(res.error)
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
