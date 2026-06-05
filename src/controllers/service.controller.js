import {Service} from '../models/service.model.js';

// Add Service (Business Side)
export const addService = async (req, res) => {
  try {
    const { name, description, price, duration, category, imageUrl, availableSlots, offer } = req.body;
    const service = new Service({
      business: req.business._id,
      name,
      description,
      price,
      duration,
      category,
      image: imageUrl,
      offer,
      availableSlots
    });
    const savedService = await service.save();
    res.status(201).json({
      success: true,
      message: "Service added successfully",
      service: savedService
    });
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({ success: false, message: 'Error adding service', error: error.message });
  }
};

// Get All Services (User Side)
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate('business', 'businessName logo slug');
    res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ success: false, message: 'Error fetching services', error: error.message });
  }
};

// Get Services by Business ID
export const getServicesByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    const services = await Service.find({ business: businessId }).populate('business', 'businessName');
    res.status(200).json({
      success: true,
      message: "Business services fetched successfully",
      services
    });
  } catch (error) {
    console.error('Error fetching business services:', error);
    res.status(500).json({ success: false, message: 'Error fetching services', error: error.message });
  }
};

// Get Single Service
export const getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findById(serviceId).populate('business', 'businessName logo slug');

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.status(200).json({
      success: true,
      message: "Service fetched successfully",
      service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ success: false, message: 'Error fetching service', error: error.message });
  }
};

// Update Service
export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const updates = req.body;

    // Ensure businessId can't be changed
    delete updates.business;
    delete updates._id;

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ success: false, message: 'Error updating service', error: error.message });
  }
};

// Delete Service
export const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findByIdAndDelete(serviceId);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ success: false, message: 'Error deleting service', error: error.message });
  }
};
