// src/controllers/business.controller.js

import Business from "../models/business.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { Service } from "../models/service.model.js";
import { Offer } from "../models/offer.model.js";

/**
 * Helper to format business response
 */
const formatBusinessResponse = (business) => ({
  _id: business._id,
  businessName: business.businessName,
  email: business.email,
  slug: business.slug,
  logo: business.logo
});

/** ================== BUSINESS AUTH ================== */

export const registerBusiness = async (req, res) => {
  try {
    const { businessName, email, password } = req.body;

    if (await Business.findOne({ email })) {
      return res.status(400).json({ success: false, message: "Business already registered!" });
    }

    const business = await Business.create({ businessName, email, password });
    const token = generateToken(business._id, "business");

    return res.status(201).json({
      success: true,
      message: "Business registered successfully!",
      token,
      business: formatBusinessResponse(business)
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const loginBusiness = async (req, res) => {
  try {
    const { email, password } = req.body;
    const business = await Business.findOne({ email });

    if (!business || !(await bcrypt.compare(password, business.password))) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(business._id, "business");
    return res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      token,
      business: formatBusinessResponse(business)
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/** ================== BUSINESS PROFILE ================== */

export const completeBusinessProfile = async (req, res) => {
  try {
    const updates = req.body;
    const business = await Business.findById(req.business.id);

    if (!business) return res.status(404).json({ success: false, message: "Business not found" });

    Object.assign(business, {
      ...updates,
      services: typeof updates.services === "string" ? JSON.parse(updates.services) : updates.services,
      offers: typeof updates.offers === "string" ? JSON.parse(updates.offers) : updates.offers,
      professionals: typeof updates.professionals === "string" ? JSON.parse(updates.professionals) : updates.professionals,
      isProfileComplete: true
    });

    await business.save();
    return res.status(200).json({ success: true, message: "Profile updated", business });
  } catch (error) {
    console.error("Profile Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getBusinessProfile = async (req, res) => {
  try {
    const business = await Business.findById(req.business.id).select("-password");

    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Business profile fetched successfully",
      data: business
    });
  } catch (error) {
    console.error("Get Business Profile Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again later." });
  }
};

export const updateBusinessProfile = async (req, res) => {
  try {
    const updates = req.body;
    const business = await Business.findByIdAndUpdate(req.business.id, updates, { new: true, runValidators: true });
    if (!business) return res.status(404).json({ success: false, message: "Business not found" });
    return res.status(200).json({ success: true, message: "Profile updated successfully", business });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/** ================== SERVICES MANAGEMENT ================== */

export const addService = async (req, res) => {
  try {
    const service = await Service.create({ business: req.business.id, ...req.body });
    return res.status(201).json({ success: true, message: "Service added successfully", service });
  } catch (error) {
    console.error("Add Service Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ business: req.business.id });
    return res.status(200).json({ success: true, services });
  } catch (error) {
    console.error("Get Services Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.serviceId, business: req.business.id },
      req.body,
      { new: true }
    );
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    return res.status(200).json({ success: true, message: "Service updated", service });
  } catch (error) {
    console.error("Update Service Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ _id: req.params.serviceId, business: req.business.id });
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    return res.status(200).json({ success: true, message: "Service deleted" });
  } catch (error) {
    console.error("Delete Service Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/** ================== OFFERS MANAGEMENT ================== */

export const createOffer = async (req, res) => {
  try {
    const offer = await Offer.create({ business: req.business.id, ...req.body });
    return res.status(201).json({ success: true, message: "Offer created successfully", offer });
  } catch (error) {
    console.error("Create Offer Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ business: req.business.id });
    return res.status(200).json({ success: true, offers });
  } catch (error) {
    console.error("Get Offers Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findOneAndDelete({ _id: req.params.offerId, business: req.business.id });
    if (!offer) return res.status(404).json({ success: false, message: "Offer not found" });
    return res.status(200).json({ success: true, message: "Offer deleted" });
  } catch (error) {
    console.error("Delete Offer Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
