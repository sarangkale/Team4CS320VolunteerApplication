import Express from "express";
import { bodyHasEntries } from "../../utils.ts";
import { createSupabaseClient } from "../authRouting.ts";

export default async function removeApplicant(req: Express.Request, res: Express.Response) {
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
            return res.status(401).json({ error: "Only users can apply to listings" });
        }
    } else {
        return res.status(500).json(error);
    }

    const { data: currentData, error: fetchError } = await supabase
        .from("listing")
        .select("applicants")
        .eq("listing_id", listing_id)
        .single();

    if (fetchError) {
        return res.status(500).json({ type: "error", error: fetchError });
    }

    const updatedApplicants = (currentData!.applicants || []).filter(applicant => applicant !== applicant_id);

    const { error: updateError } = await supabase
        .from('listing')
        .update({ applicants: updatedApplicants })
        .eq('listing_id', listing_id)
        .select();

    if (updateError) {
        return res.status(501).json({error: updateError})
    }

    return res.status(200);
}
