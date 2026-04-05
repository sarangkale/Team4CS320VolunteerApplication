import express from "express";
import getListings from "./volunteers/getListings.ts";

const router = express.Router();

router.get("/listings", getListings);

export default router;
