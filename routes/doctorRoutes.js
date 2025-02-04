import express from "express";
import {
  createDoctorProfile,
  getDoctorProfile,
  getProfile,
  searchDoctors,
  updateDoctorProfile,
} from "../controllers/doctorController.js";
import { isAuthenticated } from '../middlewares/authmiddleware.js';

const router = express.Router();

// Create Doctor Profile
router.post(
  "/create-profile",isAuthenticated,
  createDoctorProfile
);

router.put("/updateprofile/:userId", isAuthenticated, updateDoctorProfile);

// router.get("/:id", getDoctorforUser);

//for doctor
router.get("/getprofile/:userId", getDoctorProfile);


// Get Doctor Profile for user
router.get("/get-profile/", getProfile);
router.get('/search', searchDoctors);

export default router;
