import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Business from "../models/business.model.js";

// Protect Business (Private Routes)
export const protectBusiness = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.type !== "business") {
        return res.status(403).json({ success: false, message: "Access denied. Business token required." });
      }

      req.business = await Business.findById(decoded.id).select("-password");
      if (!req.business) {
        return res.status(404).json({ success: false, message: "Business not found" });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ success: false, message: "Not authorized, no token" });
  }
};

// Protect User (Private Routes)
export const protectUser = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.type !== "user") {
        return res.status(403).json({ success: false, message: "Access denied. User token required." });
      }

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ success: false, message: "Not authorized, no token" });
  }
};
