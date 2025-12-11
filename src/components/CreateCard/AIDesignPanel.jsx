import React, { useState } from "react";
import { generateAIImage } from "./Aiutils";
import {
  Sparkles,
  AlertTriangle,
  Palette,
  Star,
  Loader2,
  Info,
} from "lucide-react";

export default function AIDesignPanel({
  aiPrompt,
  onPromptChange,
  onGenerate,
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) {
      setError("Please enter a description for your card design");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log("Starting AI generation with prompt:", aiPrompt);
      const imageUrl = await generateAIImage(aiPrompt);
      console.log("Successfully generated image:", imageUrl);

      // Pass the generated URL to parent
      onGenerate(imageUrl);
    } catch (err) {
      console.error("Generation error:", err);
      setError(
        err.message ||
          "Failed to generate AI design. Please try again with a different description."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestedPrompts = [
    "Dark elegant theme with gold accents and luxury feel",
    "Modern minimalist with soft pastel gradients",
    "Professional corporate blue with geometric patterns",
    "Vibrant sunset colors with smooth waves",
    "Tech-inspired dark background with neon highlights",
  ];

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-gray-700 ml-1 flex items-center gap-1">
            <Palette className="w-4 h-4" />
            Describe your vision
          </label>
          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
            AI Powered
          </span>
        </div>

        <textarea
          value={aiPrompt}
          onChange={(e) => {
            onPromptChange(e.target.value);
            setError(null);
          }}
          placeholder="e.g. Dark elegant theme with gold accents and smooth gradients"
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-gray-50/50 resize-none transition-all placeholder:text-gray-400"
          disabled={isGenerating}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-3 animate-shake">
          <p className="text-xs text-red-600 flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
          </p>
        </div>
      )}

      {/* Info Message */}
      {isGenerating && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <p className="text-xs text-blue-600 flex items-center gap-2 font-medium">
            <Info className="w-4 h-4 shrink-0" /> This may take 10-30 seconds...
          </p>
        </div>
      )}

      {/* Main Action Button */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating || !aiPrompt.trim()}
        className={`
          w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 relative overflow-hidden
          ${
            isGenerating || !aiPrompt.trim()
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
          }
        `}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin h-4 w-4" />
            <span>Creating Magic...</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> Generate Design
          </span>
        )}
      </button>

      {/* Suggested Prompts */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-600 ml-1">
          Try these prompts:
        </p>
        <div className="grid grid-cols-1 gap-2">
          {suggestedPrompts.slice(0, 3).map((suggested, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                onPromptChange(suggested);
                setError(null);
              }}
              disabled={isGenerating}
              className={`text-xs px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all text-left ${
                isGenerating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {suggested}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
