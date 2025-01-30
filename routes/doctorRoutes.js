import express from "express";
import {
  createDoctorProfile,
  editDoctorProfile,
  getDoctorProfile,
  getProfile,
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

//for doctor
router.get("/getprofile/:userId", getProfile);


// Get Doctor Profile for user
router.get("/get-profile/", getDoctorProfile);

export default router;
