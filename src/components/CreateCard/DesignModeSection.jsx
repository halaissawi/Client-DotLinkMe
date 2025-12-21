import React from "react";
import ColorPicker from "./ColorPicker";
import AIDesignPanel from "./AIDesignPanel";
import { Palette, Sparkles, Check } from "lucide-react";

export default function DesignModeSection({
  currentProfile,
  updateProfile,
  onModeChange,
}) {
  // Handle mode change with proper cleanup
  const handleModeChange = (newMode) => {
    console.log("🔄 Switching design mode to:", newMode);

    // Clear conflicting design data based on new mode
    const updates = {
      designMode: newMode,
    };

    if (newMode === "manual") {
      // Manual mode: Keep color, clear everything else
      updates.aiBackground = null;
      updates.aiPrompt = "";
      updates.customDesignUrl = null;
      updates.template = null;
      console.log("✅ Cleared: AI, custom upload, template");
    } else if (newMode === "ai") {
      // AI mode: Keep AI settings, clear everything else
      updates.customDesignUrl = null;
      updates.template = null;
      updates.color = currentProfile.color || "#2563eb"; // Keep color as fallback
      console.log("✅ Cleared: custom upload, template");
    }

    updateProfile(updates);
    if (onModeChange) onModeChange(newMode);
  };

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
          onClick={() => handleModeChange("manual")}
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
          <span className="text-sm font-semibold">Manual Color</span>
          {currentProfile.designMode === "manual" && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("ai")}
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
