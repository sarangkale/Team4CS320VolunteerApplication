import Express from "express";
import { bodyHasEntries } from "../../utils.ts";
import { createSupabaseClient } from "../authRouting.ts";

export default async function editProfile(req: Express.Request, res: Express.Response) {
    const validation = bodyHasEntries(["bio", "first_name", "last_name", "school", "major", "graduation_year", "phone", "user_id"], req.body, res);

    if (validation) {
        return validation;
    }

    const { bio, first_name, last_name, school, major, graduation_year, phone, user_id } = req.body;

    const { accessToken, refreshToken } = req;
    if (!accessToken || !refreshToken) {
        return res.status(500).json({ error: "Failed to get access and refresh tokens" });
    }
    const supabase = await createSupabaseClient(accessToken, refreshToken);

    const { data, error } = await supabase.from("profiles").update({
        bio,
        first_name,
        last_name,
        school,
        major,
        graduation_year,
        phone,
    }).eq("user_id", user_id).select().single();

    if (error) {
        return res.status(500).json(error);
    }

    return res.json(data);
}
