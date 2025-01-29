import express from "express";
import {
  createDoctorProfile,
  editDoctorProfile,
  getDoctorProfile,
} from "../controllers/doctorController.js";
import { isAuthenticated } from '../middlewares/authmiddleware.js';

const router = express.Router();

// Create Doctor Profile
router.post(
  "/create-profile",isAuthenticated,
  createDoctorProfile
);

// Edit Doctor Profile
router.put(
  "/edit-profile/:_id",
 
  editDoctorProfile
);

// Get Doctor Profile
router.get("/get-profile/:id?", getDoctorProfile);

export default router;
