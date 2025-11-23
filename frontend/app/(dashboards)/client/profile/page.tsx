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
import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export default function ClientProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Kipchoge",
    email: "john.kipchoge@email.com",
    phone: "+254 712 345 678",
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  });

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

  const handleProfileChange = (field: string, value: string) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const handleAddAddress = () => {
    toast.info("Opening address form");
  };

  const handleAddPayment = () => {
    toast.info("Opening payment method form");
  };

  const handleLogout = () => {
    toast.success("Logging out...");
  };

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key],
    });
    toast.success("Preference updated");
  };
  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="flex-1 min-h-screen bg-linear-to-br from-emerald-50 via-teal-50/30 to-green-50/20 dark:from-gray-900 dark:via-emerald-900/10 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                <User className="w-8 h-8 text-emerald-600" />
                My Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your account and preferences
              </p>
            </div>
          </div>

          {/* Profile Card */}
          <Card className="bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-900">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle>Personal Information</CardTitle>
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
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20 border-2 border-emerald-600">
                  <AvatarImage src={profileData.profileImage} />
                  <AvatarFallback>JK</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" className="text-blue-600">
                    Change Photo
                  </Button>
                )}
              </div>

              {/* Profile Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    First Name
                  </label>
                  <Input
                    value={profileData.firstName}
                    onChange={(e) =>
                      handleProfileChange("firstName", e.target.value)
                    }
                    disabled={!isEditing}
                    className={
                      isEditing
                        ? ""
                        : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Name
                  </label>
                  <Input
                    value={profileData.lastName}
                    onChange={(e) =>
                      handleProfileChange("lastName", e.target.value)
                    }
                    disabled={!isEditing}
                    className={
                      isEditing
                        ? ""
                        : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <Input
                  value={profileData.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                  disabled={!isEditing}
                  type="email"
                  className={
                    isEditing
                      ? ""
                      : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <Input
                  value={profileData.phone}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                  disabled={!isEditing}
                  className={
                    isEditing
                      ? ""
                      : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card className="bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-900">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
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
                  className="p-4 border border-emerald-200 dark:border-emerald-900 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors flex items-start justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {addr.label}
                      </h4>
                      {addr.isDefault && (
                        <Badge className="bg-emerald-600">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {addr.address}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {addr.city}, {addr.postalCode}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="bg-white dark:bg-gray-800 border-teal-200 dark:border-teal-900">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-teal-600" />
                  Payment Methods
                </CardTitle>
                <Button
                  title="button"
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
                  className="p-4 border border-teal-200 dark:border-teal-900 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-colors flex items-start justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {method.type === "card"
                          ? `${method.cardholderName} •••• ${method.last4}`
                          : `${method.provider} (${method.phone})`}
                      </h4>
                      {method.isDefault && (
                        <Badge className="bg-teal-600">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {method.type === "card"
                        ? `Expires: ${method.expiryDate}`
                        : ""}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="bg-white dark:bg-gray-800 border-green-200 dark:border-green-900">
            <CardHeader className="pb-3">
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
                  className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
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
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences[pref.key as keyof typeof preferences]
                        ? "bg-emerald-600"
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

          {/* Danger Zone */}
          <Card className="bg-white dark:bg-gray-800 border-red-200 dark:border-red-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-red-600 dark:text-red-400">
                Danger Zone
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Change Password
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button
                variant="outline"
                className="w-full text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
