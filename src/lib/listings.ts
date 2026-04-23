import { failure, success, type Result, } from "../auth/auth.ts";
import { axios_get, axios_post, type RequestError } from "./axios.ts";

export type ListingData = {
    applicants: string | null;
    capacity: number | null;
    categories: string | null;
    city: string | null;
    description: string | null;
    distance: number | null;
    duration: string | null;
    files: string[] | null;
    latitude: number | null;
    listing_date: string | null;
    listing_id: string;
    listing_name: string | null;
    longitude: number | null;
    needed_skill: string[] | null;
    org_id: string;
    org_name: string | null;
    Questions: string[] | null;
    state: string | null;
    street: string | null;
    transport: string | null;
    volunteer_time: string | null;
    zip_code: string | null;
};

export type ListingFilters = {
    searchTerm?: string;
    org_name?: string[];
    categories?: string[];
    skill?: string[];
    transport?: string[];
};

export async function createListing(
    listing_name: string,
    description: string,
    listing_date: string,
    duration: string,
    capacity: number,
    categories?: string,
    needed_skill?: string[],
    transport?: string,
    street?: string,
    city?: string,
    state?: string,
    zip_code?: string
): Promise<Result<{ listing: ListingData, id: string }, RequestError>> {
    const res = await axios_post<{ listing: ListingData, id: string }>("/organization/create_listing", {
        name: listing_name,
        capacity,
        description,
        listing_date,
        duration,
        categories,
        needed_skill,
        transport,
        street,
        city,
        state,
        zip_code,
    });
    if (res.type == "success") {
        return success(res.data.data);
    } else {
        return failure(res.error)
    }
}

export async function retrieveListings(
    rangeStart: number,
    rangeEnd: number,
    filters?: ListingFilters
): Promise<Result<ListingData[], RequestError>> {
    const res = await axios_get<ListingData[]>("/volunteer/listings", { range_start: rangeStart, range_end: rangeEnd, filters });
    if (res.type === "success") {
        return success(res.data.data);
    } else {
        return failure(res.error);
    }
}

export async function updateListingApplicant(listingId: string, username: string): Promise<Result<null, RequestError>> {
    const res = await axios_post("/volunteer/apply_to_listing", {
        listing_id: listingId,
        username,
    });

    if (res.type === "success") {
        return success(null);
    } else {
        return failure(res.error);
    }
}
