import React, { useState } from "react";
import { generateAILogo } from "./Aiutils";
import {
  Palette,
  AlertTriangle,
  Sparkles,
  Lightbulb,
  Star,
  Loader2,
  Info,
} from "lucide-react";

export default function AILogoGenerator({ onGenerate, currentImage }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [logoPrompt, setLogoPrompt] = useState("");
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!logoPrompt.trim()) {
      setError("Please describe your desired logo");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log("Starting logo generation with prompt:", logoPrompt);
      const imageUrl = await generateAILogo(logoPrompt);
      console.log("Successfully generated logo:", imageUrl);

      onGenerate(imageUrl);
      setLogoPrompt(""); // Clear prompt after successful generation
    } catch (err) {
      console.error("Logo generation error:", err);
      setError(err.message || "Failed to generate logo. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestedPrompts = [
    "Tech company with circuit board elements",
    "Coffee shop with coffee bean and cup",
    "Fitness gym with dumbbell symbol",
    "Real estate with house or building icon",
    "Restaurant with fork and knife crossed",
    "Finance company with chart or coin symbol",
  ];

  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200/50 p-4 space-y-3 shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <Palette className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800 flex items-center gap-1">
            AI Logo Generator
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              FREE
            </span>
          </p>
          <p className="text-xs text-gray-600">
            Generate a professional logo with AI
          </p>
        </div>
      </div>

      {currentImage && (
        <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-blue-300 mx-auto">
          <img
            src={currentImage}
            alt="Current logo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              Current Logo
            </span>
          </div>
        </div>
      )}

      <textarea
        value={logoPrompt}
        onChange={(e) => {
          setLogoPrompt(e.target.value);
          setError(null);
        }}
        placeholder="e.g. Modern tech startup with geometric shapes and blue colors"
        rows={3}
        className="w-full border-2 border-blue-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 bg-white resize-none"
        disabled={isGenerating}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 animate-shake">
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" /> {error}
          </p>
        </div>
      )}

      {isGenerating && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-2">
          <p className="text-xs text-blue-600 flex items-center gap-1">
            <Info className="w-4 h-4" /> This may take 10-30 seconds...
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating || !logoPrompt.trim()}
        className={`
          w-full py-3 rounded-lg font-semibold text-sm transition-all
          ${
            isGenerating || !logoPrompt.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          }
          text-white
        `}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin h-5 w-5" />
            <span>Generating Logo...</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" /> Generate AI Logo
          </span>
        )}
      </button>

      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-700 flex items-center gap-1">
          <Lightbulb className="w-4 h-4" /> Try these prompts:
        </p>
        <div className="grid grid-cols-1 gap-2">
          {suggestedPrompts.slice(0, 3).map((prompt, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setLogoPrompt(prompt);
                setError(null);
              }}
              disabled={isGenerating}
              className={`text-xs px-3 py-2 rounded-lg bg-white border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left ${
                isGenerating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

     
    </div>
  );
}
