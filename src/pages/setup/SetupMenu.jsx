import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  UtensilsCrossed,
  Plus,
  Trash2,
  Upload,
  Loader2,
  Check,
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";

export default function SetupMenu() {
  const { userProductId } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userProduct, setUserProduct] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [formData, setFormData] = useState({
    nickname: "",
    restaurantName: "",
    logo: null,
    logoPreview: null,
    design: "logo", // logo, white, black
    categories: [
      {
        id: 1,
        name: "Appetizers",
        items: [],
      },
    ],
  });

  useEffect(() => {
    fetchUserProduct();
  }, [userProductId]);

  const fetchUserProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/user-products/${userProductId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to load product");
      }

      setUserProduct(data.data);
      setFormData((prev) => ({
        ...prev,
        nickname: data.data.product?.name || "My Menu",
      }));
    } catch (error) {
      console.error("Error fetching user product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load product details",
        confirmButtonColor: "#0066ff",
      }).then(() => {
        navigate("/dashboard");
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Logo must be less than 5MB",
        confirmButtonColor: "#0066ff",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please upload an image file",
        confirmButtonColor: "#0066ff",
      });
      return;
    }

    setUploadingLogo(true);

    try {
      const token = localStorage.getItem("token");
      const uploadFormData = new FormData();
      uploadFormData.append("logo", file);

      const response = await fetch(`${API_URL}/api/upload/logo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Upload failed");
      }

      // Set both the URL and preview
      setFormData((prev) => ({
        ...prev,
        logo: data.data.url,
        logoPreview: data.data.url,
      }));

      Swal.fire({
        icon: "success",
        title: "Logo Uploaded!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Logo upload error:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: error.message,
        confirmButtonColor: "#0066ff",
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const addCategory = () => {
    setFormData((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          id: Date.now(),
          name: "",
          items: [],
        },
      ],
    }));
  };

  const removeCategory = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat.id !== categoryId),
    }));
  };

  const updateCategory = (categoryId, name) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId ? { ...cat, name } : cat,
      ),
    }));
  };

  const addItem = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: [
                ...cat.items,
                {
                  id: Date.now(),
                  name: "",
                  price: "",
                  description: "",
                },
              ],
            }
          : cat,
      ),
    }));
  };

  const removeItem = (categoryId, itemId) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.filter((item) => item.id !== itemId),
            }
          : cat,
      ),
    }));
  };

  const updateItem = (categoryId, itemId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item,
              ),
            }
          : cat,
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.nickname.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please enter a nickname",
        confirmButtonColor: "#0066ff",
      });
      return;
    }

    if (!formData.restaurantName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please enter your restaurant name",
        confirmButtonColor: "#0066ff",
      });
      return;
    }

    // Check if at least one category has items
    const hasItems = formData.categories.some((cat) => cat.items.length > 0);
    if (!hasItems) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please add at least one menu item",
        confirmButtonColor: "#0066ff",
      });
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/user-products/${userProductId}/setup`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nickname: formData.nickname,
            profileData: {
              restaurantName: formData.restaurantName,
              logo: formData.logo,
              design: formData.design,
              categories: formData.categories.filter(
                (cat) => cat.name && cat.items.length > 0,
              ),
            },
            setupComplete: true,
          }),
        },
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Setup failed");
      }

      Swal.fire({
        icon: "success",
        title: "Setup Complete!",
        html: `
          <p>Your digital menu is ready!</p>
          <p class="text-sm text-gray-600 mt-2">You can now order the physical menu stand or view it in your dashboard.</p>
        `,
        confirmButtonColor: "#0066ff",
      }).then(() => {
        navigate("/dashboard");
      });
    } catch (error) {
      console.error("Setup error:", error);
      Swal.fire({
        icon: "error",
        title: "Setup Failed",
        text: error.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#0066ff",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!userProduct) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
              <UtensilsCrossed className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Setup Your Digital Menu
              </h1>
              <p className="text-gray-600">
                Create your restaurant's digital menu card
              </p>
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Product</p>
                <p className="font-semibold text-gray-900">
                  {userProduct.product?.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">NFC Code</p>
                <p className="font-mono text-sm text-gray-900">
                  {userProduct.nfcCode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Basic Information
            </h2>

            <div className="space-y-6">
              {/* Nickname */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Menu Nickname
                </label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) =>
                    setFormData({ ...formData, nickname: e.target.value })
                  }
                  placeholder="e.g., Main Restaurant Menu"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>

              {/* Restaurant Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  value={formData.restaurantName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      restaurantName: e.target.value,
                    })
                  }
                  placeholder="Your Restaurant Name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Restaurant Logo
                </label>
                <div className="flex items-center gap-4">
                  {formData.logoPreview && (
                    <img
                      src={formData.logoPreview}
                      alt="Logo"
                      className="w-20 h-20 object-contain rounded-xl border-2 border-gray-200"
                    />
                  )}
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition-all">
                      {uploadingLogo ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                          <span className="text-gray-600">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600">
                            {formData.logo ? "Change Logo" : "Upload Logo"}
                          </span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={uploadingLogo}
                    />
                  </label>
                </div>
              </div>

              {/* Design Choice */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Menu Design
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {["logo", "white", "black"].map((design) => (
                    <button
                      key={design}
                      type="button"
                      onClick={() => setFormData({ ...formData, design })}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        formData.design === design
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className="w-full h-20 rounded-lg mb-2 flex items-center justify-center"
                        style={{
                          background:
                            design === "logo"
                              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                              : design === "white"
                                ? "#ffffff"
                                : "#1a1a1a",
                          border:
                            design === "white" ? "1px solid #e5e7eb" : "none",
                        }}
                      >
                        {design === "logo" && (
                          <ImageIcon className="w-8 h-8 text-white" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {design === "logo" ? "With Logo" : design}
                      </p>
                      {formData.design === design && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Categories */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Menu Items</h2>
              <button
                type="button"
                onClick={addCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>

            <div className="space-y-6">
              {formData.categories.map((category, catIndex) => (
                <div
                  key={category.id}
                  className="border-2 border-gray-200 rounded-xl p-6"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) =>
                        updateCategory(category.id, e.target.value)
                      }
                      placeholder="Category Name (e.g., Appetizers)"
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => addItem(category.id)}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    {formData.categories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCategory(category.id)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Category Items */}
                  <div className="space-y-3">
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 items-start bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              updateItem(
                                category.id,
                                item.id,
                                "name",
                                e.target.value,
                              )
                            }
                            placeholder="Item name"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all text-sm"
                          />
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              updateItem(
                                category.id,
                                item.id,
                                "description",
                                e.target.value,
                              )
                            }
                            placeholder="Description (optional)"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all text-sm"
                          />
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) =>
                            updateItem(
                              category.id,
                              item.id,
                              "price",
                              e.target.value,
                            )
                          }
                          placeholder="Price"
                          className="w-24 px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(category.id, item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {category.items.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No items yet. Click + to add items to this category.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Complete Setup
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
