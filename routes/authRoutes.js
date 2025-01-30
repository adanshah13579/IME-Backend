import express from "express";
import { doctorLogin, forgotPassword, login, logoutDoctor, register, resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post('/doctor-login', doctorLogin);
router.post('/logout', logoutDoctor);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
