import express from "express";
import multer from "multer";
import { createDoctorProfile } from "../controllers/doctorController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory buffer

router.post("/create-profile", upload.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }]), createDoctorProfile);

export default router;
