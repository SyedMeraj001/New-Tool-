import express from "express";
const router = express.Router();

import { getReviewSummary } from "../controllers/reviewController.js";

router.get("/:companyId", getReviewSummary);

export default router;
