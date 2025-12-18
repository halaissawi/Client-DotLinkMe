import React from "react";
import ColorPicker from "./ColorPicker";
import AIDesignPanel from "./AIDesignPanel";
import { Palette, Sparkles, Check } from "lucide-react";

export default function DesignModeSection({
  currentProfile,
  updateProfile,
  onModeChange,
}) {
  return (
    <div className="space-y-4 pt-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Palette className="w-4 h-4" /> Design Mode
        </label>
        <span className="text-xs text-gray-500">Customize look</span>
      </div>

      {/* Mode Selection Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            updateProfile({ designMode: "manual" });
            if (onModeChange) onModeChange("manual");
          }}
          className={`
            relative p-3 rounded-xl border-2 transition-all duration-200
            flex flex-col items-center justify-center text-center gap-2
            ${
              currentProfile.designMode === "manual"
                ? "border-brand-primary bg-blue-50/50 shadow-sm"
                : "border-gray-200 hover:border-blue-200 bg-white"
            }
          `}
        >
          <Palette
            className={`w-5 h-5 ${
              currentProfile.designMode === "manual"
                ? "text-brand-primary"
                : "text-gray-400"
            }`}
          />
          <span className="text-sm font-semibold">Manual</span>
          {currentProfile.designMode === "manual" && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            updateProfile({ designMode: "ai" });
            if (onModeChange) onModeChange("ai");
          }}
          className={`
            relative p-3 rounded-xl border-2 transition-all duration-200
            flex flex-col items-center justify-center text-center gap-2
            ${
              currentProfile.designMode === "ai"
                ? "border-purple-500 bg-purple-50/50 shadow-sm"
                : "border-gray-200 hover:border-purple-200 bg-white"
            }
          `}
        >
          <Sparkles
            className={`w-5 h-5 ${
              currentProfile.designMode === "ai"
                ? "text-purple-600"
                : "text-gray-400"
            }`}
          />
          <span className="text-sm font-semibold">AI Design</span>
          {currentProfile.designMode === "ai" && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Dynamic Content Area */}
      <div className="space-y-3">
        {currentProfile.designMode === "manual" && (
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <ColorPicker
              color={currentProfile.color}
              onChange={(color) => updateProfile({ color })}
            />
          </div>
        )}

        {currentProfile.designMode === "ai" && (
          <AIDesignPanel
            aiPrompt={currentProfile.aiPrompt}
            onPromptChange={(aiPrompt) => updateProfile({ aiPrompt })}
            onGenerate={(aiBackground) => updateProfile({ aiBackground })}
          />
        )}
      </div>
    </div>
  );
}
