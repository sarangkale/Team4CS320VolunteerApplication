import express from "express";
import createListing from "./organizations/createListing.ts";
import authMiddleware from "../middleware/auth.ts";
import { getAccountProfile } from "../utils.ts";
import { createSupabaseClient } from "./authRouting.ts";
import getListingsOrg from "./organizations/getListingsOrg.ts";
import updateProfile from "./organizations/updateProfile.ts"; 

const router = express.Router();

router.use(authMiddleware);
router.post("/create_listing", createListing);
router.get("/listings", getListingsOrg);
router.post("/update_profile", updateProfile);
router.get("/profile", async (req, res) => {
    const supabase = await createSupabaseClient(req.accessToken!, req.refreshToken!);
    return res.json(await getAccountProfile("Organization", supabase));
});

export default router;
