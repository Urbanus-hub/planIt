import { Request, Response, NextFunction } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { JWT_SECRET } from "../configs/env.js";
import { AuthUser } from "../types/auth.types.js";
import {
  generateOTP,
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
} from "../utils/emailService.js";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role, phone, businessName } = req.body;

    // Validation
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
      return;
    }

    // Password length validation
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
      return;
    }

    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400).json({
        success: false,
        message: "Email already registered",
      });
      return;
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = await User.create({
      name,
      email,
      password: hash,
      role: role || "client",
      phone,
      businessName: role === "vendor" ? businessName : undefined,
      joinedDate: new Date(),
      isActive: true,
      isVerified: false,
      verificationOTP: otp,
      verificationOTPExpire: otpExpire,
    });

    // Send OTP email
    await sendOTPEmail(email, otp, name);

    // Return user without password
    const { password: _, ...userData } = user.toObject();

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email for verification code.",
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

//log in user

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    // Find user with password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Check if user is active
    if (!user?.isActive) {
      res.status(403).json({
        success: false,
        message: "Account has been deactivated",
      });
      return;
    }

    // Check if user is verified
    if (!user?.isVerified) {
      // Generate new OTP
      const otp = generateOTP();
      const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      user.verificationOTP = otp;
      user.verificationOTPExpire = otpExpire;
      await user.save();

      // Send OTP email
      await sendOTPEmail(user.email, otp, user.name);

      res.status(403).json({
        success: false,
        message:
          "Email not verified. A new verification code has been sent to your email.",
        requiresVerification: true,
        email: user.email,
      });
      return;
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user?._id?.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie with proper cross-origin settings
    const cookieOptions = {
      httpOnly: true,
      secure: true, // Always true for production (HTTPS)
      sameSite: "none" as const, // Required for cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/", // Available for all paths
    };

    res.cookie("authToken", token, cookieOptions);

    // Return user without password
    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: userData,
      token, // Send token in response for cross-origin setups
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  // Clear the auth cookie with proper cross-origin settings
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as AuthUser;

    const currentUser = await User.findById(user.id).select("-password");

    if (!currentUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: currentUser,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { role, isActive } = req.query;

    const filter: any = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

//get vendors
export const getVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { isVerified, isActive } = req.query;
    const filter: any = { role: "vendor" };
    if (isVerified !== undefined)
      filter.isVerified = isVerified === "true" ? true : false;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const vendors = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      avatar,
      profileImage,
      profileBackground,
      businessName,
      businessDescription,
      businessAddress,
      businessLogo,
      serviceCategory,
      yearsOfExperience,
      businessLicense,
      taxId,
      specialties,
      certifications,
      businessHours,
      responseTime,
      city,
      state,
      website,
    } = req.body;

    // Don't allow updating sensitive fields
    const allowedUpdates: any = {};
    if (name) allowedUpdates.name = name;
    if (email) allowedUpdates.email = email;
    if (phone !== undefined) allowedUpdates.phone = phone;
    if (avatar !== undefined) allowedUpdates.avatar = avatar;
    if (profileImage !== undefined) allowedUpdates.profileImage = profileImage;
    if (profileBackground !== undefined)
      allowedUpdates.profileBackground = profileBackground;
    if (businessName !== undefined) allowedUpdates.businessName = businessName;
    if (businessDescription !== undefined)
      allowedUpdates.businessDescription = businessDescription;
    if (businessAddress !== undefined)
      allowedUpdates.businessAddress = businessAddress;
    if (businessLogo !== undefined) allowedUpdates.businessLogo = businessLogo;
    if (serviceCategory !== undefined)
      allowedUpdates.serviceCategory = serviceCategory;
    if (yearsOfExperience !== undefined)
      allowedUpdates.yearsOfExperience = yearsOfExperience;
    if (businessLicense !== undefined)
      allowedUpdates.businessLicense = businessLicense;
    if (taxId !== undefined) allowedUpdates.taxId = taxId;
    if (specialties !== undefined) allowedUpdates.specialties = specialties;
    if (certifications !== undefined)
      allowedUpdates.certifications = certifications;
    if (businessHours !== undefined)
      allowedUpdates.businessHours = businessHours;
    if (responseTime !== undefined) allowedUpdates.responseTime = responseTime;
    if (city !== undefined) allowedUpdates.city = city;
    if (state !== undefined) allowedUpdates.state = state;
    if (website !== undefined) allowedUpdates.website = website;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if ((req.user as AuthUser).role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Only admin can delete users",
      });
      return;
    }
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }
    if (user.role === "admin") {
      res.status(400).json({
        success: false,
        message: "Cannot delete admin user",
      });
      return;
    }
    await user.deleteOne();
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
export const toggleUserActive = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    const { active } = req.body;

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (user.role === "admin") {
      res.status(400).json({
        success: false,
        message: "Cannot delete admin user",
      });
      return;
    }

    // Soft delete - deactivate account
    user.isActive = active;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// verify vendors
export const verifyVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    const { verify } = req.body;

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
      return;
    }

    if (user.role !== "vendor") {
      res.status(400).json({
        success: false,
        message: "User is not a vendor",
      });
      return;
    }

    // Mark as verified
    user.isVerified = verify;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Vendor verified successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Verify OTP
export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({
        success: false,
        message: "Email already verified",
      });
      return;
    }

    if (!user.verificationOTP || !user.verificationOTPExpire) {
      res.status(400).json({
        success: false,
        message: "No verification code found. Please request a new one.",
      });
      return;
    }

    if (user.verificationOTPExpire < new Date()) {
      res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
      });
      return;
    }

    if (user.verificationOTP !== otp) {
      res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
      return;
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpire = undefined;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name, user.role);

    // Generate token
    const token = jwt.sign(
      { id: String(user._id), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie with proper cross-origin settings
    const cookieOptions = {
      httpOnly: true,
      secure: true, // Always true for production (HTTPS)
      sameSite: "none" as const, // Required for cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/", // Available for all paths
    };

    res.cookie("authToken", token, cookieOptions);

    // Return user without password
    const { password, ...userData } = user.toObject();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: userData,
      token, // Send token in response for cross-origin setups
    });
  } catch (error) {
    next(error);
  }
};

// Resend OTP
export const resendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email is required",
      });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({
        success: false,
        message: "Email already verified",
      });
      return;
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.verificationOTP = otp;
    user.verificationOTPExpire = otpExpire;
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp, user.name);

    res.status(200).json({
      success: true,
      message: "Verification code sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Forgot password - send reset email
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email is required",
      });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if email exists or not for security
      res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save hashed token and expiry to user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send email with reset token (not hashed)
    await sendPasswordResetEmail(email, resetToken, user.name);

    res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

// Reset password with token
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
      return;
    }

    // Hash the token from URL to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token and not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
      return;
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successful. You can now log in with your new password.",
    });
  } catch (error) {
    next(error);
  }
};

//upload profile

// Change password
