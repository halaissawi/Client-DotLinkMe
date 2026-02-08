import React, { useState } from "react";
import { Upload, Loader2, X, Image as ImageIcon } from "lucide-react";
import Swal from "sweetalert2";

export default function StepBasics({ formData, updateFormData }) {
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const cuisineTypes = [
    "Italian", "Chinese", "Mexican", "Japanese", "Indian", 
    "American", "Mediterranean", "Thai", "French", "Korean",
    "Middle Eastern", "Vietnamese", "Greek", "Spanish", "Other"
  ];

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File too large",
        text: "Image must be less than 5MB",
        confirmButtonColor: "#f2a91d",
      });
      return;
    }

    const setLoading = type === "logo" ? setUploadingLogo : setUploadingCover;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const uploadFormData = new FormData();
      uploadFormData.append(type, file);

      const response = await fetch(`${API_URL}/api/upload/${type}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: uploadFormData,
      });

      const data = await response.json();
      if (data.success) {
        updateFormData({ [type]: data.data.url });
        Swal.fire({
          icon: "success",
          title: "Uploaded!",
          text: `${type === "logo" ? "Logo" : "Cover image"} uploaded successfully`,
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(`${type} upload error:`, error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: error.message || `Failed to upload ${type}`,
        confirmButtonColor: "#f2a91d",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Basics</h2>
        <p className="text-gray-600">Let's start with your restaurant's basic information</p>
      </div>

      {/* Restaurant Name & Tagline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Restaurant Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.restaurantName || ""}
            onChange={(e) => updateFormData({ restaurantName: e.target.value })}
            placeholder="e.g., The Golden Spoon"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#f2a91d] focus:ring-4 focus:ring-[#f2a91d]/10 transition-all outline-none"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tagline / Slogan
          </label>
          <input
            type="text"
            value={formData.tagline || ""}
            onChange={(e) => updateFormData({ tagline: e.target.value })}
            placeholder="e.g., Authentic Italian Cuisine"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#f2a91d] focus:ring-4 focus:ring-[#f2a91d]/10 transition-all outline-none"
          />
        </div>
      </div>

      {/* Cuisine Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Cuisine Type
        </label>
        <select
          value={formData.cuisineType || ""}
          onChange={(e) => updateFormData({ cuisineType: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#f2a91d] focus:ring-4 focus:ring-[#f2a91d]/10 transition-all outline-none"
        >
          <option value="">Select cuisine type</option>
          {cuisineTypes.map((cuisine) => (
            <option key={cuisine} value={cuisine}>{cuisine}</option>
          ))}
        </select>
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Restaurant Logo
        </label>
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0 relative group">
            {formData.logo ? (
              <>
                <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => updateFormData({ logo: null })}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <ImageIcon className="w-12 h-12 text-gray-300" />
            )}
          </div>
          
          <div className="flex-1">
            <label className="cursor-pointer block">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-[#f2a91d] hover:bg-[#f2a91d]/5 transition-all text-center">
                {uploadingLogo ? (
                  <Loader2 className="w-8 h-8 animate-spin text-[#f2a91d] mx-auto mb-2" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                )}
                <p className="text-sm font-medium text-gray-700">
                  {formData.logo ? "Change Logo" : "Upload Logo"}
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "logo")}
                className="hidden"
                disabled={uploadingLogo}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Cover Image Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Cover Image (Optional)
        </label>
        <div className="space-y-3">
          {formData.coverImage && (
            <div className="relative rounded-xl overflow-hidden group">
              <img 
                src={formData.coverImage} 
                alt="Cover" 
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={() => updateFormData({ coverImage: null })}
                className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          
          <label className="cursor-pointer block">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-[#f2a91d] hover:bg-[#f2a91d]/5 transition-all text-center">
              {uploadingCover ? (
                <Loader2 className="w-10 h-10 animate-spin text-[#f2a91d] mx-auto mb-3" />
              ) : (
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              )}
              <p className="text-sm font-medium text-gray-700">
                {formData.coverImage ? "Change Cover Image" : "Upload Cover Image"}
              </p>
              <p className="text-xs text-gray-500 mt-1">Recommended: 1200x400px, up to 5MB</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "coverImage")}
              className="hidden"
              disabled={uploadingCover}
            />
          </label>
        </div>
      </div>

      {/* Contact Information */}
      <div className="pt-6 border-t">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone || ""}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#f2a91d] focus:ring-4 focus:ring-[#f2a91d]/10 transition-all outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email || ""}
              onChange={(e) => updateFormData({ email: e.target.value })}
              placeholder="contact@restaurant.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#f2a91d] focus:ring-4 focus:ring-[#f2a91d]/10 transition-all outline-none"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={formData.address || ""}
              onChange={(e) => updateFormData({ address: e.target.value })}
              placeholder="123 Main Street, City, State 12345"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#f2a91d] focus:ring-4 focus:ring-[#f2a91d]/10 transition-all outline-none"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Website URL
            </label>
            <input
              type="url"
              value={formData.website || ""}
              onChange={(e) => updateFormData({ website: e.target.value })}
              placeholder="https://yourrestaurant.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#f2a91d] focus:ring-4 focus:ring-[#f2a91d]/10 transition-all outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}