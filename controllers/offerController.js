import Offer from '../models/Offer.js';
import User from '../models/userModal.js';

export const createOffer = async (req, res) => {
  try {
    const { doctorId, price, schedule, description, estimatedHours, name, profession } = req.body;

    // Ensure the doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Ensure the user is logged in
    const userId = req.user.id;

    // Find the user by userId to check the login status (optional, just in case you want to fetch user details)
    const user = await User.findById(userId).select('name profession');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Create the offer
    const offer = new Offer({
      userId,
      doctorId,
      price,
      schedule,
      description,
      estimatedHours,
      status: 'pending', // Default status
      name,  // Directly adding the name
      profession,  // Directly adding the profession
    });

    await offer.save();

    return res.status(201).json({
      success: true,
      offer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};



export const acceptOffer = async (req, res) => {
    try {
      const { offerId, userId } = req.body; 
  
      // Find the offer by ID
      const offer = await Offer.findById(offerId);
  
      if (!offer) {
        return res.status(404).json({ success: false, message: "Offer not found" });
      }
  
      // Check if the offer is for the correct user
      if (offer.userId.toString() !== userId) {
        return res.status(400).json({ success: false, message: "Offer does not belong to this user" });
      }
  
      // Update offer status to accepted
      offer.status = 'accepted';
      await offer.save();
  
      // Now, update the user’s status to "active"
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
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


  export const updateOfferStatus = async (req, res) => {
    try {
      console.log('i am here');
      
      const { offerId, status } = req.body; // The offerId and the new status should be in the request body
  
      if (!offerId || !status) {
        return res.status(400).json({ success: false, message: "Offer ID and status are required" });
      }
  
      // Find the offer by ID
      const offer = await Offer.findById(offerId);
  
      if (!offer) {
        return res.status(404).json({ success: false, message: "Offer not found" });
      }
  
      // Ensure the doctor is the one who created the offer (only doctor can update status)
      console.log(offer.doctorId.toString(), req.user.id);
      
      if (offer.doctorId.toString() != req.user.id) {
        return res.status(403).json({ success: false, message: "You are not authorized to update this offer" });
      }
  
      // Update the offer's status
      offer.status = status;
  
      // Save the offer with updated status, but do not require other fields like profession and name
      const updatedOffer = await offer.save();
  
      // Optionally, update the user status or other actions based on the offer status change
      if (status === "completed") {
        const user = await User.findById(offer.userId);
        if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
        // You could update the user's status or take other actions here
      }
  
      return res.status(200).json({
        success: true,
        message: "Offer status updated successfully",
        offer: updatedOffer,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };


export const editOffer = async (req, res) => {
    try {
      const { offerId, price, schedule, description, estimatedHours } = req.body;
  
      // Find the offer by ID
      const offer = await Offer.findById(offerId);
  
      if (!offer) {
        return res.status(404).json({ success: false, message: "Offer not found" });
      }
  
      // Ensure the doctor is the one who created the offer
      if (offer.doctorId.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: "You are not authorized to edit this offer" });
      }
  
      // Update the offer with new details
      offer.price = price || offer.price;  // If price is provided, update, otherwise keep the existing one
      offer.schedule = schedule || offer.schedule;
      offer.description = description || offer.description;
      offer.estimatedHours = estimatedHours || offer.estimatedHours;
  
      // Save the updated offer
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
      const offerId = req.params.offerId; // Get the offer ID from the URL parameter
  
      // Find the offer by its ID
      const offer = await Offer.findById(offerId);
  
      // Check if the offer exists
      if (!offer) {
        return res.status(404).json({ success: false, message: 'Offer not found' });
      }
  
      // Return the offer data
      return res.status(200).json({
        success: true,
        offer,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  };


  // Fetch all offers
export const getAllOffers = async (req, res) => {
  try {
    // Fetch all offers from the database
    const offers = await Offer.find();

    // Check if there are any offers
    if (!offers || offers.length === 0) {
      return res.status(404).json({ success: false, message: 'No offers found' });
    }

    // Return the list of all offers
    return res.status(200).json({
      success: true,
      offers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
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
      return res.status(404).json({ success: false, message: "Offer not found" });
    }

    // Ensure the offer is completed before submitting a rating
    if (offer.status !== "completed") {
      return res.status(400).json({ success: false, message: "Offer must be completed to rate" });
    }

    // Update the offer with rating and review
    offer.rating = rating;
    offer.review = review;

    await offer.save();

    return res.status(200).json({ success: true, message: "Rating and review submitted", offer });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



