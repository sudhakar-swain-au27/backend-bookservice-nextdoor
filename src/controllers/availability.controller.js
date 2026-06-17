import Availability from '../models/availability.model.js';

export const createOrUpdateAvailability = async (req, res, next) => {
  try {
    const { business, service, professional } = req.body;
    if (!business || !service) return res.status(400).json({ message: 'business and service required' });

    const query = { business, service };
    if (professional) query.professional = professional;
    else query.professional = { $exists: false };

    const update = { ...req.body };
    const opts = { upsert: true, new: true, setDefaultsOnInsert: true };

    const doc = await Availability.findOneAndUpdate(query, update, opts);
    res.status(200).json({ success: true, availability: doc });
  } catch (err) {
    next(err);
  }
};

export const getAvailability = async (req, res, next) => {
  try {
    const { businessId, serviceId, professionalId } = req.query;
    if (!businessId || !serviceId) return res.status(400).json({ message: 'businessId and serviceId required' });

    const query = { business: businessId, service: serviceId };
    if (professionalId) query.professional = professionalId;
    else query.professional = { $exists: false };

    const doc = await Availability.findOne(query).lean();
    res.json({ success: true, availability: doc });
  } catch (err) {
    next(err);
  }
};

export default { createOrUpdateAvailability, getAvailability };
