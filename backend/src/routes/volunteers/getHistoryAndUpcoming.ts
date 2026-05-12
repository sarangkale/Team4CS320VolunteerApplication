import express from "express";
import { bodyHasEntries, getAccountProfile } from "../../utils.ts";
import { createSupabaseClient } from "../authRouting.ts";
import type { UserProfile } from "../../../../shared/types.ts";

export default async function getHistoryAndUpcoming(req: express.Request, res: express.Response) {
    const { accessToken, refreshToken } = req;
    if (!accessToken || !refreshToken) {
        return res.status(500).json({ error: "Failed to get access and refresh tokens" });
    }
    const supabase = await createSupabaseClient(accessToken, refreshToken);

    const { data, error } = await supabase.from("account roles").select("role").single();
    if (data) {
        if (data!.role !== "User") {
            return res.status(401).json({ error: "Only users can get their history and upcoming events" });
        }
    } else {
        return res.status(500).json(error);
    }
    const accountRes = await getAccountProfile("User", supabase);
    console.log("thing");

    if (accountRes.type === "error") {
        return res.status(500).json(accountRes.error);
    }
    console.log("here");

    const { listing_history, upcoming_listings }= (accountRes.data.profile as UserProfile);
    console.log(listing_history);

    const { data: historyData, error: historyError } = await supabase.from("past_listings").select().in("listing_id", listing_history);
    console.log(historyData, historyError);
    
    if (historyError) {
        return res.status(500).json(historyError);
    }

    const { data: upcomingData, error: upcomingError } = await supabase.from("listing").select().in("listing_id", upcoming_listings);
    
    if (upcomingError) {
        return res.status(500).json(upcomingError);
    }

    return res.json({
        history: historyData,
        upcoming: upcomingData,
    });
}
