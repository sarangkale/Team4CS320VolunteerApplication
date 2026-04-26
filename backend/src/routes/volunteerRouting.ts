import express from "express";
import getListings from "./volunteers/getListings.ts";
import {getAccountProfile} from "../utils.ts"
import { createSupabaseClient } from "./authRouting.ts";
import applyToListing from "./volunteers/applyToListing.ts";

const router = express.Router();

router.get("/listings", getListings);
router.get("/profile", async (req, res) => {
    const supabase = await createSupabaseClient(req.accessToken!, req.refreshToken!);
    return res.json(getAccountProfile("User", supabase));
});
router.post("/apply_to_listing", applyToListing)

export default router;
