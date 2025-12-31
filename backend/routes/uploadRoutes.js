import express from "express";
import multer from "multer";
import uploadController from "../controllers/uploadController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/esg", upload.single("file"), uploadController.uploadESGFile);

export default router;
