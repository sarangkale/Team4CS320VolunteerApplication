import express from "express";
import { createSupabaseClientNoAuth } from "../authRouting.ts";
import { bodyHasEntries, createCookies } from "../../utils.ts";

export default async function logIn(req: express.Request, res: express.Response) {
    const validation = bodyHasEntries(["email", "password"], req.body, res);
    if (validation) {
        return validation
    }

    const { email, password } = req.body;
    const supabase = createSupabaseClientNoAuth();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        return res.status(401).json(error);
    }

    const { data: role, error: roleError } = await supabase
        .from("account roles")
        .select("role")
        .eq("id", data.user!.id)
        .limit(1);

    if (roleError) {
        return res.status(401).json(roleError);
    }

    createCookies(data.session, res);

    if (!role || role.length === 0 || !role[0]?.role) {
        return res.status(401).json({ message: "Role not found for authenticated user" });
    }

    return res.json({ user: data.user, role: role[0].role });
}
