import express from "express";
import {
  createDoctorProfile,
  getDoctorforUser,
  getDoctorProfile,
  getProfile,
  
  searchDoctors,
  updateDoctorProfile,
} from "../controllers/doctorController.js";
import { isAuthenticated } from '../middlewares/authmiddleware.js';

const router = express.Router();

router.post(
  "/create-profile",isAuthenticated,
  createDoctorProfile
);

router.put("/updateprofile/:userId", isAuthenticated, updateDoctorProfile);



//for doctor
router.get("/getprofile/:userId", getDoctorProfile);

router.get("/get-profile/", getProfile);
router.get('/search', searchDoctors);
router.get("/:id", getDoctorforUser);

export default router;
