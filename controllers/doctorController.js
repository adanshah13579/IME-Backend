import Doctor from "../models/Doctor.js";

export const createDoctorProfile = async (req, res) => {
  try {
    // Ensure the user is authenticated
    console.log("User trying to create profile:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Check if the authenticated user is a doctor
    if (req.user.role !== "doctor") {
      return res
        .status(403)
        .json({ message: "Access denied. Only doctors can create profiles." });
    }

    // Check if the doctor already has a profile
    const existingProfile = await Doctor.findOne({ userId: req.user.id });
    if (existingProfile) {
      return res
        .status(400)
        .json({
          message:
            "Doctor profile already exists. You cannot create another one.",
        });
    }

    const {
      name,
      email,
      phone,
      aboutMe,
      location,
      workStatus,
      experience,
      fieldOfStudy,
      income,
      image,
      video,
      file,
    } = req.body;

    // Create a new doctor profile with the authenticated doctor’s ID
    const newDoctorProfile = new Doctor({
      userId: req.user.id, // This ensures only a doctor’s ID is saved
      name,
      email,
      phone,
      aboutMe,
      location,
      workStatus,
      experience,
      fieldOfStudy,
      income,
      image,
      video,
      file,
    });

    // Save the doctor profile to the database
    await newDoctorProfile.save();

    return res.status(201).json({
      message: "Doctor profile created successfully",
      data: newDoctorProfile,
    });
  } catch (error) {
    console.error("Error creating doctor profile:", error);
    return res.status(500).json({ message: "Error creating doctor profile" });
  }
};

export const getProfile = async (req, res) => {
  try {
   
    
    const { userId } = req.params;
    console.log(userId);
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const doctorProfile = await Doctor.findOne({ userId });

    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    return res.status(200).json(doctorProfile);
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    return res.status(500).json({ message: "Error fetching doctor profile" });
  }
};

export const editDoctorProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    

    if (req.user.id !== userId) {
      return res
        .status(403)
        .json({
          message: "Access denied. You can only edit your own profile.",
        });
    }

    // Find the existing profile
    const doctorProfile = await Doctor.findOne({ userId });

    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    // Extract updated fields from the request body
    const updates = req.body;

    // Update only provided fields
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        doctorProfile[key] = updates[key];
      }
    });

    // Save the updated profile
    await doctorProfile.save();

    return res.status(200).json({
      message: "Doctor profile updated successfully",
      data: doctorProfile,
    });
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    return res.status(500).json({ message: "Error updating doctor profile" });
  }
};

export const getDoctorProfile = async (req, res) => {
  try {
    const { id } = req.params; // Check if an ID is provided in the request params
     
    if (id) {
      // Fetch a specific doctor profile by ID
      const doctor = await Doctor.findById(id);

      if (!doctor) {
        return res
          .status(404)
          .json({ success: false, message: "Doctor not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Doctor profile fetched successfully",
        doctor,
      });
    } else {
      const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
      const currentPage = Math.max(1, Number(page)); // Ensure page is at least 1
      const pageSize = Math.max(1, Number(limit)); // Ensure limit is at least 1
      const skip = (currentPage - 1) * pageSize;

      const totalProfiles = await Doctor.countDocuments(); 
      const doctors = await Doctor.find().skip(skip).limit(pageSize).exec();

      return res.status(200).json({
        success: true,
        message: "All doctor profiles fetched successfully",
        data: {
          doctors,
          pagination: {
            totalProfiles,
            currentPage,
            totalPages: Math.ceil(totalProfiles / pageSize),
            limit: pageSize,
            hasNextPage: currentPage < Math.ceil(totalProfiles / pageSize),
            hasPreviousPage: currentPage > 1,
          },
        },
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Search doctors by query
export const searchDoctors = async (req, res) => {
  try {
    const { query, budget, location } = req.query;
    let filter = {};

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { fieldOfStudy: { $regex: query, $options: "i" } },
      ];
    }

    if (budget) {
      filter.income = { $lte: parseInt(budget) };
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    const doctors = await Doctor.find(filter);
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Search failed" });
  }
};