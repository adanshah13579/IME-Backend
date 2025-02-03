import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Decode the token and attach the user to req.user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Assuming decoded token contains the user's info (e.g., id)
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
