import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    aboutMe: { type: String, required: true },
    location: { type: String, required: true },
    workStatus: { type: String, required: true },
    experience: { type: String, required: true },
    fieldOfStudy: { type: String, required: true },
    income: { type: String, required: true },
    image: { type: String, default:'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg' }, // New field for image URL
    file: { type: String },  // New field for file URL (e.g., CV or document)

    video: { type: String },  // New field for video URL
    offers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }], 
    
  },
  { timestamps: true }
);

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
