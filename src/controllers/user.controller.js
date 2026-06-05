import User from '../models/user.model.js';

// ✅ Get Current User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp -otpExpires');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user
    });
  } catch (error) {
    console.error("Get User Profile Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;

    // Prevent updating sensitive fields
    delete updates.phoneNumber;
    delete updates.password;
    delete updates.otp;
    delete updates.otpExpires;
    delete updates.role;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select('-password -otp -otpExpires');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error("Update User Profile Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Get User's Bookings
export const getUserBookings = async (req, res) => {
  try {
    const Booking = (await import('../models/Booking.js')).default;
    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ 'slot.start': -1 })
      .populate('serviceId', 'name price')
      .populate('businessId', 'businessName');

    res.status(200).json({
      success: true,
      message: "User bookings fetched successfully",
      bookings
    });
  } catch (error) {
    console.error("Get User Bookings Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Delete User Account
export const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (error) {
    console.error("Delete User Account Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
