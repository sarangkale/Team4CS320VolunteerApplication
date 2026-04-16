import express from "express";
import { createSupabaseClientNoAuth } from "../authRouting.ts";

// TODO: Add pagination
export default async function getListings(_req: express.Request, res: express.Response) {
    const client = createSupabaseClientNoAuth();
    const {data, error} = await client.from("listing").select();
    if (data) {
        res.json(data);
    } else {
        res.status(500).send(JSON.stringify(error));
    }
}
