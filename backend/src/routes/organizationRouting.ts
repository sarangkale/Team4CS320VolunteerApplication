import express from "express";
import createListing from "./organizations/createListing.ts";
import authMiddleware from "../middleware/auth.ts";

const router = express.Router();

router.use(authMiddleware);
router.post("/create_listing", createListing);

export default router;
