import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Reference to the user
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    }, // Reference to the doctor
    price: { type: Number, required: true }, // Price offered by the doctor
    schedule: { type: String, required: true }, // Schedule proposed by the doctor
    description: { type: String, required: true }, // Description of the offer
    estimatedHours: { type: Number, required: true }, // Estimated hours to complete the work
    rating: { type: Number, min: 1, max: 5, default: null }, // Rating from 1 to 5
    review: { type: String, default: null },
    name: { type: String }, // Adding name to Offer schema
    profession: { type: String },
    status: {
      type: String,
      enum: ["Active", "Completed", "Accepted", "Cancelled", "Rejected", ],
      default: "Active",
    }, 
  },
  { timestamps: true }
);

const Offer = mongoose.model("Offer", offerSchema);

export default Offer;
