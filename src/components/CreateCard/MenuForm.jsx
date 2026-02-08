import React, { useState } from "react";
import {
  Utensils,
  Plus,
  Trash2,
  Upload,
  Loader2,
  Check,
  AlertCircle,
  Rocket,
  Image as ImageIcon,
} from "lucide-react";

export default function MenuForm({
  formData,
  updateFormData,
  onSubmit,
  loading,
}) {
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Logo must be less than 5MB");
      return;
    }

    setUploadingLogo(true);
    try {
      const token = localStorage.getItem("token");
      const uploadFormData = new FormData();
      uploadFormData.append("logo", file);

      const response = await fetch(`${API_URL}/api/upload/logo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: uploadFormData,
      });

      const data = await response.json();
      if (data.success) {
        updateFormData({ logo: data.data.url });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Logo upload error:", error);
      alert("Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const addCategory = () => {
    const newCategories = [
      ...formData.categories,
      { id: Date.now(), name: "", items: [] },
    ];
    updateFormData({ categories: newCategories });
  };

  const removeCategory = (categoryId) => {
    const newCategories = formData.categories.filter((cat) => cat.id !== categoryId);
    updateFormData({ categories: newCategories });
  };

  const updateCategory = (categoryId, name) => {
    const newCategories = formData.categories.map((cat) =>
      cat.id === categoryId ? { ...cat, name } : cat
    );
    updateFormData({ categories: newCategories });
  };

  const addItem = (categoryId) => {
    const newCategories = formData.categories.map((cat) =>
      cat.id === categoryId
        ? {
            ...cat,
            items: [
              ...cat.items,
              { id: Date.now(), name: "", price: "", description: "" },
            ],
          }
        : cat
    );
    updateFormData({ categories: newCategories });
  };

  const removeItem = (categoryId, itemId) => {
    const newCategories = formData.categories.map((cat) =>
      cat.id === categoryId
        ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
        : cat
    );
    updateFormData({ categories: newCategories });
  };

  const updateItem = (categoryId, itemId, field, value) => {
    const newCategories = formData.categories.map((cat) =>
      cat.id === categoryId
        ? {
            ...cat,
            items: cat.items.map((item) =>
              item.id === itemId ? { ...item, [field]: value } : item
            ),
          }
        : cat
    );
    updateFormData({ categories: newCategories });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card-glass p-4 sm:p-6 md:p-8 space-y-8 w-full max-w-4xl mx-auto"
      data-aos="fade-up"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-gray-100 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-brand-dark flex items-center gap-2">
          <Utensils className="w-6 h-6 text-[#f2a91d]" />
          <span>Restaurant Details</span>
        </h2>
      </div>

      {/* Basic Information */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Restaurant Name
            </label>
            <input
              type="text"
              value={formData.restaurantName}
              onChange={(e) => updateFormData({ restaurantName: e.target.value })}
              placeholder="e.g., The Golden Plate"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Menu Nickname (Internal)
            </label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => updateFormData({ nickname: e.target.value })}
              placeholder="e.g., Lunch Special"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
            />
          </div>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Restaurant Logo
          </label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0">
              {formData.logo ? (
                <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-300" />
              )}
            </div>
            <label className="flex-1 cursor-pointer">
              <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
                {uploadingLogo ? (
                  <Loader2 className="w-5 h-5 animate-spin text-brand-primary" />
                ) : (
                  <Upload className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-600">
                  {formData.logo ? "Change Logo" : "Upload Logo"}
                </span>
              </div>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploadingLogo} />
            </label>
          </div>
        </div>
      </div>

      {/* Menu Categories Section */}
      <div className="space-y-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span>Menu Items</span>
          </h3>
          <button
            type="button"
            onClick={addCategory}
            className="flex items-center gap-2 px-4 py-2 bg-[#f2a91d]/10 text-[#f2a91d] rounded-xl hover:bg-[#f2a91d]/20 transition-all font-semibold text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        <div className="space-y-8">
          {formData.categories.map((category) => (
            <div key={category.id} className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => updateCategory(category.id, e.target.value)}
                  placeholder="Category: e.g., Appetizers"
                  className="flex-1 px-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:border-[#f2a91d] focus:ring-2 focus:ring-[#f2a91d]/20 outline-none transition-all font-bold"
                />
                <button
                  type="button"
                  onClick={() => addItem(category.id)}
                  className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all"
                  title="Add Item"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeCategory(category.id)}
                  className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                  title="Remove Category"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Items in this category */}
              <div className="space-y-3">
                {category.items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative group">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(category.id, item.id, "name", e.target.value)}
                        placeholder="Dish name"
                        className="w-full px-3 py-2 bg-gray-50 rounded-lg border-transparent focus:bg-white focus:border-[#f2a91d] outline-none transition-all text-sm font-medium"
                      />
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(category.id, item.id, "description", e.target.value)}
                        placeholder="Description (optional)"
                        className="w-full px-3 py-2 bg-gray-50 rounded-lg border-transparent focus:bg-white focus:border-[#f2a91d] outline-none transition-all text-xs text-gray-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => updateItem(category.id, item.id, "price", e.target.value)}
                          placeholder="0.00"
                          className="w-24 pl-6 pr-3 py-2 bg-gray-50 rounded-lg border-transparent focus:bg-white focus:border-[#f2a91d] outline-none transition-all text-sm font-bold text-brand-primary"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(category.id, item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {category.items.length === 0 && (
                  <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl">
                    <p className="text-sm text-gray-400">Click + to add items to this category</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {formData.categories.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <Utensils className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No categories added yet</p>
              <button
                type="button"
                onClick={addCategory}
                className="mt-3 text-brand-primary hover:underline font-semibold"
              >
                Create your first category
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-8 border-t border-gray-100">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-brand-primary to-blue-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Building Your Menu...</span>
            </>
          ) : (
            <>
              <Rocket className="w-6 h-6" />
              <span className="text-lg">Generate Digital Menu</span>
            </>
          )}
        </button>
        <p className="text-center text-xs text-gray-500 mt-4">
          By generating this menu, it will be added to your account instantly.
        </p>
      </div>
    </form>
  );
}
