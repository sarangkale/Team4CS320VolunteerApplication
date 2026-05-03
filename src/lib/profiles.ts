import { failure, success, type Result } from "../../shared/types";
import { axios_post, type RequestError } from "./axios";

export async function updateOrganizationProfile(bio: string, orgName: string, website: string, orgId: string): Promise<Result<null, RequestError>> {
    const res = await axios_post("/organization/edit_profile", {
        bio,
        org_name: orgName,
        website,
        org_id: orgId,
    });

    if (res.type == "success") {
        return success(null);
    } else {
        return failure(res.error);
    }
}
