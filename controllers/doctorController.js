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



// Get doctor profile by ID
export const getDoctorProfile = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found." });
    }

    res.status(200).json({ success: true, doctor });
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit doctor profile
export const editDoctorProfile = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    console.log("Received files:", req.files);

    const { doctorId } = req.params;
    const updates = req.body;
    
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found." });
    }

    // Upload new profile image and resume video if provided
    if (req.files.image) {
      updates.profileImage = await uploadFile(req.files.image[0]);
    }
    if (req.files.video) {
      updates.resumeVideo = await uploadFile(req.files.video[0]);
    }

    // Update doctor profile
    Object.assign(doctor, updates);
    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      doctor,
    });
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
