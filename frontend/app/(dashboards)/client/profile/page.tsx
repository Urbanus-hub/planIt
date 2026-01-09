"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  CreditCard,
  Home,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  Check,
  Upload,
  Camera,
  Loader2,
  ChevronRight,
  Shield,
  Bell,
  HelpCircle,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/lib/api";
import { uploadToCloudinary, getOptimizedImageUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

export default function ClientProfile() {
  const { user } = useAuth();
  console.log(user); // Debug log to check if user data is available

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // State for form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // State for additional fields
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      label: "Home",
      address: "123 Nairobi Road",
      city: "Nairobi",
      postalCode: "00100",
      isDefault: true,
    },
    {
      id: "2",
      label: "Work",
      address: "456 Business Park",
      city: "Nairobi",
      postalCode: "00200",
      isDefault: false,
    },
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "1",
      type: "card",
      last4: "4242",
      expiryDate: "12/26",
      cardholderName: "John Kipchoge",
      isDefault: true,
    },
    {
      id: "2",
      type: "mpesa",
      phone: "+254712345678",
      provider: "M-Pesa",
      isDefault: false,
    },
  ]);

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: true,
    bookingReminders: true,
    promotions: false,
    newVendors: true,
  });

  const [activeSection, setActiveSection] = useState("profile");

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ")[1] || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleProfileChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Update user profile in database
      const response = await authAPI.updateProfile(
        user?._id as string,
        formData
      );

      // Axios responses put the payload on `data`
      if (!response?.data?.success) {
        throw new Error("Failed to update profile");
      }

      // const updatedUser = response.data;

      // Update user context
      // This would update user context with new data
      // You might need to implement this in your AuthContext

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = () => {
    toast.info("Opening address form");
  };

  const handleAddPayment = () => {
    toast.info("Opening payment method form");
  };

  const handleLogout = () => {
    toast.success("Logging out...");
    // Clear user token and redirect to login
    // This would be implemented in your AuthContext
  };

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key],
    });
    toast.success("Preference updated");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploadingImage(true);
    setAvatar(file);

    // Create a preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const saveProfileImage = async () => {
    if (!imagePreview) return;

    setIsLoading(true);
    try {
      const url = await uploadToCloudinary(avatar as File);

      if (!url) {
        throw new Error("Failed to upload image");
      }

      // Update user avatar in database
      await authAPI.updateProfile(user?._id as string, { avatar: url });

      setImagePreview(null);
      toast.success("Profile image updated!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelImageUpload = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const navigationItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "preferences", label: "Preferences", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col">
        {/* Header */}
        <header className=" border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                  <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    My Profile
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage your account and preferences
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-6">
          {/* Desktop Navigation - Hidden on Mobile */}
          <nav className="hidden lg:flex mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1">
            <div className="flex w-full">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      activeSection === item.id
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Content Sections */}
          <div className="space-y-6">
            {/* Profile Section */}
            {activeSection === "profile" && (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <User className="w-5 h-5 text-emerald-600" />
                      Personal Information
                    </CardTitle>
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        size="sm"
                        className="text-emerald-600 border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveProfile}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => setIsEditing(false)}
                          variant="outline"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Profile Picture Upload */}
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-2 border-emerald-600">
                        <AvatarImage
                          src={
                            imagePreview ||
                            (user?.avatar
                              ? getOptimizedImageUrl(user.avatar, {
                                  width: 200,
                                  height: 200,
                                  crop: "fill",
                                  quality: "auto:best",
                                  format: "auto",
                                  gravity: "face",
                                })
                              : "")
                          }
                          alt="Profile"
                        />
                        <AvatarFallback className="text-xl font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200">
                          {formData.firstName?.charAt(0)}
                          {formData.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      {isEditing && (
                        <div className="absolute -bottom-2 -right-2">
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-2 shadow-md"
                          >
                            <Camera className="w-4 h-4" />
                          </Button>
                        </div>
                      )}

                      {isEditing && (
                        <input
                          title="input"
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      )}
                    </div>

                    {isEditing && imagePreview && (
                      <div className="flex-1 w-full">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Image Preview
                            </p>
                            <div className="flex gap-2">
                              <Button
                                onClick={saveProfileImage}
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                onClick={cancelImageUpload}
                                variant="outline"
                                size="sm"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="relative w-full h-32 rounded-md overflow-hidden">
                            <img
                              src={imagePreview || ""}
                              alt="Profile preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleProfileChange("firstName", e.target.value)
                        }
                        disabled={!isEditing}
                        className={
                          !isEditing
                            ? "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                            : ""
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleProfileChange("lastName", e.target.value)
                        }
                        disabled={!isEditing}
                        className={
                          !isEditing
                            ? "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                            : ""
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleProfileChange("email", e.target.value)
                      }
                      disabled={!isEditing}
                      type="email"
                      className={
                        !isEditing
                          ? "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                          : ""
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleProfileChange("phone", e.target.value)
                      }
                      disabled={!isEditing}
                      className={
                        !isEditing
                          ? "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                          : ""
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Addresses Section */}
            {activeSection === "addresses" && (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                      Saved Addresses
                    </CardTitle>
                    <Button
                      onClick={handleAddAddress}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Address
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {addr.label}
                            </h4>
                            {addr.isDefault && (
                              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-0">
                                Default
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {addr.address}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {addr.city}, {addr.postalCode}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Payment Methods Section */}
            {activeSection === "payments" && (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                      Payment Methods
                    </CardTitle>
                    <Button
                      onClick={handleAddPayment}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Payment
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {method.type === "card"
                                ? `${method.cardholderName} •••• ${method.last4}`
                                : `${method.provider} (${method.phone})`}
                            </h4>
                            {method.isDefault && (
                              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-0">
                                Default
                              </Badge>
                            )}
                          </div>
                          {method.type === "card" && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Expires: {method.expiryDate}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Preferences Section */}
            {activeSection === "preferences" && (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Bell className="w-5 h-5 text-emerald-600" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-1">
                  {[
                    {
                      key: "emailNotifications",
                      label: "Email Notifications",
                      description: "Receive updates via email",
                    },
                    {
                      key: "smsNotifications",
                      label: "SMS Notifications",
                      description: "Receive updates via SMS",
                    },
                    {
                      key: "bookingReminders",
                      label: "Booking Reminders",
                      description: "Get reminders before your bookings",
                    },
                    {
                      key: "promotions",
                      label: "Promotional Offers",
                      description: "Receive special deals and discounts",
                    },
                    {
                      key: "newVendors",
                      label: "New Vendor Alerts",
                      description: "Be notified about new vendors joining",
                    },
                  ].map((pref) => (
                    <div
                      key={pref.key}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {pref.label}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {pref.description}
                        </p>
                      </div>
                      <button
                        title="btn"
                        onClick={() =>
                          togglePreference(pref.key as keyof typeof preferences)
                        }
                        className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
                          preferences[pref.key as keyof typeof preferences]
                            ? "bg-emerald-600"
                            : "bg-gray-300 dark:bg-gray-600"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                            preferences[pref.key as keyof typeof preferences]
                              ? "translate-x-6"
                              : "translate-x-1"
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Security Section */}
            {activeSection === "security" && (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    Security Settings
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Change Password
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Update your password to keep your account secure
                        </p>
                      </div>
                      <Button
                        onClick={() => setShowPassword(!showPassword)}
                        variant="outline"
                        size="sm"
                        className="text-emerald-600 border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    {showPassword && (
                      <div className="space-y-3 mt-4">
                        <div>
                          <Label
                            htmlFor="current-password"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Current password
                          </Label>
                          <Input
                            id="current-password"
                            type="password"
                            placeholder="Enter current password"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="new-password"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            New password
                          </Label>
                          <Input
                            id="new-password"
                            type="password"
                            placeholder="Enter new password"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="confirm-password"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Confirm new password
                          </Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="Confirm new password"
                            className="mt-1"
                          />
                        </div>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                          Update Password
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-900/10 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Two-Factor Authentication
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Add an extra layer of security to your account
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 text-amber-600 border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                        >
                          Enable 2FA
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Mobile Bottom Navigation - Hidden on Desktop */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-10">
          <div className="grid grid-cols-5 gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-1 transition-colors",
                    activeSection === item.id
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </ProtectedRoute>
  );
}
