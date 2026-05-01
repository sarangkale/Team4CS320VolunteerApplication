import express from "express";
import createListing from "./organizations/createListing.ts";
import authMiddleware from "../middleware/auth.ts";
import { getAccountProfile } from "../utils.ts";
import { createSupabaseClient } from "./authRouting.ts";
import ownedListings from "./organizations/ownedListings.ts";
import editListing from "./organizations/editListing.ts"
import listingApplicants from "./organizations/listingApplicants.ts";
import removeApplicant from "./organizations/removeApplicant.ts";
import awardHours from "./organizations/awardHours.ts";

const router = express.Router();

router.use(authMiddleware);
router.post("/create_listing", createListing);
router.get("/profile", async (req, res) => {
    const supabase = await createSupabaseClient(req.accessToken!, req.refreshToken!);
    return res.json(getAccountProfile("User", supabase));
});
router.get("/owned_listings", ownedListings);
router.post("/edit_listing", editListing);
router.get("/listing_applicants", listingApplicants);
router.post("/remove_applicant", removeApplicant);
router.post("/award_hours", awardHours);

export default router;
