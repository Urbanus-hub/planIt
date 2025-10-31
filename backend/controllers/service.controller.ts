import { Request, Response, NextFunction } from "express";
import Service from "../models/services.model.js";
import { JwtPayload } from "jsonwebtoken";

interface UserPayload extends JwtPayload {
  id: string;
  role: "client" | "vendor" | "admin";
}

// create a service
const createService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const creator = req.user as UserPayload;

    if (creator.role !== "vendor" && creator.role !== "admin") {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const { title, category, description, price, location, image } = req.body;

    if (!title || !category || !description || !price || !location) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const providerId = creator.id; // from authorize middleware
    const service = await Service.create({
      title,
      category,
      description,
      price,
      location,
      image,
      provider: providerId,
    });

    if (!service) {
      res.status(400).json({ message: "Service creation failed" });
      return;
    }

    res.status(201).json({ message: "Service created successfully", service });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
    next(err);
  }
};

// get all services
const getServices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const services = await Service.find();

    if (!services || services.length === 0) {
      res.status(404).json({ message: "No services found" });
      return;
    }

    res.status(200).json({ services });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
    next(err);
  }
};

// get a service by id
const getServiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404).json({ message: "Service not found" });
      return;
    }

    res.status(200).json({ service });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
    next(err);
  }
};

// update a service
const updateService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updater = req.user as UserPayload;

    if (!updater) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (updater.role !== "vendor" && updater.role !== "admin") {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404).json({ message: "Service not found" });
      return;
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
    next(err);
  }
};

// delete a service
const deleteService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as UserPayload;

    if (user.role !== "vendor" && user.role !== "admin") {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404).json({ message: "Service not found" });
      return;
    }

    const deletedService = await Service.findByIdAndDelete(req.params.id);

    if (!deletedService) {
      res.status(400).json({ message: "Service deletion failed" });
      return;
    }

    res.status(200).json({
      message: "Service deleted successfully",
      service: deletedService,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
    next(err);
  }
};

export {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};
