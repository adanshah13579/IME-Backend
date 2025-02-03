import Offer from "../models/Offer.js";
import User from "../models/userModal.js";

export const createOffer = async (req, res) => {
  try {
    const {
      userId,
      price,
      schedule,
      description,
      estimatedHours,
      name,
      profession,
    } = req.body;

    const Usser = await User.findById(userId);
    if (!Usser || Usser.role !== "user") {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    // Ensure the user is logged in
    const doctorId = req.user.id;

    const user = await User.findById(userId).select("name profession");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Create the offer
    const offer = new Offer({
      userId,
      doctorId,
      price,
      schedule,
      description,
      estimatedHours,
      status: "Active",
      name,
      profession,
    });

    await offer.save();

    return res.status(201).json({
      success: true,
      offer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const acceptOffer = async (req, res) => {
  try {
    const { offerId, userId } = req.body;

    // Find the offer by ID
    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res
        .status(404)
        .json({ success: false, message: "Offer not found" });
    }

    // Check if the offer is for the correct user
    if (offer.userId.toString() !== userId) {
      return res.status(400).json({
        success: false,
        message: "Offer does not belong to this user",
      });
    }

    // Update offer status to accepted
    offer.status = "accepted";
    await offer.save();

    // Now, update the user’s status to "active"
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.status = "active";
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Offer accepted and user status updated to active",
      offer,
      user,
    });
  } catch (error) {
    console.error(error);
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
    const doctorId = req.user.id; // Extract doctor ID from token
    const offers = await Offer.find({ doctorId });

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

// API to submit rating and review
export const submitRating = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { rating, review } = req.body;

    // Check if the offer exists
    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res
        .status(404)
        .json({ success: false, message: "Offer not found" });
    }

    // Ensure the offer is completed before submitting a rating
    if (offer.status !== "completed") {
      return res
        .status(400)
        .json({ success: false, message: "Offer must be completed to rate" });
    }

    // Update the offer with rating and review
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
