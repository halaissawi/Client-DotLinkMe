import React, { useState } from "react";
import {
  X,
  Upload,
  FileText,
  Loader,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function CVUploadModal({ isOpen, onClose, onCVParsed }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    setError(null);

    if (!selectedFile) return;

    // Validate file type
    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError("File size must be less than 5MB");
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CV file");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("cv", file);

      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/ai/parse-cv`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ [CV Upload] Backend error:", data);

        // If backend sent helpful error info, use it
        if (data.reasons && Array.isArray(data.reasons)) {
          throw new Error(
            data.message +
              "\n\n" +
              data.reasons.map((r) => "• " + r).join("\n") +
              "\n\n" +
              (data.solution || ""),
          );
        }

        throw new Error(data.message || "Failed to parse CV");
      }

      console.log("✅ [CV Upload] CV parsed successfully:", data);

      // Pass parsed data to parent component
      if (onCVParsed && data.data?.profile) {
        onCVParsed(data.data.profile);
      }

      // Close modal
      onClose();
    } catch (err) {
      console.error("❌ [CV Upload] Error:", err);
      setError(err.message || "Failed to parse CV. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          disabled={uploading}
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Upload Your CV
              </h2>
              <p className="text-sm text-gray-500">
                AI will create your profile
              </p>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        {!file ? (
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 font-medium mb-2">
              Drag & drop your CV here
            </p>
            <p className="text-sm text-gray-500 mb-4">or</p>

            <label className="inline-block">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
              <span className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium cursor-pointer hover:shadow-lg transition-all inline-block">
                Choose File
              </span>
            </label>

            <p className="text-xs text-gray-400 mt-4">PDF only • Max 5MB</p>
          </div>
        ) : (
          <div className="border-2 border-green-200 bg-green-50 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              {!uploading && (
                <button
                  onClick={handleRemoveFile}
                  className="p-1 hover:bg-green-200 rounded-full transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4 text-green-700" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Info Box */}
        {!error && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">What happens next?</p>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>AI extracts your information</li>
                <li>Generates a professional profile</li>
                <li>Creates a custom design</li>
                <li>You can edit everything before saving</li>
              </ul>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Profile</span>
              </>
            )}
          </button>
        </div>

        {/* Processing indicator */}
        {uploading && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 animate-pulse">
              AI is analyzing your CV... This may take 10-20 seconds
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
