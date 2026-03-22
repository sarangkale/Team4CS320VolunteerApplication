import { getCurrentUser } from "../auth/auth";
import { supabase } from "./supabase";

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

export async function createListing(name: string, capacity: number, description: string, date: string, duration: string) {
    const {data: userData, error: userError}= await getCurrentUser();
    if (userError) {
        console.error(userError);
        return;
    }

    const { data, error } = await supabase.from("account roles").select("role");
    if (data) {
        if (data[0].role !== "Organization") {
            console.error("Only organizations can create listings.");
            return;
        }
    } else {
        console.error(error);
        return;
    }

    const listing: ListingData = {
        org_id: userData.user.id,
        listing_name: name,
        capacity,
        description,
        listing_date: date,
        duration
    };

    await supabase.from("listing").insert(listing);
}
