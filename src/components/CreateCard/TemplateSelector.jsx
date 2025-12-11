import React, { useState } from "react";
import { Image, Check } from "lucide-react";

export default function TemplateSelector({
  templates,
  selectedTemplate,
  onTemplateChange,
}) {
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

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
        className="flex sm:hidden gap-2 overflow-x-auto pb-2 px-1 snap-x snap-mandatory"
        role="radiogroup"
        aria-label="Card template selection"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(139, 92, 246, 0.3) transparent",
        }}
      >
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onTemplateChange(template.id)}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${template.name} template`}
              className={`
                flex-shrink-0 w-20 h-20 rounded-xl border-2 p-2
                flex flex-col items-center justify-center gap-1 text-[10px]
                transition-all snap-start
                ${
                  isSelected
                    ? "border-brand-primary bg-brand-primary/10 shadow-md scale-105"
                    : "border-gray-200 bg-white hover:border-brand-primary/50 active:scale-95"
                }
              `}
            >
              <div
                className={`
                  w-8 h-8 rounded-md flex items-center justify-center text-xl
                  ${isSelected ? "bg-brand-primary/20" : "bg-gray-100"}
                `}
              >
                {template.icon}
              </div>

              {isSelected && (
                <div className="w-4 h-4 bg-brand-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}

              <span
                className={`font-medium truncate w-full text-center ${
                  isSelected ? "text-brand-primary" : "text-gray-600"
                }`}
              >
                {template.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* DESKTOP — Original Grid */}
      <div
        className="hidden sm:grid grid-cols-2 md:grid-cols-3 gap-3"
        role="radiogroup"
        aria-label="Card template selection"
      >
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id;
          const isHovered = hoveredTemplate === template.id;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onTemplateChange(template.id)}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${template.name} template - ${template.description}`}
              className={`
                relative group border-2 rounded-xl p-3 text-left transition-all duration-300
                ${
                  isSelected
                    ? "border-brand-primary bg-brand-primary/10 shadow-lg scale-[1.02]"
                    : "border-gray-200 hover:border-brand-primary/50 hover:shadow-md"
                }
                ${isHovered && !isSelected ? "scale-[1.01]" : ""}
              `}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center shadow-lg z-10">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`
                  w-full h-10 rounded-lg mb-2 flex items-center justify-center text-2xl font-medium
                  transition-colors
                  ${
                    isSelected
                      ? "bg-brand-primary/20"
                      : "bg-gray-100 group-hover:bg-brand-primary/10"
                  }
                `}
              >
                {template.icon}
              </div>

              <div className="space-y-1">
                <p
                  className={`font-semibold text-sm transition-colors ${
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

              {!isSelected && isHovered && (
                <div className="absolute inset-0 rounded-xl border-2 border-brand-primary/30 pointer-events-none transition-opacity"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Scroll indicator for mobile */}
      <div className="sm:hidden flex justify-center gap-1 pt-1">
        {templates.map((template, index) => (
          <div
            key={template.id}
            className={`h-1 rounded-full transition-all ${
              selectedTemplate === template.id
                ? "w-4 bg-brand-primary"
                : "w-1.5 bg-gray-300"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
