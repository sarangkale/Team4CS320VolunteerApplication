import Express from "express";
import { bodyHasEntries } from "../../utils.ts";
import { createSupabaseClient } from "../authRouting.ts";

export default async function listingApplicants(req: Express.Request, res: Express.Response) {
    const validation = bodyHasEntries(["listing_id"], req.query as Record<string, string>, res);

    if (validation) {
        return validation;
    }

    const { listing_id } = req.query;

    const { accessToken, refreshToken } = req;
    if (!accessToken || !refreshToken) {
        return res.status(500).json({ error: "Failed to get access and refresh tokens" });
    }
    const supabase = await createSupabaseClient(accessToken, refreshToken);

    const { data, error } = await supabase.from("account roles").select("role").single();
    if (data) {
        if (data!.role !== "Organization") {
            return res.status(401).json({ error: "Only organizations can access the listing's applicants" });
        }
    } else {
        return res.status(500).json(error);
    }

    const { data: applicantsData, error: applicantsError } = await supabase
        .from("listing")
        .select("applicants")
        .eq("listing_id", listing_id as string)
        .single();

    if (applicantsError) {
        return res.status(500).json(applicantsError);
    }

    const applicants = applicantsData.applicants || [];

    const { data: applicantsProfile, error: applicantsProfileError } = await supabase
        .from("profiles")
        .select()
        .in("user_id", applicants);

    if (applicantsProfileError) {
        return res.status(500).json(applicantsProfileError);
    }

    return res.json(applicantsProfile);
}
