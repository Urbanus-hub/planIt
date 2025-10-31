import { Request, Response, NextFunction } from "express";
import Booking from "../models/bookings.model.js";
import Service from "../models/services.model.js";
import { AuthUser } from "../types/auth.types.js";

export const createBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as AuthUser;
    const { serviceId, date, notes, attendees } = req.body;

    // Validation
    if (!serviceId || !date) {
      res.status(400).json({
        success: false,
        message: "Service ID and date are required",
      });
      return;
    }

    // Check for duplicate bookings
    const existingBooking = await Booking.findOne({
      user: user.id,
      service: serviceId,
      date: new Date(date),
      status: { $nin: ["cancelled", "refunded"] },
    });

    if (existingBooking) {
      res.status(400).json({
        success: false,
        message: "You have already booked this service for the selected date",
      });
      return;
    }

    // Verify service exists and is active
    const service = await Service.findById(serviceId);
    if (!service) {
      res.status(404).json({
        success: false,
        message: "Service not found",
      });
      return;
    }

    if (!service.isActive) {
      res.status(400).json({
        success: false,
        message: "This service is currently unavailable",
      });
      return;
    }

    // Check capacity if applicable
    if (service.capacity) {
      const bookingsOnDate = await Booking.countDocuments({
        service: serviceId,
        date: new Date(date),
        status: { $nin: ["cancelled", "refunded"] },
      });

      if (bookingsOnDate >= service.capacity) {
        res.status(400).json({
          success: false,
          message: "This service is fully booked for the selected date",
        });
        return;
      }
    }

    // Create booking
    const booking = await Booking.create({
      user: user.id,
      service: service._id,
      provider: service.provider,
      startDate: new Date(date),
      notes,
      attendees,
      totalPrice: service.price,
      status: "pending",
      paymentStatus: "unpaid",
    });

    // Populate booking data
    await booking.populate([
      { path: "user", select: "name email" },
      { path: "service", select: "title category price" },
      { path: "provider", select: "name email businessName" },
    ]);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: (error as Error).message,
    });
  }
};

export const deleteBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });
      return;
    }

    // Update status to cancelled instead of deleting
    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    booking.cancelledBy = (req.user as AuthUser).id as any;
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: (error as Error).message,
    });
  }
};

export const getUserBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as AuthUser;
    const userId = req.params.userId || user.id;

    // Check authorization (user can only view their own bookings unless admin)
    if (userId !== user.id && user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Access denied",
      });
      return;
    }

    const bookings = await Booking.find({ user: userId })
      .populate("service", "title category price location")
      .populate("provider", "name businessName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: (error as Error).message,
    });
  }
};

export const getServiceBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bookings = await Booking.find({ service: req.params.serviceId })
      .populate("user", "name email")
      .populate("provider", "name businessName")
      .sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch service bookings",
      error: (error as Error).message,
    });
  }
};

export const getProviderBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as AuthUser;
    const providerId = req.params.providerId || user.id;

    // Vendors can only view their own bookings unless admin
    if (user.role === "vendor" && providerId !== user.id) {
      res.status(403).json({
        success: false,
        message: "Access denied",
      });
      return;
    }

    const bookings = await Booking.find({ provider: providerId })
      .populate("user", "name email phone")
      .populate("service", "title category price")
      .sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch provider bookings",
      error: (error as Error).message,
    });
  }
};

export const getAllBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("service", "title category price")
      .populate("provider", "name businessName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: (error as Error).message,
    });
  }
};

export const updateBookingStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as AuthUser;
    const { status } = req.body;
    const { isProvider, isBookingOwner } = req.body;

    const validStatuses = ["pending", "confirmed", "completed", "cancelled", "refunded"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid status",
      });
      return;
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });
      return;
    }

    // Business logic for status updates
    if (status === "confirmed" && !isProvider && user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Only the service provider can confirm bookings",
      });
      return;
    }

    if (status === "completed" && !isProvider && user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Only the service provider can mark bookings as completed",
      });
      return;
    }

    if (status === "cancelled") {
      booking.cancelledAt = new Date();
      booking.cancelledBy = user.id as any;
    }

    if (status === "confirmed") {
      booking.confirmedAt = new Date();
    }

    if (status === "completed") {
      booking.completedAt = new Date();
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update booking status",
      error: (error as Error).message,
    });
  }
};

export const updateBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { date, notes, attendees } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });
      return;
    }

    // Don't allow updates to confirmed/completed bookings
    if (["completed", "cancelled", "refunded"].includes(booking.status)) {
      res.status(400).json({
        success: false,
        message: `Cannot update ${booking.status} bookings`,
      });
      return;
    }

    // Update allowed fields
    if (date) booking.startDate = new Date(date);
    if (notes !== undefined) booking.notes = notes;
    if (attendees !== undefined) booking.attendees = attendees;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
      error: (error as Error).message,
    });
  }
};