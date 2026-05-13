import express from "express";
import getListings from "./volunteers/getListings.ts";
import {getAccountProfile} from "../utils.ts"
import { createSupabaseClient } from "./authRouting.ts";
import applyToListing from "./volunteers/applyToListing.ts";
import authMiddleware from "../middleware/auth.ts";
import getHistoryAndUpcoming from "./volunteers/getHistoryAndUpcoming.ts";
import updateProfile from "./volunteers/updateProfile.ts";

const router = express.Router();

router.use(authMiddleware);
router.post("/listings", getListings);
router.post("/edit_profile", updateProfile);
router.get("/profile", async (req, res) => {
    const supabase = await createSupabaseClient(req.accessToken!, req.refreshToken!);
    const profileRes = await getAccountProfile("User", supabase);
    if (profileRes.type == "success") {
        return res.json(profileRes.data);
    } else {
        return res.status(500).json(profileRes.error);
    }
});
router.post("/apply_to_listing", applyToListing);
router.get("/history_and_upcoming", getHistoryAndUpcoming);

export default router;
