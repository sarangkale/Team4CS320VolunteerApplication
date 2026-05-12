import Express from "express";
import { bodyHasEntries, getAccountProfile } from "../../utils.ts";
import { createSupabaseClient } from "../authRouting.ts";
import type { UserProfile } from "../../../../shared/types.ts";

export default async function applyToListing(req: Express.Request, res: Express.Response) {
    const validation = bodyHasEntries(["listing_id"], req.query as Record<string, string>, res);

    if (validation) {
        return validation;
    }

    const listing_id = req.query.listing_id as string;

    const { accessToken, refreshToken } = req;
    if (!accessToken || !refreshToken) {
        return res.status(500).json({ error: "Failed to get access and refresh tokens" });
    }
    const supabase = await createSupabaseClient(accessToken, refreshToken);

    const { data, error } = await supabase.from("account roles").select("role").single();
    if (data) {
        if (data!.role !== "User") {
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

    const userRes = await getAccountProfile("User", supabase);

    if (userRes.type === "error") {
        return res.status(500).json({error: "Error fetching the user's profile"});
    }

    const profile = userRes.data.profile as UserProfile;

    const existingApplicants = currentData?.applicants
    const updatedApplicants = [profile.user_id];

    if (!existingApplicants) {
        // const { error } = await supabase.from('application').insert({ user_id: profile.user_id, Answer: ['insert string[]'], file_paths: ['url1', 'url2'], listing_id: listing_id  })
        const { error } = await supabase.from('application').insert({ user_id: profile.user_id, Answer: ['insert string[]'], listing_id: listing_id })   //^^with file ver.
        if (error){return res.status(500).json({ type: "error", error: error }) }
    } else if (existingApplicants.includes(profile.user_id)) {
        return res.status(500).send("User has already applied to this listing.");
    } else {
        updatedApplicants.push(...existingApplicants);
    }

    //const { data: _updateData, error: updateError } = await supabase
    const { error: updateError } = await supabase
        .from('listing')
        .update({ applicants: updatedApplicants })
        .eq('listing_id', listing_id)
        .select();

    if (updateError) {
        return res.status(500).json({error: updateError})
    }

    return res.status(400);
}
