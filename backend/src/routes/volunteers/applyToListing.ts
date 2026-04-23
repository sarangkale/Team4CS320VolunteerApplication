import Express from "express";
import { bodyHasEntries } from "../../utils.ts";
import { createSupabaseClient } from "../authRouting.ts";

export default async function applyToListing(req: Express.Request, res: Express.Response) {
    const validation = bodyHasEntries(["listing_id", "username"], req.body, res);

    if (validation) {
        return validation;
    }

    const { listing_id, username } = req.body;

    const supabase = await createSupabaseClient(req.accessToken!, req.refreshToken!);

    const { data: currentData, error: fetchError } = await supabase
        .from('listing')
        .select('applicants')
        .eq('listing_id', listing_id)
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
        return res.status(400).send("User has already applied to this listing.");
    } else {
        newApplicantsString = `${existingApplicants}, ${username}`;
    }

    const { data: _updateData, error: updateError } = await supabase
        .from('listing')
        .update({ applicants: newApplicantsString })
        .eq('listing_id', listing_id)
        .select();

    if (updateError) {
        return res.status(501).json({error: updateError})
    }

    return res.status(400);
}
