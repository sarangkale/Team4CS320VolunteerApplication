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

export async function updateVolunteerProfile(bio: string, firstName: string, lastName: string, school: string, major: string, graduationYear: number, phone: string, userId: string): Promise<Result<null, RequestError>> {
    const res = await axios_post("/volunteer/edit_profile", {
        bio,
        first_name: firstName,
        last_name: lastName,
        school,
        major,
        graduation_year: graduationYear,
        phone,
        user_id: userId
    });

    if (res.type == "success") {
        return success(null);
    } else {
        return failure(res.error);
    }
}
