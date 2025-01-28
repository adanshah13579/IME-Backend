import express from "express";
import multer from "multer";
import {
  createDoctorProfile,
  editDoctorProfile,
  getDoctorProfile,
} from "../controllers/doctorController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory buffer

// Create Doctor Profile
router.post(
  "/create-profile",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createDoctorProfile
);

// Edit Doctor Profile
router.put(
  "/edit-profile/:_id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  editDoctorProfile
);

// Get Doctor Profile
router.get("/get-profile/:id?", getDoctorProfile);

export default router;
