import { failure, success, type Result,  } from "../../shared/types.ts";
import {  axios_post, type RequestError } from "./axios.ts";
import { type ApplicationData } from "../../shared/types.ts";

export async function applyToListing(
    listingId: string,
    answers: string[],
): Promise<Result<{ application: ApplicationData, id: string }, RequestError>> {
    const res = await axios_post<{ application: ApplicationData, id: string }>("/volunteer/apply_to_listing", {
        listing_id: listingId,
        answers,
    });
    if (res.type == "success") {
        return success(res.data.data);
    } else {
        return failure(res.error)
    }
}
