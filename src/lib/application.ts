import { failure, success, type Result,  } from "../../shared/types.ts";
import {  axios_post, type RequestError } from "./axios.ts";
import { type ApplicationData } from "../../shared/types.ts";

export async function createApplication(
    name: string,
    answer: string,
    //file: string[],
): Promise<Result<{ application: ApplicationData, id: string }, RequestError>> {
    const res = await axios_post<{ application: ApplicationData, id: string }>("/volunteer_dashboard/apply_to_listing", {
        name,
        answer: [answer],
        //file
    });
    if (res.type == "success") {
        return success(res.data.data);
    } else {
        return failure(res.error)
    }
}