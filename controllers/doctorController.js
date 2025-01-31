import Doctor from "../models/Doctor.js";

export const createDoctorProfile = async (req, res) => {
  try {
    // Ensure the user is authenticated
    console.log("User trying to create profile:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    if (req.user.role !== "doctor") {
      return res
        .status(403)
        .json({ message: "Access denied. Only doctors can create profiles." });
    }
    const existingProfile = await Doctor.findOne({ userId: req.user.id });
    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists. You can update your profile." });
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

    const newDoctorProfile = new Doctor({
      userId: req.user.id, 
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

export const updateDoctorProfile = async (req, res) => {
  const { userId } = req.params; // Get userId from the URL parameter
  const { name, email, phone, aboutMe, location, workStatus, experience, fieldOfStudy, income, image, video, file } = req.body;

  try {
    // Find the doctor by their userId
    const doctor = await Doctor.findOne({ userId });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Optionally, validate the profile data
    // If you're using a validator, like Joi or a custom one
    // const { error } = validateProfileData(req.body);
    // if (error) return res.status(400).json({ message: error.details[0].message });

    // Update the doctor's profile fields
    doctor.name = name || doctor.name;
    doctor.email = email || doctor.email;
    doctor.phone = phone || doctor.phone;
    doctor.aboutMe = aboutMe || doctor.aboutMe;
    doctor.location = location || doctor.location;
    doctor.workStatus = workStatus || doctor.workStatus;
    doctor.experience = experience || doctor.experience;
    doctor.fieldOfStudy = fieldOfStudy || doctor.fieldOfStudy;
    doctor.income = income || doctor.income;
    doctor.image = image || doctor.image; // Assuming image URL is passed
    doctor.video = video || doctor.video;
    doctor.file = file || doctor.file;

    // Save the updated doctor profile
    await doctor.save();

    return res.status(200).json({
      message: 'Profile updated successfully',
      profile: doctor,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: 'Server error, please try again later.' });
  }
};




export const getDoctorProfile = async (req, res) => {
  const { userId } = req.params; // Ensure this is correctly receiving the ID

  console.log("userId", userId);
  

  try {
    const profile = await Doctor.findOne({ userId }); // Adjust this based on your model and schema
    
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    
    return res.status(200).json(profile);
  } catch (err) {
    console.error("Error fetching doctor profile:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getProfile = async (req, res) => {
  try {
    const { id } = req.params; 
     
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