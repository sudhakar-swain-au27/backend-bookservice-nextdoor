import Business from "../models/business.model.js";
import { Service } from "../models/service.model.js";

/**
 * @desc    Get Public Provider Profile by Slug
 * @route   GET /api/v1/public/provider/:slug
 * @access  Public
 */
export const getPublicProviderProfile = async (req, res) => {
  try {
    const business = await Business.findOne({ slug: req.params.slug });

    if (!business) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    const { businessName, slug, logo, services, offers, professionals, description, banner, gallery, address, mapLocation, category, city, phone, openingTime, closingTime, closedDays } = business;

    return res.status(200).json({
      success: true,
      data: {
        businessName,
        slug,
        logo,
        services,
        offers,
        professionals,
        description,
        banner,
        gallery,
        address,
        mapLocation,
        category,
        city,
        phone,
        openingTime,
        closingTime,
        closedDays
      }
    });
  } catch (error) {
    console.error("Get Public Provider Profile Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc    Get Public Provider Profile by ID
 * @route   GET /api/v1/public/business/:businessId
 * @access  Public
 */
export const getPublicBusinessProfile = async (req, res) => {
  try {
    const business = await Business.findById(req.params.businessId);

    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }

    const { businessName, slug, logo, services, offers, professionals, description, banner, gallery, address, mapLocation, category, city, phone, openingTime, closingTime, closedDays } = business;

    return res.status(200).json({
      success: true,
      data: {
        _id: business._id,
        businessName,
        slug,
        logo,
        services,
        offers,
        professionals,
        description,
        banner,
        gallery,
        address,
        mapLocation,
        category,
        city,
        phone,
        openingTime,
        closingTime,
        closedDays
      }
    });
  } catch (error) {
    console.error("Get Public Business Profile Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc    Search Businesses by Category
 * @route   GET /api/v1/public/search
 * @access  Public
 */
export const searchBusinesses = async (req, res) => {
  try {
    const { category, city, keyword } = req.query;

    const query = { isProfileComplete: true };

    if (category) query.category = { $regex: category, $options: 'i' };
    if (city) query.city = { $regex: city, $options: 'i' };
    if (keyword) {
      query.$or = [
        { businessName: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } }
      ];
    }

    const businesses = await Business.find(query).select('-password -email');

    return res.status(200).json({
      success: true,
      message: "Businesses found",
      count: businesses.length,
      data: businesses
    });
  } catch (error) {
    console.error("Search Businesses Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
