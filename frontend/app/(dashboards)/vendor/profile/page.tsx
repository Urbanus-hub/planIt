"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Edit2,
  Check,
  X,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Star,
  Award,
  Zap,
  Clock,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  Briefcase,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { authAPI } from "@/lib/api";
import Link from "next/link";

type ProfileFormData = {
  businessName: string;
  businessDescription: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  website: string;
  serviceCategory: string;
  yearsOfExperience: string;
  businessLicense: string;
  specialties: string[];
  certifications: string[];
  businessHours: string;
  responseTime: string;
};

type ProfileImage = {
  avatar: string | null;
  coverImage: string | null;
};

export default function VendorProfilePage() {
  const { user } = useAuth();
  console.log("user data", user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverImageFileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImageType, setUploadingImageType] = useState<
    "avatar" | "cover" | null
  >(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [images, setImages] = useState<ProfileImage>({
    avatar:
      user?.businessLogo ||
      user?.avatar ||
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    coverImage:
      user?.profileBackground ||
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop",
  });

  const [formData, setFormData] = useState<ProfileFormData>({
    businessName: user?.businessName || "Your Business Name",
    businessDescription:
      user?.businessDescription || "Your business description",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.businessAddress || "",
    city: user?.city || "",
    state: user?.state || "",
    website: user?.website || "",
    serviceCategory: "Photography",
    yearsOfExperience: user?.yearsOfExperience
      ? String(user.yearsOfExperience)
      : "0",
    businessLicense: user?.taxId || "",
    specialties: [],
    certifications: [],
    businessHours: "Mon-Fri: 9AM-6PM, Sat: 10AM-4PM",
    responseTime: "< 2 hours",
  });

  const [stats] = useState({
    totalReviews: 124,
    averageRating: 4.8,
    completedJobs: 89,
    responseTime: "< 2 hours",
    repeatClients: 65,
    onTimeDelivery: 98,
  });

  const [portfolio] = useState([
    {
      id: 1,
      title: "Corporate Events",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop",
    },
    {
      id: 2,
      title: "Weddings",
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=200&fit=crop",
    },
    {
      id: 3,
      title: "Portraits",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=200&fit=crop",
    },
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setUploadingImageType("avatar");

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const saveProfileImage = async () => {
    if (!selectedFile || !imagePreview || !user?._id) return;

    setUploadingImage(true);
    try {
      const imageUrl = await uploadToCloudinary(selectedFile);
      await authAPI.updateProfile(user._id, { businessLogo: imageUrl });

      setImages((prev) => ({
        ...prev,
        avatar: imageUrl,
      }));

      toast.success("Profile image updated successfully!");
      cancelImageUpload();
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const cancelImageUpload = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setUploadingImageType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (coverImageFileInputRef.current) {
      coverImageFileInputRef.current.value = "";
    }
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setUploadingImageType("cover");

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const saveCoverImage = async () => {
    if (!selectedFile || !imagePreview || !user?._id) return;

    setUploadingImage(true);
    try {
      const imageUrl = await uploadToCloudinary(selectedFile);
      await authAPI.updateProfile(user._id, { profileBackground: imageUrl });

      setImages((prev) => ({
        ...prev,
        coverImage: imageUrl,
      }));

      toast.success("Cover image updated successfully!");
      cancelImageUpload();
    } catch (error) {
      toast.error("Failed to upload cover image");
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEditClick = () => {
    if (user) {
      setFormData({
        businessName: user.businessName || "Your Business Name",
        businessDescription:
          user.businessDescription || "Your business description",
        email: user.email || "",
        phone: user.phone || "",
        address: user.businessAddress || "",
        city: user.city || "",
        state: user.state || "",
        website: user.website || "",
        serviceCategory: user.serviceCategory || "Photography",
        yearsOfExperience: user.yearsOfExperience
          ? String(user.yearsOfExperience)
          : "0",
        businessLicense: user.taxId || "",
        specialties: user.specialties || [],
        certifications: user.certifications || [],
        businessHours: user.businessHours || "Mon-Fri: 9AM-6PM, Sat: 10AM-4PM",
        responseTime: user.responseTime || "< 2 hours",
      });

      setImages({
        avatar:
          user.businessLogo ||
          user.avatar ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        coverImage:
          user.profileBackground ||
          "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop",
      });
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!user?._id) throw new Error("User ID not found");

      const updateData = {
        businessName: formData.businessName,
        businessDescription: formData.businessDescription,
        email: formData.email,
        phone: formData.phone,
        businessAddress: formData.address,
        city: formData.city,
        state: formData.state,
        website: formData.website,
        serviceCategory: formData.serviceCategory,
        yearsOfExperience: formData.yearsOfExperience
          ? parseInt(formData.yearsOfExperience)
          : 0,
        businessLicense: formData.businessLicense,
        taxId: formData.businessLicense,
        specialties: formData.specialties,
        certifications: formData.certifications,
        businessHours: formData.businessHours,
        responseTime: formData.responseTime,
        profileBackground: images.coverImage,
      };

      await authAPI.updateProfile(user._id, updateData);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header with Cover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          {/* Cover Image */}
          <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden mb-20 group">
            <img
              src={images.coverImage!}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            {isEditing && (
              <>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  type="button"
                  onClick={() => coverImageFileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div className="flex flex-col items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <Camera className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      Change Cover
                    </span>
                  </div>
                </motion.button>
                <input
                  title="file input"
                  type="file"
                  ref={coverImageFileInputRef}
                  onChange={handleCoverImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </>
            )}
          </div>

          {/* Profile Card */}
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl -mt-16 relative z-10">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                {/* Avatar */}
                <div className="relative group shrink-0 mx-auto sm:mx-0">
                  <div className="h-32 w-32 rounded-xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg bg-gradient-to-br from-slate-100 to-slate-50 dark:from-gray-700 dark:to-gray-800">
                    <img
                      src={images.avatar!}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                    >
                      <Camera className="h-6 w-6 text-white" />
                    </motion.button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    title="Upload profile image"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {formData.businessName}
                      </h1>
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 px-3 py-1 text-sm">
                          {formData.serviceCategory}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            {stats.averageRating}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            ({stats.totalReviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                      {isEditing ? (
                        <>
                          <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            size="sm"
                            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Check className="h-4 w-4 mr-1.5" />
                            {isSaving ? "Saving..." : "Save"}
                          </Button>
                          <Button
                            onClick={() => setIsEditing(false)}
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <X className="h-4 w-4 mr-1.5" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/vendor/profile/gallery"
                            className="flex-1 sm:flex-none"
                          >
                            <Button
                              size="sm"
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              View Portfolio
                            </Button>
                          </Link>
                          <Button
                            onClick={handleEditClick}
                            size="sm"
                            className="flex-1 sm:flex-none bg-slate-700 hover:bg-slate-800 text-white"
                          >
                            <Edit2 className="h-4 w-4 mr-1.5" />
                            Edit Profile
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          {[
            {
              label: "Completed Jobs",
              value: stats.completedJobs,
              icon: Briefcase,
              color: "blue",
            },
            {
              label: "Reviews",
              value: stats.totalReviews,
              icon: MessageSquare,
              color: "green",
            },
            {
              label: "Rating",
              value: stats.averageRating.toFixed(1),
              icon: Star,
              color: "yellow",
            },
            {
              label: "Response Time",
              value: stats.responseTime,
              icon: Clock,
              color: "purple",
            },
            {
              label: "Repeat Clients",
              value: `${stats.repeatClients}%`,
              icon: Users,
              color: "red",
            },
            {
              label: "On-Time Delivery",
              value: `${stats.onTimeDelivery}%`,
              icon: CheckCircle,
              color: "indigo",
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
              green:
                "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
              yellow:
                "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
              purple:
                "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
              red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
              indigo:
                "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
            };

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`p-2 rounded-full mb-2 ${
                          colorClasses[stat.color as keyof typeof colorClasses]
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                        {stat.label}
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Business Info - Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-md border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
                <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                  <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  About Business
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                {/* Business Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Business Name
                  </label>
                  {isEditing ? (
                    <Input
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-gray-100">
                      {formData.businessName}
                    </p>
                  )}
                </div>

                {/* Category & Experience Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Service Category
                    </label>
                    {isEditing ? (
                      <Input
                        name="serviceCategory"
                        value={formData.serviceCategory}
                        onChange={handleInputChange}
                        className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-gray-100">
                        {formData.serviceCategory}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Experience (years)
                    </label>
                    {isEditing ? (
                      <Input
                        name="yearsOfExperience"
                        type="number"
                        value={formData.yearsOfExperience}
                        onChange={handleInputChange}
                        className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-gray-100">
                        {formData.yearsOfExperience}+ years
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Business Description
                  </label>
                  {isEditing ? (
                    <textarea
                      name="businessDescription"
                      value={formData.businessDescription}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {formData.businessDescription}
                    </p>
                  )}
                </div>

                {/* Specialties */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Specialties
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.specialties.map((specialty, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Preview */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-md border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
                <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                  <Camera className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Portfolio Preview
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Showcase your best work to attract more clients
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {portfolio.map((item) => (
                    <div
                      key={item.id}
                      className="relative group overflow-hidden rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <p className="text-white text-sm font-medium">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    View Full Portfolio
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-md border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
                <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                  <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Certifications & Licenses
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Business License */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Business License
                  </label>
                  {isEditing ? (
                    <Input
                      name="businessLicense"
                      value={formData.businessLicense}
                      onChange={handleInputChange}
                      className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <p className="text-gray-900 dark:text-gray-100 font-mono">
                        {formData.businessLicense}
                      </p>
                    </div>
                  )}
                </div>

                {/* Certifications */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Professional Certifications
                  </label>
                  <div className="space-y-2">
                    {formData.certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {cert}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-md border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
                <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                  <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase">
                    Email
                  </label>
                  {isEditing ? (
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <a
                      href={`mailto:${formData.email}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      {formData.email}
                    </a>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase">
                    Phone
                  </label>
                  {isEditing ? (
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <a
                      href={`tel:${formData.phone}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      {formData.phone}
                    </a>
                  )}
                </div>

                {/* Website */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase">
                    Website
                  </label>
                  {isEditing ? (
                    <Input
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <a
                      href={`https://${formData.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      {formData.website}
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-md border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
                <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isEditing ? (
                  <Input
                    name="businessHours"
                    value={formData.businessHours}
                    onChange={handleInputChange}
                    className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                ) : (
                  <div className="space-y-2">
                    {formData.businessHours.split(", ").map((hours, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {hours}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-md border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
                <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Street */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
                    Street
                  </label>
                  {isEditing ? (
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-gray-100">
                      {formData.address}
                    </p>
                  )}
                </div>

                {/* City & State */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
                      City
                    </label>
                    {isEditing ? (
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-gray-100">
                        {formData.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
                      State
                    </label>
                    {isEditing ? (
                      <Input
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-gray-100">
                        {formData.state}
                      </p>
                    )}
                  </div>
                </div>

                {!isEditing && (
                  <div className="pt-2">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {formData.address}, {formData.city}, {formData.state}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      Get Directions
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-0 shadow-md border border-transparent dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Average Response Time
                    </p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formData.responseTime}
                    </p>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                    <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={cancelImageUpload}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Preview Image
              </h2>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <div className="flex gap-3">
                <Button
                  onClick={
                    uploadingImageType === "cover"
                      ? saveCoverImage
                      : saveProfileImage
                  }
                  disabled={uploadingImage}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Confirm
                    </>
                  )}
                </Button>
                <Button
                  onClick={cancelImageUpload}
                  disabled={uploadingImage}
                  className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
