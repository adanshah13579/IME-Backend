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
    image: profileImageUrl,
      video: resumeVideoUrl,
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




export const editDoctorProfile = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    console.log("Received files:", req.files);

    const _id = req.params._id; // Assuming the doctor ID is passed as a route parameter
    const { name, phone, email, aboutMe, location, workStatus, experience, fieldOfStudy, income } = req.body;

    if (!_id) {
      return res.status(400).json({ success: false, message: "Doctor ID is required." });
    }

    // Find the doctor by ID
    const doctor = await Doctor.findById(_id);

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found." });
    }

    // Upload new profile image and resume video if provided
    const profileImageUrl = req.files?.image ? await uploadFile(req.files.image[0]) : doctor.image;
    const resumeVideoUrl = req.files?.video ? await uploadFile(req.files.video[0]) : doctor.video;

    console.log("Uploaded profile image URL:", profileImageUrl);
    console.log("Uploaded resume video URL:", resumeVideoUrl);

    // Update doctor fields
    doctor.name = name || doctor.name;
    doctor.phone = phone || doctor.phone;
    doctor.email = email || doctor.email;
    doctor.aboutMe = aboutMe || doctor.aboutMe;
    doctor.location = location || doctor.location;
    doctor.workStatus = workStatus || doctor.workStatus;
    doctor.experience = experience || doctor.experience;
    doctor.fieldOfStudy = fieldOfStudy || doctor.fieldOfStudy;
    doctor.income = income || doctor.income;
    doctor.image = profileImageUrl;
    doctor.video = resumeVideoUrl;

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      doctor,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getDoctorProfile = async (req, res) => {
  try {
    const { id } = req.params; // Check if an ID is provided in the request params

    if (id) {
      // Fetch a specific doctor profile by ID
      const doctor = await Doctor.findById(id);

      if (!doctor) {
        return res.status(404).json({ success: false, message: "Doctor not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Doctor profile fetched successfully",
        doctor,
      });
    } else {
      // Fetch all doctor profiles with pagination if no ID is provided
      const { page = 1, limit = 2 } = req.query; // Default to page 1 and limit 10
      const skip = (page - 1) * limit;

      const totalProfiles = await Doctor.countDocuments(); // Total number of profiles
      const doctors = await Doctor.find().skip(skip).limit(Number(limit)).exec();

      return res.status(200).json({
        success: true,
        message: "All doctor profiles fetched successfully",
        data: {
          doctors,
          pagination: {
            totalProfiles,
            currentPage: Number(page),
            totalPages: Math.ceil(totalProfiles / limit),
            limit: Number(limit),
          },
        },
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
