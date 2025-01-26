import User from "../models/userModal.js";
import OTP from "../models/otpModal.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/email.js";
import crypto from "crypto";

// Register
export const register = async (req, res) => {
  const { name, email, password, role, profession, specialization } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const user = new User({
      name,
      email,
      password,
      role,
      profession,
      specialization,
    });
    await user.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, user.role);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = crypto.randomInt(100000, 999999).toString();
    await OTP.create({ email, otp, expiresAt: Date.now() + 15 * 60 * 1000 });

    await sendEmail(email, "Password Reset OTP", `Your OTP is ${otp}`);
    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord || otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    user.password = newPassword;
    await user.save();

    await OTP.deleteOne({ email, otp });
    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
