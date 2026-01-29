// Middleware to check if instructor is verified
// Only verified instructors can access certain features like creating courses

export const isVerifiedInstructor = (req, res, next) => {
  try {
    // Check if user is authenticated (from auth middleware)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - Please login" });
    }

    // Check if user is an instructor
    if (req.user.role !== "instructor") {
      return res.status(403).json({ message: "Forbidden - Only instructors can access this" });
    }

    // Check if instructor is verified
    if (!req.user.isVerified) {
      
      return res.status(403).json({ 
        message: "Your instructor profile is pending verification. Please wait for admin approval.",
        status: "PENDING_VERIFICATION"
      });
    }

    // Instructor is verified, proceed
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default isVerifiedInstructor;
