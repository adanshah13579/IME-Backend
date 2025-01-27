import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    aboutMe: { type: String, required: true },
    location: { type: String, required: true },
    workStatus: { type: String, required: true },
    experience: { type: String, required: true },
    fieldOfStudy: { type: String, required: true },
    income: { type: String, required: true },
    image: { type: String },  // New field for image URL
    video: { type: String },  // New field for video URL
    offers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }], 
  },
  { timestamps: true }
);

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
