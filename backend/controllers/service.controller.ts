import { Request, Response, NextFunction } from "express";
import Service from "../models/services.model.js";
import { AuthUser } from "../types/auth.types.js";

export const createService = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as AuthUser;
    const {
      title,
      category,
      description,
      price,
      pricingType,
      location,
      images,
      availability,
      capacity,
      duration,
      tags,
    } = req.body;

    // Validation
    if (!title || !category || !description || !price || !location) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: title, category, description, price, location",
      });
      return;
    }

    const service = await Service.create({
      title,
      category,
      description,
      price,
      pricingType: pricingType || "fixed",
      location,
      images: images || [],
      availability,
      capacity,
      duration,
      tags,
      provider: user.id,
      isActive: true,
    });

    await service.populate("provider", "name email businessName");

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create service",
      error: (error as Error).message,
    });
  }
};

export const getServices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { category, location, minPrice, maxPrice, search, isActive } = req.query;

    // Build filter
    const filter: any = {};
    
    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search as string, "i")] } },
      ];
    }
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    } else {
      // By default, only show active services
      filter.isActive = true;
    }

    const services = await Service.find(filter)
      .populate("provider", "name businessName rating reviewCount")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: (error as Error).message,
    });
  }
};

export const getServiceById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "provider",
      "name email businessName businessDescription rating reviewCount"
    );

    if (!service) {
      res.status(404).json({
        success: false,
        message: "Service not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch service",
      error: (error as Error).message,
    });
  }
};

export const updateService = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404).json({
        success: false,
        message: "Service not found",
      });
      return;
    }

    // Update service
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate("provider", "name businessName");

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update service",
      error: (error as Error).message,
    });
  }
};

export const deleteService = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404).json({
        success: false,
        message: "Service not found",
      });
      return;
    }

    // Soft delete - just mark as inactive
    service.isActive = false;
    await service.save();

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete service",
      error: (error as Error).message,
    });
  }
};

// Get services by provider
export const getProviderServices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as AuthUser;
    const providerId = req.params.providerId || user.id;

    const services = await Service.find({ provider: providerId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch provider services",
      error: (error as Error).message,
    });
  }
};