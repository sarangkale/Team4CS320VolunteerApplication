import express from "express";
import { createSupabaseClientNoAuth } from "../authRouting.ts";
import { bodyHasEntries, createCookies, type UserProfile, type OrganizationProfile } from "../../utils.ts";

export async function volunteerSignUp(req: express.Request, res: express.Response) {
    const validation = bodyHasEntries(["email", "password", "first_name", "last_name", "school", "graduation_year"], req.body, res);

    if (validation) {
        return validation;
    }

    const { email, password, first_name, last_name, school, graduation_year } = req.body;

    const supabase = createSupabaseClientNoAuth();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        return res.status(500).json(error);
    }

    await supabase.from("account roles").insert({ id: data.user!.id, role: "User" });

    const profile: UserProfile = {
        bio: "",
        email,
        first_name,
        graduation_year,
        last_name,
        major: "",
        phone: 0,
        school,
        total_hours_completed: 0,
        user_id: data.user!.id,
    };
    const { error: insertError } = await supabase.from("profiles").insert(profile);
    if (insertError) {
        return res.status(500).json(insertError);
    }

    createCookies(data.session!, res);

    res.json({ user: data.user });
}

export async function organizationSignUp(req: express.Request, res: express.Response) {
    const validation = bodyHasEntries(["email", "password", "org_name", "website"], req.body, res);

    if (validation) {
        return validation;
    }

    const { email, password, org_name, website } = req.body;

    const supabase = createSupabaseClientNoAuth();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        return res.status(500).json(error);
    }

    await supabase.from("account roles").insert({ id: data.user!.id, role: "Organization" });

    const profile: OrganizationProfile = {
        all_listings: "",
        bio: "",
        email,
        org_id: data.user!.id,
        org_name,
        website
    };
    const { error: insertError } = await supabase.from("organization").insert(profile);
    if (insertError) {
        return res.status(500).json(insertError);
    }

    res.cookie(
        "supabase-token", data.session!.access_token,
        {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        }
    );

    res.json({ user: data.user });
}
