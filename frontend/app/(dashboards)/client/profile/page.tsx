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
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/api';
import { uploadToCloudinary } from '@/lib/cloudinary';

export default function ClientProfile() {
  const { user } = useAuth();
  console.log(user); // Debug log to check if user data is available
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    try {
      // Update user profile in database
      const response = await authAPI.updateProfile(
        user?._id as string,
        formData
      );

      if (!response.success) {
        throw new Error('Failed to update profile');
      }

      // const updatedUser = await response.json();
      
      // Update user context
      // This would update user context with new data
      // You might need to implement this in your AuthContext
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile. Please try again.");
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
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploadingImage(true);

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

    try {
      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append('file', imagePreview);
      formData.append('upload_preset', 'profile');
      
      const response = await uploadToCloudinary(
        user?._id as string,
        formData
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      // Update user avatar in database
      await authAPI.updateProfile(
        user?._id as string,
        { avatar: response.data.secure_url }
      );
      
      setImagePreview(null);
      toast.success("Profile image updated!");
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  const cancelImageUpload = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Responsive navigation for mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="flex-1 min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-green-50/20 dark:from-gray-900 dark:via-emerald-900/10 dark:to-gray-800">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                <User className="w-8 h-8 text-emerald-600" />
                My Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your account and preferences
              </p>
            </div>

            {/* Mobile menu toggle */}
            <Button
              variant="outline"
              size="sm"
              className="sm:hidden border-emerald-600 text-emerald-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Settings className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="sm:hidden bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 mb-6">
              <div className="flex flex-col space-y-2">
                {[
                  "profile",
                  "addresses",
                  "payments",
                  "preferences",
                  "danger",
                ].map((section) => (
                  <Button
                    key={section}
                    variant={activeSection === section ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      activeSection === section
                        ? "bg-emerald-600 text-white"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                    onClick={() => {
                      setActiveSection(section);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden sm:flex mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-1">
            <div className="flex w-full">
              {[
                "profile",
                "addresses",
                "payments",
                "preferences",
                "danger",
              ].map((section) => (
                <Button
                  key={section}
                  variant={activeSection === section ? "default" : "ghost"}
                  className={`flex-1 ${
                    activeSection === section
                      ? "bg-emerald-600 text-white"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => setActiveSection(section)}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Profile Section */}
          {activeSection === "profile" && (
            <Card className="bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-900 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="flex items-center gap-2">
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
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
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
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-2 border-emerald-600">
                      <AvatarImage
                        src={avatar || imagePreview || ""}
                        alt="Profile"
                      />
                      <AvatarFallback className="text-xl font-bold">
                        {formData.firstName?.charAt(0)}
                        {formData.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    {isEditing && (
                      <div className="absolute -bottom-2 -right-2 flex gap-2">
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-2"
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                        {imagePreview && (
                          <Button
                            onClick={saveProfileImage}
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-2"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Save Photo
                          </Button>
                        )}
                      </div>
                    )}

                    {isEditing && (
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex flex-col gap-2">
                      {imagePreview && (
                        <Button
                          onClick={saveProfileImage}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-2"
                        >
                          {uploadingImage ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                          ) : (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Save Photo
                              </>
                          )}
                        </Button>
                      {imagePreview && (
                          <Button
                            onClick={cancelImageUpload}
                            variant="outline"
                            size="sm"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                      )}
                    </div>
                  )}

                  {isEditing && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Preview:
                      </p>
                      <div className="relative w-full h-48 rounded-lg overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  )}
                </div>

                {/* Profile Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      onChange={(e) => handleProfileChange("firstName", e.target.value)}
                      disabled={!isEditing}
                      className={
                        !isEditing
                          ? "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
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
                      onChange={(e) => handleProfileChange("lastName", e.target.value)}
                      disabled={!isEditing}
                      className={
                        !isEditing
                          ? "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
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
                      onChange={(e) => handleProfileChange("email", e.target.value)}
                      disabled={!isEditing}
                      type="email"
                      className={
                        !isEditing
                          ? "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                          : ""
                      }
                    />
                  </div>
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
                      onChange={(e) => handleProfileChange("phone", e.target.value)}
                      disabled={!isEditing}
                      className={
                        !isEditing
                          ? "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                          : ""
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Addresses Section */}
          {activeSection === "addresses" && (
            <Card className="bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-900 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-emerald-600" />
                    Saved Addresses
                  </CardTitle>
                  <Button
                    onClick={handleAddAddress}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    + Add Address
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 border-emerald-200 dark:border-emerald-900 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {addr.label}
                          </h4>
                          {addr.isDefault && (
                            <Badge className="bg-emerald-600 text-white">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {addr.address}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {addr.city}, {addr.postalCode}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Payment Methods Section */}
          {activeSection === "payments" && (
            <Card className="bg-white dark:bg-gray-800 border-teal-200 dark:border-teal-900 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-teal-600" />
                    Payment Methods
                  </CardTitle>
                  <Button
                    onClick={handleAddPayment}
                    size="sm"
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    + Add Payment
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="p-4 border-teal-200 dark:border-teal-900 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-colors"
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
                            <Badge className="bg-teal-600 text-white">Default</Badge>
                          )}
                        </div>
                        {method.type === "card" && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Expires: {method.expiryDate}
                          </p>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Preferences Section */}
          {activeSection === "preferences" && (
            <Card className="bg-white dark:bg-gray-800 border-green-200 dark:border-green-900 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-green-600" />
                    Notification Preferences
                  </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
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
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
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
                      onClick={() =>
                        togglePreference(pref.key as keyof typeof preferences)
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences[pref.key as keyof typeof preferences]
                          ? "bg-green-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences[pref.key as keyof typeof preferences]
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Danger Zone Section */}
          {activeSection === "danger" && (
            <Card className="bg-white dark:bg-gray-800 border-red-200 dark:border-red-900 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <Settings className="w-5 h-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="p-4 border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Change Password
                    </h4>
                    <Button
                      onClick={() => setShowPassword(!showPassword)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {showPassword && (
                    <div className="space-y-3 mt-3">
                      <Input
                        type="password"
                        placeholder="Current password"
                        className="w-full"
                      />
                      <Input
                        type="password"
                        placeholder="New password"
                        className="w-full"
                      />
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full"
                      />
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                        Update Password
                      </Button>
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}