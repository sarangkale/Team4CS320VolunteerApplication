import express from "express";
import {supabase} from "../../../../src/lib/supabase.ts";

export default async function getListings(_req: express.Request, res: express.Response) {
    const {data, error} = await supabase.from("listing").select();
    if (data) {
        res.send(JSON.stringify(data));
    } else {
        res.status(500).send(JSON.stringify(error));
    }
}
