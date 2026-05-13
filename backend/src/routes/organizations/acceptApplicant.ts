import express from "express";
import { bodyHasEntries } from "../../utils.ts";
import { createSupabaseClient } from "../authRouting.ts";

export default async function acceptApplicant(req: express.Request, res: express.Response) {
    const validation = bodyHasEntries(["listing_id", "applicant_id"], req.body, res);

    if (validation) {
        return validation;
    }

    const { listing_id, applicant_id } = req.body;

    const { accessToken, refreshToken } = req;
    if (!accessToken || !refreshToken) {
        return res.status(500).json({ error: "Failed to get access and refresh tokens" });
    }
    const supabase = await createSupabaseClient(accessToken, refreshToken);

    const { data, error } = await supabase.from("account roles").select("role").single();
    if (data) {
        if (data!.role !== "Organization") {
            return res.status(500).json({ error: "Only organizations can accept applicants" });
        }
    } else {
        return res.status(500).json(error);
    }

    const { data: listingData, error: listingError } = await supabase.from("listing").select().eq("listing_id", listing_id).single();

    if (listingError) {
        return res.status(500).json(listingError);
    }

    const updatedApplicants = listingData.applicants?.filter(applicant => applicant !== applicant_id) || [];
    const updatedAcceptedApplicants = listingData.accepted_applicants || [];
    updatedAcceptedApplicants.push(applicant_id);

    await supabase.from("listing").update({applicants: updatedApplicants, accepted_applicants: updatedAcceptedApplicants}).eq("listing_id", listing_id);
    return res.status(200).send();
}
