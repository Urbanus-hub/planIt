import { Request, Response, NextFunction } from "express";
import Booking from "../models/bookings.model.js";
import Service from "../models/services.model.js";
import { JwtPayload } from "jsonwebtoken";

interface UserPayload extends JwtPayload {
  id: string;
  role: "client" | "vendor" | "admin";
}

export const createBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as UserPayload;
    const { serviceId, date, notes } = req.body;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userBookings = await Booking.find({
      user: user.id,
      service: serviceId,
      date: date,
    });

    if (userBookings && userBookings.length > 0) {
      res.status(400).json({
        message: "You have already booked this service for the selected date",
      });
      return;
    }

    // Ensure the service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      res.status(404).json({ message: "Service not found" });
      return;
    }

    const booking = new Booking({
      user: user.id, // from authorize middleware
      service: service._id,
      provider: service.provider,
      date,
      notes,
      totalPrice: service.price,
    });

    await booking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error(error);
    const err = error as Error;
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// delete booking
export const deleteBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as UserPayload;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    if (booking.user.toString() !== user.id && user.role !== "admin") {
      res
        .status(403)
        .json({ message: "Not authorized to delete this booking" });
      return;
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
    next(err);
  }
};

// get bookings for a user
export const getUserBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as UserPayload;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const bookings = await Booking.find({ user: req.params.id });
    res.status(200).json(bookings);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
    next(err);
  }
};

// get bookings for a service
export const getServiceBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as UserPayload;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const bookings = await Booking.find({ service: req.params.id });
    res.status(200).json(bookings);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
    next(err);
  }
};

// get bookings for a provider
export const getProviderBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as UserPayload;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const bookings = await Booking.find({ provider: req.params.id });
    res.status(200).json(bookings);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
    next(err);
  }
};

// get all bookings (admin only)
export const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as UserPayload;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (user.role !== "admin") {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const bookings = await Booking.find();

    if (!bookings || bookings.length === 0) {
      res.status(404).json({ message: "No bookings found" });
      return;
    }

    res.status(200).json(bookings);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
    next(err);
  }
};

// update booking status
export const updateBookingStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as UserPayload;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    booking.status = req.body.status;
    await booking.save();

    res.status(200).json({
      message: "Booking status updated successfully",
      booking,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
    next(err);
  }
};

// update booking
export const updateBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as UserPayload;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    if (booking.user.toString() !== user.id && user.role !== "admin") {
      res
        .status(403)
        .json({ message: "Not authorized to update this booking" });
      return;
    }

    Object.assign(booking, req.body);
    await booking.save();

    res.status(200).json({
      message: "Booking updated successfully",
      booking,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
    next(err);
  }
};
