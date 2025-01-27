import Doctor from "../models/Doctor.js";
import { uploadFile } from "../utils/uploadtoServer.js";

export const createDoctorProfile = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    console.log("Received files:", req.files);

    const { name, phone, email, aboutMe, location, workStatus, experience, fieldOfStudy, income } = req.body;

    if (!name || !phone || !email || !aboutMe || !location || !workStatus || !experience || !fieldOfStudy || !income) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Upload profile image and resume video
    const profileImageUrl = req.files.image ? await uploadFile(req.files.image[0]) : null;
    const resumeVideoUrl = req.files.video ? await uploadFile(req.files.video[0]) : null;

    console.log("Uploaded profile image URL:", profileImageUrl);
    console.log("Uploaded resume video URL:", resumeVideoUrl);

    const doctor = new Doctor({
      name,
      phone,
      email,
      aboutMe,
      location,
      workStatus,
      experience,
      fieldOfStudy,
      income,
      profileImage: profileImageUrl,
      resumeVideo: resumeVideoUrl,
    });

    await doctor.save();

    res.status(201).json({
      success: true,
      message: "Doctor profile created successfully",
      doctor: {
        ...doctor.toObject(),
        profileImage: profileImageUrl,
        resumeVideo: resumeVideoUrl,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
