import express from "express";
import createListing from "./organizations/createListing.ts";

const router = express.Router();

router.get("/create_listing", createListing);

export default router;
