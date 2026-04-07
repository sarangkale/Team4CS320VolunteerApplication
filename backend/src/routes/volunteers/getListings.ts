import express from "express";
import { createSupabaseClientNoAuth } from "../authRouting.ts";

export default async function getListings(_req: express.Request, res: express.Response) {
    const client = createSupabaseClientNoAuth();
    const {data, error} = await client.from("listing").select();
    if (data) {
        res.send(JSON.stringify(data));
    } else {
        res.status(500).send(JSON.stringify(error));
    }
}
