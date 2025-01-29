import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["doctor", "user"], required: true },
    profession: { type: String }, // For users
    isVerified: { type: Boolean, default: false },
    
    image: { type: String, default:'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg' }, // New field for image URL
    status: { type: String, enum: ["inactive", "active", "inProgress", "completed"], default: "inactive" }, // User's current status
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
