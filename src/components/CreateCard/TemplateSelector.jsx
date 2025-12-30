import React, { useState } from "react";
import { Image, Check } from "lucide-react";

export default function TemplateSelector({
  templates,
  selectedTemplate,
  onTemplateChange,
}) {
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (templateId) => {
    setImageErrors((prev) => ({ ...prev, [templateId]: true }));
  };

  return (
    <div className="space-y-3 pt-4">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Image className="w-4 h-4 flex-shrink-0" />
          <span>Card Template</span>
        </label>
        <span className="text-xs text-gray-500">Choose your card style</span>
      </div>

      {/* MOBILE — Horizontal Scroll */}
      <div
        className="flex sm:hidden gap-3 overflow-x-auto pb-3 px-1 snap-x snap-mandatory template-scroll-container"
        role="radiogroup"
        aria-label="Card template selection"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(139, 92, 246, 0.3) transparent",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id;
          const hasError = imageErrors[template.id];

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => {
                console.log("📋 Template selected:", template.id);
                // Clear conflicting designs
                onTemplateChange(template.id);
              }}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${template.name} template`}
              className={`
                flex-shrink-0 w-32 rounded-xl border-2 overflow-hidden
                transition-all snap-center
                ${
                  isSelected
                    ? "border-brand-primary shadow-lg scale-105"
                    : "border-gray-200 hover:border-brand-primary/50 active:scale-95"
                }
              `}
            >
              {/* Template Preview Image */}
              <div className="relative w-full h-20 bg-gray-100">
                {!hasError && template.previewImage ? (
                  <img
                    src={template.previewImage}
                    alt={template.name}
                    onError={() => handleImageError(template.id)}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-gray-100 to-gray-200">
                    {template.icon}
                  </div>
                )}

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Template Name */}
              <div
                className={`px-2 py-2 text-center ${
                  isSelected ? "bg-brand-primary/10" : "bg-white"
                }`}
              >
                <span
                  className={`text-xs font-medium truncate block ${
                    isSelected ? "text-brand-primary" : "text-gray-700"
                  }`}
                >
                  {template.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* DESKTOP — Grid with Large Previews */}
      <div
        className="hidden sm:grid grid-cols-2 md:grid-cols-3 gap-4"
        role="radiogroup"
        aria-label="Card template selection"
      >
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id;
          const isHovered = hoveredTemplate === template.id;
          const hasError = imageErrors[template.id];

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => {
                console.log("📋 Template selected:", template.id);
                // Clear conflicting designs
                onTemplateChange(template.id);
              }}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${template.name} template - ${template.description}`}
              className={`
                relative group border-2 rounded-xl overflow-hidden text-left 
                transition-all duration-300
                ${
                  isSelected
                    ? "border-brand-primary shadow-xl scale-[1.02]"
                    : "border-gray-200 hover:border-brand-primary/50 hover:shadow-lg"
                }
                ${isHovered && !isSelected ? "scale-[1.01]" : ""}
              `}
            >
              {/* Selection Check Badge */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-brand-primary rounded-full flex items-center justify-center shadow-lg z-20">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Template Preview Image */}
              <div
                className="relative w-full bg-gray-100 overflow-hidden"
                style={{ aspectRatio: "1.586 / 1" }}
              >
                {!hasError && template.previewImage ? (
                  <img
                    src={template.previewImage}
                    alt={template.name}
                    onError={() => handleImageError(template.id)}
                    className={`
                      w-full h-full object-cover
                      transition-transform duration-300
                      ${isHovered ? "scale-110" : "scale-100"}
                    `}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-gray-100 to-gray-200">
                    {template.icon}
                  </div>
                )}

                {/* Hover Overlay */}
                {isHovered && !isSelected && (
                  <div className="absolute inset-0 bg-brand-primary/10 backdrop-blur-[1px] transition-opacity" />
                )}
              </div>

              {/* Template Info */}
              <div
                className={`p-3 transition-colors ${
                  isSelected
                    ? "bg-brand-primary/10"
                    : "bg-white group-hover:bg-gray-50"
                }`}
              >
                <p
                  className={`font-semibold text-sm mb-1 transition-colors ${
                    isSelected
                      ? "text-brand-primary"
                      : "text-brand-dark group-hover:text-brand-primary"
                  }`}
                >
                  {template.name}
                </p>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {template.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Scroll indicator for mobile */}
      <div className="sm:hidden flex justify-center gap-1.5 pt-2">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`h-1.5 rounded-full transition-all ${
              selectedTemplate === template.id
                ? "w-6 bg-brand-primary"
                : "w-1.5 bg-gray-300"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* WebKit scrollbar styles */}
      <style>{`
        div::-webkit-scrollbar {
          height: 6px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>
  );
}
