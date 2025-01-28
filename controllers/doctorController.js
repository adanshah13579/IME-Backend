import Doctor from "../models/Doctor.js";
import { uploadFile } from "../utils/uploadtoServer.js";



// Controller for creating a doctor's profile
export const createDoctorProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      aboutMe,  // Updated to 'aboutMe'
      location,
      workStatus,
      experience,
      fieldOfStudy,
      income,
      image,  // Updated to 'image'
      video,  // Updated to 'video'
    } = req.body;

    // Create a new doctor profile
    const newDoctorProfile = new Doctor({
      name,
      email,
      phone,
      aboutMe,  // Updated to 'aboutMe'
      location,
      workStatus,
      experience,
      fieldOfStudy,
      income,
      image,  // Updated to 'image'
      video,  // Updated to 'video'
    });

    // Save the new doctor profile to the database
    await newDoctorProfile.save();

    // Respond with success
    return res.status(201).json({
      message: 'Doctor profile created successfully',
      data: newDoctorProfile,
    });
  } catch (error) {
    console.error('Error creating doctor profile:', error);
    return res.status(500).json({ message: 'Error creating doctor profile' });
  }
};



export const editDoctorProfile = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const updatedData = req.body;

    // Find the doctor by ID and update their profile
    const updatedDoctor = await Doctor.findByIdAndUpdate(doctorId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    return res.status(200).json({
      message: 'Doctor profile updated successfully',
      data: updatedDoctor,
    });
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    return res.status(500).json({ message: 'Error updating doctor profile' });
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
