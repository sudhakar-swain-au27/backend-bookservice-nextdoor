import {Service} from '../models/service.model.js';

// Add Service (Business Side)
export const addService = async (req, res) => {
  try {
    const { name, description, price, duration, category, imageUrl, availableSlots } = req.body;
    const service = new Service({
      businessId: req.business.id,
      name,
      description,
      price,
      duration,
      category,
      imageUrl,
      availableSlots
    });
    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(500).json({ message: 'Error adding service', error });
  }
};

// Get All Services (User Side)
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate('businessId', 'name');
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error });
  }
};
