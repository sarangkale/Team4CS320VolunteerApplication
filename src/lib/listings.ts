import { failure, success, type Result, } from "../../shared/types.ts";
import { axios_get, axios_post, type RequestError } from "./axios.ts";
import { type ListingData } from "../../shared/types.ts";

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

export async function getOwnedListings(): Promise<Result<ListingData[], RequestError>> {
    const res = await axios_get<ListingData[]>("/organization/owned_listings");

    if (res.type === "success") {
        return success(res.data.data);
    } else {
        return failure(res.error);
    }
}

export async function editListing(listingData: ListingData): Promise<Result<null, RequestError>> {
    const res = await axios_post<string>("/organization/edit_listing", {
        listing_id: listingData.listing_id,
        name: listingData.listing_name,
        capacity: listingData.capacity,
        description: listingData.description,
        listing_date: listingData.listing_date,
        duration: listingData.duration,
        categories: listingData.categories,
        street: listingData.street,
        city: listingData.city,
        state: listingData.state,
        zip_code: listingData.zip_code,
        needed_skill: listingData.needed_skill,
        transport: listingData.transport,
    });
    
    if (res.type === "success") {
        return success(null);
    } else {
        return failure(res.error);
    }
}
