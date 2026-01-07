import express from "express";
const router = express.Router();

import { submitAssessment } from "../controllers/submitController.js";

router.post("/:companyId", submitAssessment);

export default router;
