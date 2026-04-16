import express from "express";
import createListing from "./organizations/createListing.ts";
import authMiddleware from "../middleware/auth.ts";
import { getAccountProfile } from "../utils.ts";
import { createSupabaseClient } from "./authRouting.ts";

const router = express.Router();

router.use(authMiddleware);
router.post("/create_listing", createListing);
router.get("/profile", async (req, res) => {
    const supabase = await createSupabaseClient(req.accessToken!, req.refreshToken!);
    return res.json(getAccountProfile("User", supabase));
});

export default router;
