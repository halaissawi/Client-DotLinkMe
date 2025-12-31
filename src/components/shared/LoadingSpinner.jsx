import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({
  size = "default", // "small" | "default" | "large"
  text = null,
  fullPage = false,
  className = "",
}) {
  // Size mappings
  const sizeClasses = {
    small: "w-8 h-8",
    default: "w-12 h-12",
    large: "w-16 h-16",
  };

  const textSizeClasses = {
    small: "text-sm",
    default: "text-base",
    large: "text-lg",
  };

  const spinner = (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <Loader2
        className={`${sizeClasses[size]} text-brand-primary animate-spin`}
      />
      {text && (
        <p className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
          {text}
        </p>
      )}
    </div>
  );

  // Full page loader (for pages like DashboardOverview, EditProfile, MyProfiles)
  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        {spinner}
      </div>
    );
  }

  // Inline loader (for small sections)
  return spinner;
}
