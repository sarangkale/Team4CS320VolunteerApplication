import express from "express";
import createListing from "./organizations/createListing.ts";
import authMiddleware from "../middleware/auth.ts";
import { getAccountProfile } from "../utils.ts";
import { createSupabaseClient } from "./authRouting.ts";
import updateProfile from "./organizations/updateProfile.ts"; 
import ownedListings from "./organizations/ownedListings.ts";
import editListing from "./organizations/editListing.ts"
import listingApplicants from "./organizations/listingApplicants.ts";
import removeApplicant from "./organizations/removeApplicant.ts";
import awardHours from "./organizations/awardHours.ts";
import editProfile from "./organizations/editProfile.ts";
import deleteListing from "./organizations/deleteListing.ts";

const router = express.Router();

router.use(authMiddleware);
router.post("/create_listing", createListing);
router.post("/update_profile", updateProfile);
router.get("/profile", async (req, res) => {
    const supabase = await createSupabaseClient(req.accessToken!, req.refreshToken!);
    const profileRes = await getAccountProfile("Organization", supabase);
    if (profileRes.type == "success") {
        return res.json(profileRes.data);
    } else {
        return res.status(500).json(profileRes.error);
    }
});
router.get("/owned_listings", ownedListings);
router.post("/edit_listing", editListing);
router.get("/listing_applicants", listingApplicants);
router.post("/remove_applicant", removeApplicant);
router.post("/award_hours", awardHours);
router.post("/edit_profile", editProfile);
router.post("/delete_listing", deleteListing);

export default router;
