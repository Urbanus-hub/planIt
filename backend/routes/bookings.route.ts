import { Router } from "express";
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getUserBookings,
  getServiceBookings,
  getProviderBookings,
  updateBookingStatus,
  updateBooking,
} from "../controllers/bookings.controller.js";
import authorize from "../middlewares/authorize.middleware.js";
import { authorizeRole } from "../middlewares/roleBasedAccess.middleware";
import {
  verifyBookingOwnership,
  verifyProviderAccess,
} from "../middlewares/bookingAuthorization";

const router = Router();

// Create a new booking (authenticated users only)
router.post("/", authorize, createBooking);

// Get all bookings (admin only)
router.get("/", authorize, authorizeRole("admin"), getAllBookings);

// Get user's bookings (user themselves or admin)
router.get(
  "/user/:userId",
  authorize,
  authorizeRole("client", "admin"),
  getUserBookings
);

// Get bookings for a specific service (service provider or admin)
router.get(
  "/service/:serviceId",
  authorize,
  authorizeRole("vendor", "admin"),
  getServiceBookings
);

// Get provider's bookings (provider themselves or admin)
router.get(
  "/provider/:providerId/bookings",
  authorize,
  authorizeRole("vendor", "admin"),
  getProviderBookings
);

// Update booking details (booking owner only)
router.patch(
  "/:id",
  authorize,
  verifyBookingOwnership,
  updateBooking
);

// Update booking status (provider can confirm/complete, user can cancel)
router.patch(
  "/:id/status",
  authorize,
  verifyProviderAccess,
  updateBookingStatus
);

// Delete/cancel booking (booking owner or admin)
router.delete(
  "/:id",
  authorize,
  verifyBookingOwnership,
  deleteBooking
);

export default router;