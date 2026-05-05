import express from "express";
import { createSupabaseClient } from "../authRouting.ts";
import { bodyHasEntries } from "../../utils.ts";
import { type ListingFilters } from "../../../../src/lib/listings.ts"

export default async function getListings(req: express.Request, res: express.Response) {
    const validation = bodyHasEntries(["range_start", "range_end", "filters"], req.body, res);

    if (validation) {
        return validation;
    }

    const { range_start, range_end, filters } = req.body as { range_start: string, range_end: string, filters: ListingFilters };

    const { accessToken, refreshToken } = req;
    if (!accessToken || !refreshToken) {
        return res.status(500).json({error: "No auth tokens found"});
    }
    const client = await  createSupabaseClient(accessToken, refreshToken);
    let query = client.from("listing").select("*").range(Number(range_start), Number(range_end));

    if (filters?.searchTerm?.trim()) {
        const term = filters.searchTerm.trim();
        if (term.length > 0) {
            query = query.or(
                `listing_name.ilike.${term}`
            );
        }
    }

    if (filters?.categories && filters.categories.length > 0) {
        query = query.in("categories", filters.categories);
    }

    if (filters?.transport && filters.transport.length > 0) {
        query = query.in("transport", filters.transport);
    }

    if (filters?.org_name && filters.org_name.length > 0) {
        query = query.in("org_name", filters.org_name);
    }

    if (filters?.skill && filters.skill.length > 0) {
        query = query.overlaps("needed_skill", filters.skill);
    }

    const { data, error } = await query;


    if (data) {
        res.json(data);
    } else {
        res.status(500).send(JSON.stringify(error));
    }
}
