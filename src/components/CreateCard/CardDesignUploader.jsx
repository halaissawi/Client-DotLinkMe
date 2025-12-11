import React, { useState, useEffect } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function CardDesignUploader({
  currentDesignUrl,
  onUpload,
  onRemove,
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentDesignUrl || null);
  const [error, setError] = useState(null);

  // Update preview if currentDesignUrl changes externally
  useEffect(() => {
    if (currentDesignUrl && !preview) {
      setPreview(currentDesignUrl);
    }
  }, [currentDesignUrl]);

  const validateFile = (file) => {
    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return "Please select a valid image file (PNG or JPG)";
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return "Image size must be less than 5MB";
    }

    return null;
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    setError(null);

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      e.target.value = ""; // Reset file input
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.onerror = () => {
      setError("Failed to read file. Please try again.");
    };
    reader.readAsDataURL(file);

    // Call parent upload handler
    setUploading(true);
    try {
      await onUpload(file);
      setError(null);
    } catch (error) {
      console.error("Upload failed:", error);
      setError(error.message || "Failed to upload design. Please try again.");
      setPreview(currentDesignUrl || null);
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset file input
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onRemove();
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 flex-shrink-0" />
          <span>Custom Card Design (Optional)</span>
        </label>
        {preview && !uploading && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
            aria-label="Remove custom design"
          >
            <X className="w-3 h-3" /> Remove
          </button>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500">
        Upload your own card design. This will override templates and colors.
        Recommended size: 360×220px (PNG or JPG)
      </p>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-800">{error}</p>
        </div>
      )}

      {/* Upload Area */}
      <div className="relative">
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id="custom-design-upload"
          aria-label="Upload custom card design"
        />

        {preview ? (
          /* Preview */
          <div className="relative group">
            <img
              src={preview}
              alt="Custom card design preview"
              className="w-full h-40 object-cover rounded-xl border-2 border-gray-200"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
              <label
                htmlFor="custom-design-upload"
                className="px-4 py-2 bg-white text-brand-primary rounded-lg font-medium cursor-pointer hover:bg-gray-100 transition-colors text-sm"
              >
                Change Design
              </label>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
                  <p className="text-xs text-white">Uploading...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Upload Button */
          <label
            htmlFor="custom-design-upload"
            className={`
              block w-full p-4 border-2 border-dashed border-gray-300 rounded-xl
              hover:border-brand-primary hover:bg-blue-50/30 transition-all cursor-pointer
              ${
                uploading
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : ""
              }
            `}
          >
            <div className="flex items-center gap-3">
              {uploading ? (
                <>
                  <Loader2 className="w-8 h-8 text-brand-primary animate-spin flex-shrink-0" />
                  <p className="text-sm font-medium text-gray-700">
                    Uploading...
                  </p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                    <Upload className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-gray-700">
                      Upload custom design
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                </>
              )}
            </div>
          </label>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-900">
          <strong>💡 Tip:</strong> Your custom design will be printed on your
          physical NFC card. Make sure it's high quality and looks good!
        </p>
      </div>
    </div>
  );
}
