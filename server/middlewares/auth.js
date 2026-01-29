import jwt from "jsonwebtoken";
import User from "../models/users.js";

export const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({ message: "Unauthorized" })
    }
    const token = authHeader.split(" ")[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch full user data from database to get latest isVerified status
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        
        // Attach full user object to request
        req.user = {
            id: user._id,
            role: user.role,
            isVerified: user.isVerified,
            email: user.email,
            name: user.name
        };
    
        next();
    }catch(err){
        return res.status(401).json({message:"Unauthorized"})
    }
}