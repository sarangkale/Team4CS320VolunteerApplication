import express from "express";

export default async function createListing(req: express.Request, res: express.Response) {
    res.send(req.headers.authorization);
}
