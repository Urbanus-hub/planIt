import { Router } from "express";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  getProviderServices,
} from "../controllers/service.controller.js";
import authorize from "../middlewares/authorize.middleware";
import { authorizeRole } from "../middlewares/roleBasedAccess.middleware";
import { verifyServiceOwnership } from "../middlewares/serviceAuthorization";

const router = Router();

// Get all services (public - no auth required, or add authorize if you want auth)
// If you want filtering by category, location, etc., this should be public
router.get("/", getServices);

// Get single service by ID (public)
router.get("/:id", getServiceById);

// Get services by provider (public)
router.get("/provider/:providerId", getProviderServices);

// Create a new service (vendors only)
router.post("/", authorize, authorizeRole("vendor", "admin"), createService);

// Update service (service owner or admin)
router.patch(
  "/:id",
  authorize,
  authorizeRole("vendor", "admin"),
  verifyServiceOwnership,
  updateService
);

// Delete service (service owner or admin)
router.delete(
  "/:id",
  authorize,
  authorizeRole("vendor", "admin"),
  verifyServiceOwnership,
  deleteService
);

export default router;
