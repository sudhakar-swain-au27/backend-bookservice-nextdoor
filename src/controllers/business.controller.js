// src/controllers/business.controller.js

import Business from "../models/business.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Service } from "../models/service.model.js";
import { Offer } from "../models/offer.model.js";

// JWT Token Generator
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ================== BUSINESS AUTH ==================

// Business Registration
export const registerBusiness = async (req, res) => {
  try {
    const { businessName, email, password } = req.body;

    const existingBusiness = await Business.findOne({ email });
    if (existingBusiness) {
      return res.status(400).json({ success: false, message: "Business already registered!" });
    }

    const business = await Business.create({
      businessName,
      email,
      password
      // Remaining fields will be added in complete profile
    });

    const token = generateToken(business._id);

    return res.status(201).json({
      success: true,
      message: "Business registered successfully!",
      token,
      business: {
        _id: business._id,
        businessName: business.businessName,
        email: business.email
      }
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// Business Login
export const loginBusiness = async (req, res) => {
  try {
    const { email, password } = req.body;

    const business = await Business.findOne({ email });
    if (!business) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, business.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(business._id);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      token,
      business: {
        _id: business._id,
        businessName: business.businessName,
        email: business.email
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ================== BUSINESS PROFILE ==================

export const completeBusinessProfile = async (req, res) => {
  try {
    const {
      businessName,
      ownerName,
      phone,
      openingTime,
      closingTime,
      closedDays,
      address,
      city,
      mapLocation,
      description,
      category,
      logo,
      banner,
      gallery
    } = req.body;

    const business = await Business.findById(req.user.id);

    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }

    business.businessName = businessName || business.businessName;
    business.ownerName = ownerName || business.ownerName;
    business.phone = phone || business.phone;
    business.openingTime = openingTime;
    business.closingTime = closingTime;
    business.closedDays = closedDays;
    business.address = address;
    business.city = city;
    business.mapLocation = mapLocation;
    business.description = description;
    business.category = category;
    business.logo = logo;
    business.banner = banner;
    business.gallery = gallery;
    business.isProfileComplete = true;

    await business.save();

    return res.status(200).json({ success: true, message: "Profile updated", business });
  } catch (error) {
    console.error("Profile Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getBusinessProfile = async (req, res) => {
  try {
    const business = await Business.findById(req.user.id).select("-password");
    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }
    return res.status(200).json({ success: true, business });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateBusinessProfile = async (req, res) => {
  try {
    const updates = req.body;
    const business = await Business.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true
    });
    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }
    return res.status(200).json({ success: true, message: "Profile updated successfully", business });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ================== SERVICES ==================

export const addService = async (req, res) => {
  try {
    const { name, description, price, offer, image } = req.body;
    const service = await Service.create({
      business: req.user.id,
      name,
      description,
      price,
      offer,
      image
    });
    return res.status(201).json({ success: true, message: "Service added successfully", service });
  } catch (error) {
    console.error("Add Service Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ business: req.user.id });
    return res.status(200).json({ success: true, services });
  } catch (error) {
    console.error("Get Services Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const updates = req.body;
    const service = await Service.findOneAndUpdate(
      { _id: serviceId, business: req.user.id },
      updates,
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    return res.status(200).json({ success: true, message: "Service updated", service });
  } catch (error) {
    console.error("Update Service Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findOneAndDelete({
      _id: serviceId,
      business: req.user.id
    });
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    return res.status(200).json({ success: true, message: "Service deleted" });
  } catch (error) {
    console.error("Delete Service Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ================== OFFERS ==================

export const createOffer = async (req, res) => {
  try {
    const { title, description, discountPercent, expiryDate } = req.body;
    const offer = await Offer.create({
      business: req.user.id,
      title,
      description,
      discountPercent,
      expiryDate
    });
    return res.status(201).json({ success: true, message: "Offer created successfully", offer });
  } catch (error) {
    console.error("Create Offer Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ business: req.user.id });
    return res.status(200).json({ success: true, offers });
  } catch (error) {
    console.error("Get Offers Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const offer = await Offer.findOneAndDelete({
      _id: offerId,
      business: req.user.id
    });
    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found" });
    }
    return res.status(200).json({ success: true, message: "Offer deleted" });
  } catch (error) {
    console.error("Delete Offer Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};