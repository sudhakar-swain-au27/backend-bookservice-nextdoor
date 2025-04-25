import express from "express";
import { getPublicProviderProfile } from "../controllers/public.controller.js";

const router = express.Router();

router.get('/provider/:slug', getPublicProviderProfile);

export default router;
