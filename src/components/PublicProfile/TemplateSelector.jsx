import React, { useState } from "react";
import { Check } from "lucide-react";
import { TEMPLATE_CONFIG } from "./TemplateRenderer";
import TemplatePreviews from "./TemplatePreviews";

export default function TemplateSelector({
  selectedTemplate = "modern",
  selectedColor,
  onTemplateChange,
  onColorChange,
}) {
  const [activeTab, setActiveTab] = useState("template");

  // Predefined color palette
  const colorPalette = [
    { name: "Gold", hex: "#FFD700" },
    { name: "Purple", hex: "#C9A5E8" },
    { name: "Cyan", hex: "#0EA5E9" },
    { name: "Violet", hex: "#8B5CF6" },
    { name: "Black", hex: "#000000" },
    { name: "Teal", hex: "#06B6D4" },
    { name: "Red", hex: "#EF4444" },
    { name: "Green", hex: "#10B981" },
    { name: "Orange", hex: "#F97316" },
    { name: "Pink", hex: "#EC4899" },
    { name: "Indigo", hex: "#6366F1" },
    { name: "Emerald", hex: "#059669" },
  ];

  // Handle template selection - immediately update
  const handleTemplateSelect = (templateId) => {
    onTemplateChange(templateId);
  };

  // Handle color selection - immediately update
  const handleColorSelect = (color) => {
    onColorChange(color);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Customize Your Profile
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("template")}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === "template"
              ? "text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Choose Template
          {activeTab === "template" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("color")}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === "color"
              ? "text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Pick Color
          {activeTab === "color" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
      </div>

      {/* Template Selection */}
      {activeTab === "template" && (
        <div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {Object.values(TEMPLATE_CONFIG).map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                  selectedTemplate === template.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Preview thumbnail */}
                <div className="w-full h-32 rounded-lg mb-3 overflow-hidden border border-gray-200">
                  <TemplatePreviews
                    templateId={template.id}
                    color={selectedColor || template.defaultColor}
                  />
                </div>

                {/* Template Info */}
                <h3 className="font-semibold text-gray-900 mb-1">
                  {template.name}
                </h3>
                <p className="text-xs text-gray-600">{template.description}</p>

                {/* Selected Check */}
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Info Text */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">💡 Tip:</span> Changes are tracked automatically. Click 'Save Changes' at the top of the page to apply your template.
            </p>
          </div>
        </div>
      )}

      {/* Color Selection */}
      {activeTab === "color" && (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Choose a color that matches your brand or personality
          </p>

          {/* Color Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-6">
            {colorPalette.map((color) => (
              <button
                key={color.hex}
                onClick={() => handleColorSelect(color.hex)}
                className={`relative w-full aspect-square rounded-xl transition-all hover:scale-110 ${
                  selectedColor === color.hex
                    ? "ring-4 ring-offset-2 ring-blue-600"
                    : "hover:ring-2 hover:ring-offset-2 hover:ring-gray-300"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {selectedColor === color.hex && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check
                      className="w-5 h-5"
                      style={{
                        color: color.hex === "#000000" ? "#fff" : "#000",
                      }}
                    />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Custom Color Picker */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or pick a custom color:
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={selectedColor || "#0066FF"}
                onChange={(e) => handleColorSelect(e.target.value)}
                className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={selectedColor || "#0066FF"}
                  onChange={(e) =>
                    handleColorSelect(e.target.value.toUpperCase())
                  }
                  placeholder="#0066FF"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a hex color code
                </p>
              </div>
            </div>
          </div>

          {/* Info Text */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">💡 Tip:</span> Changes are tracked automatically. Click 'Save Changes' at the top of the page to apply your color.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}