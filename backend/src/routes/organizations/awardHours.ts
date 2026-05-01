import Express from "express";
import { bodyHasEntries } from "../../utils.ts";
import { createSupabaseClient } from "../authRouting.ts";

export default async function awardHours(req: Express.Request, res: Express.Response) {
    const validation = bodyHasEntries(["applicant_id", "hours"], req.body, res);

    if (validation) {
        return validation;
    }

    const { applicant_id, hours } = req.body;

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
        .from("profiles")
        .select("total_hours_completed")
        .eq("user_id", applicant_id)
        .single();

    if (fetchError) {
        return res.status(500).json({ type: "error", error: fetchError });
    }
    
    console.log(currentData);

    const updatedHours = currentData!.total_hours_completed! + hours as number;
    console.log(`Old hours: ${currentData.total_hours_completed}, updated: ${updatedHours}`);

    const { data: updateData, error: updateError } = await supabase
        .from("profiles")
        .update({ total_hours_completed: updatedHours })
        .eq("user_id", applicant_id)
        .select().single();

    if (updateError) {
        return res.status(500).json(updateError)
    }

    return res.status(200).send(updateData.total_hours_completed);
}
