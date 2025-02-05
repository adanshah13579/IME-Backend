import Offer from "../models/Offer.js";
import User from "../models/userModal.js";
import mongoose from "mongoose";


export const createOffer = async (req, res) => {
  try {
    const { price, schedule, description, estimatedHours, doctorId, userId } = req.body;

    // Get the logged-in user (who is creating the offer)
    const creator = await User.findById(req.user.id);
    if (!creator) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let finalUserId, finalDoctorId;

    if (creator.role === "user") {
      // If the creator is a user, they should provide a doctorId
      if (!doctorId) {
        return res.status(400).json({
          success: false,
          message: "Doctor ID is required when a user creates an offer",
        });
      }
      finalUserId = creator._id; // User is the one creating the offer
      finalDoctorId = doctorId; // Doctor is chosen by the user
    } else if (creator.role === "doctor") {
      // If the creator is a doctor, they should provide a userId
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required when a doctor creates an offer",
        });
      }
      finalDoctorId = creator._id; // Doctor is the one creating the offer
      finalUserId = userId; // User is chosen by the doctor
    } else {
      return res.status(403).json({ success: false, message: "Invalid role" });
    }

    // Fetch user and doctor details
    const user = await User.findById(finalUserId).select("name profession");
    const doctor = await User.findById(finalDoctorId).select("name profession");

    if (!user || !doctor) {
      return res.status(404).json({ success: false, message: "User or doctor not found" });
    }

    // Create the offer with correct IDs
    const offer = new Offer({
      userId: finalUserId,
      doctorId: finalDoctorId,
      price,
      schedule,
      description,
      estimatedHours,
      status: "Active",
      name: user.name, // Store the user's name
      profession: doctor.profession, // Store the doctor's profession
    });

    await offer.save();

    return res.status(201).json({
      success: true,
      message: "Offer created successfully",
      offer,
    });
  } catch (error) {
    console.error("Error creating offer:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const acceptOffer = async (req, res) => {
  try {

    console.log("i am coming ");
    
    const { offerId, userId } = req.body; 

    console.log(req.body);
    

    if (!offerId || !userId) {
      return res.status(400).json({ success: false, message: "offerId and userId are required" });
    }

    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found" });
    }

    console.log("Offer found:", offer);

    if (
      (offer.userId && offer.userId.toString() === userId) || 
      (offer.doctorId && offer.doctorId.toString() === userId)
    ) {
      offer.status = "Accepted";
      await offer.save();

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      if (user.status !== "active") {
        user.status = "active";
        await user.save();
      }

      return res.status(200).json({
        success: true,
        message: "Offer accepted successfully",
        offer,
        user,
      });
    } else {
      return res.status(403).json({ success: false, message: "User is not authorized to accept this offer" });
    }
  } catch (error) {
    console.error("Error accepting offer:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const rejectOffer = async (req, res) => {
  try {

    
    const { offerId, userId } = req.body; 

    console.log(req.body);
    

    if (!offerId || !userId) {
      return res.status(400).json({ success: false, message: "offerId and userId are required" });
    }

    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found" });
    }

    console.log("Offer found:", offer);

    if (
      (offer.userId && offer.userId.toString() === userId) || 
      (offer.doctorId && offer.doctorId.toString() === userId)
    ) {
      offer.status = "Rejected";
      await offer.save();

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      if (user.status !== "active") {
        user.status = "active";
        await user.save();
      }

      return res.status(200).json({
        success: true,
        message: "Offer rejected successfully",
        offer,
        user,
      });
    } else {
      return res.status(403).json({ success: false, message: "User is not authorized to reject this offer" });
    }
  } catch (error) {
    console.error("Error rejecting offer:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const editOffer = async (req, res) => {
  try {
    const { offerId, price, schedule, description, estimatedHours } = req.body;

    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res
        .status(404)
        .json({ success: false, message: "Offer not found" });
    }

    if (offer.doctorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this offer",
      });
    }

    offer.price = price || offer.price;
    offer.schedule = schedule || offer.schedule;
    offer.description = description || offer.description;
    offer.estimatedHours = estimatedHours || offer.estimatedHours;

    await offer.save();

    return res.status(200).json({
      success: true,
      message: "Offer updated successfully",
      offer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getOffer = async (req, res) => {
  try {
    const offerId = req.params.offerId;

    console.log("offerid",offerId);
    

    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res
        .status(404)
        .json({ success: false, message: "Offer not found" });
    }

    return res.status(200).json({
      success: true,
      offer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getOffers = async (req, res) => {
  try {
    const { id, role } = req.user; // Extract user ID and role from token
    let offers;

    if (role === "doctor") {
      offers = await Offer.find({ doctorId: id });
    } else if (role === "user") {
      offers = await Offer.find({ userId: id });
    } else {
      return res.status(403).json({ success: false, message: "Unauthorized role" });
    }

    res.json({ success: true, offers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching offers" });
  }
};

export const updateOfferStatus = async (req, res) => {
  const { _id, status } = req.body;

  try {
    // Check if the offer exists
    const offer = await Offer.findById(_id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // Update the status
    offer.status = status;

    // Save the updated offer
    await offer.save();

    // Respond with the updated offer
    return res.status(200).json({
      message: "Offer status updated successfully",
      updatedOffer: offer,
    });
  } catch (error) {
    console.error("Error updating offer status:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const submitRating = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { rating, review } = req.body;

    console.log(req.body);
    
    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res
        .status(404)
        .json({ success: false, message: "Offer not found" });
    }

    if (offer.status !== "Completed") {
      return res
        .status(400)
        .json({ success: false, message: "Offer must be completed to rate" });
    }

    offer.rating = rating;
    offer.review = review;

    await offer.save();

    return res
      .status(200)
      .json({ success: true, message: "Rating and review submitted", offer });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
