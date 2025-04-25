import Business from "../models/business.model.js";

/**
 * @desc    Get Public Provider Profile by Slug
 * @route   GET /api/v1/public/provider/:slug
 * @access  Public
 */
export const getPublicProviderProfile = async (req, res) => {
    try {
      const business = await Business.findOne({ slug: req.params.slug });
  
      if (!business) return res.status(404).json({ success: false, message: "Provider not found" });
  
      const { businessName, services, offers, professionals, description, banner, gallery, address, mapLocation } = business;
  
      return res.status(200).json({ success: true, data: { businessName, services, offers, professionals, description, banner, gallery, address, mapLocation } });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  
