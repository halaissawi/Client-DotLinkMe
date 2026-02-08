import React from "react";
import { Palette, Type } from "lucide-react";

export default function StepDesign({ formData, updateFormData }) {
  const themes = [
    { id: "modern", name: "Modern", preview: "Clean and minimal" },
    { id: "classic", name: "Classic", preview: "Traditional elegance" },
    { id: "vibrant", name: "Vibrant", preview: "Bold and colorful" },
    { id: "elegant", name: "Elegant", preview: "Sophisticated luxury" },
  ];

  const colors = [
    { id: "#f2a91d", name: "Golden" },
    { id: "#ef4444", name: "Red" },
    { id: "#3b82f6", name: "Blue" },
    { id: "#10b981", name: "Green" },
    { id: "#8b5cf6", name: "Purple" },
    { id: "#f59e0b", name: "Orange" },
  ];

  const fonts = [
    { id: "Inter", name: "Inter", preview: "Modern & Clean" },
    { id: "Playfair Display", name: "Playfair", preview: "Elegant Serif" },
    { id: "Montserrat", name: "Montserrat", preview: "Bold & Strong" },
    { id: "Lora", name: "Lora", preview: "Classic Serif" },
  ];

  const updateTheme = (key, value) => {
    updateFormData({
      theme: {
        ...(formData.theme || {}),
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Customize Design</h2>
        <p className="text-gray-600">Make your menu match your brand identity</p>
      </div>

      {/* Layout Style */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          <Palette className="w-5 h-5 inline mr-2" />
          Layout Style
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => updateTheme("layout", theme.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                formData.theme?.layout === theme.id
                  ? "border-[#f2a91d] bg-[#f2a91d]/10 shadow-lg"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className="font-bold text-gray-900">{theme.name}</p>
              <p className="text-xs text-gray-500 mt-1">{theme.preview}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Primary Color */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Primary Color
        </label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {colors.map((color) => (
            <button
              key={color.id}
              type="button"
              onClick={() => updateTheme("primaryColor", color.id)}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                formData.theme?.primaryColor === color.id
                  ? "border-gray-900 shadow-lg scale-110"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div
                className="w-full h-12 rounded-lg"
                style={{ backgroundColor: color.id }}
              />
              <p className="text-xs font-medium text-gray-700 mt-2 text-center">
                {color.name}
              </p>
              {formData.theme?.primaryColor === color.id && (
                <div className="absolute -top-2 -right-2 bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Font Family */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          <Type className="w-5 h-5 inline mr-2" />
          Font Style
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fonts.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => updateTheme("fontFamily", font.id)}
              className={`p-5 rounded-xl border-2 transition-all text-left ${
                formData.theme?.fontFamily === font.id
                  ? "border-[#f2a91d] bg-[#f2a91d]/10 shadow-lg"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              style={{ fontFamily: font.id }}
            >
              <p className="font-bold text-xl text-gray-900">{font.name}</p>
              <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Inter' }}>
                {font.preview}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Social Media */}
      <div className="pt-6 border-t">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Social Media Links (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Facebook
            </label>
            <input
              type="text"
              value={formData.social?.facebook || ""}
              onChange={(e) => updateFormData({
                social: { ...(formData.social || {}), facebook: e.target.value }
              })}
              placeholder="facebook.com/yourpage"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#f2a91d] focus:ring-4 focus:ring-[#f2a91d]/10 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Instagram
            </label>
            <input
              type="text"
              value={formData.social?.instagram || ""}
              onChange={(e) => updateFormData({
                social: { ...(formData.social || {}), instagram: e.target.value }
              })}
              placeholder="@yourrestaurant"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#f2a91d] focus:ring-4 focus:ring-[#f2a91d]/10 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Twitter
            </label>
            <input
              type="text"
              value={formData.social?.twitter || ""}
              onChange={(e) => updateFormData({
                social: { ...(formData.social || {}), twitter: e.target.value }
              })}
              placeholder="@yourrestaurant"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#f2a91d] focus:ring-4 focus:ring-[#f2a91d]/10 transition-all outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}