import React, { useEffect, useState } from "react";
import BasicInfoSection from "./BasicInfoSection";
import TemplateSelector from "./TemplateSelector";
import DesignModeSection from "./DesignModeSection";
import SocialLinksSection from "./SocialLinksSection";
import CardDesignUploader from "./CardDesignUploader";
import {
  User,
  Briefcase,
  Zap,
  Rocket,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function ProfileForm({
  profileType,
  currentProfile,
  updateProfile,
  socialLinks,
  onSocialLinksChange,
  selectedTemplate,
  onTemplateChange,
  templates,
  onSubmit,
  onSwitchProfile,
  loading,
}) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const wasDataRestored = localStorage.getItem(
          "createCardFormDataRestored"
        );

        if (wasDataRestored === "true") {
          localStorage.removeItem("createCardFormDataRestored");
          return;
        }

        const response = await fetch(`${API_URL}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();

        // Only update if fields are empty
        if (!currentProfile.name) {
          const fullName = [data.firstName, data.secondName, data.lastName]
            .filter(Boolean)
            .join(" ");

          updateProfile({
            name: fullName || "",
            firstName: data.firstName || "",
            secondName: data.secondName || "",
            lastName: data.lastName || "",
          });
        }

        if (data.email && !socialLinks.email) {
          onSocialLinksChange("email", data.email);
        }
        if (data.phoneNumber && !socialLinks.phone) {
          onSocialLinksChange("phone", data.phoneNumber);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_URL]);

  const handleCustomDesignUpload = async (file) => {
    setUploadError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to upload custom designs");
      }

      // Validate file before upload
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select a valid image file");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size must be less than 5MB");
      }

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(`${API_URL}/api/profiles/upload-temp`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Upload failed");
      }

      const data = await response.json();

      if (!data.url) {
        throw new Error("No URL returned from server");
      }

      updateProfile({
        customDesignUrl: data.url,
        customDesignFile: file,
      });
    } catch (error) {
      console.error("Error uploading custom design:", error);
      setUploadError(error.message);
      throw error;
    }
  };

  const handleCustomDesignRemove = () => {
    setUploadError(null);
    updateProfile({
      customDesignUrl: null,
      customDesignFile: null,
    });
  };

  const handleBackgroundUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      e.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    updateProfile({ customBackground: { file, preview: url } });
    e.target.value = ""; // Reset input
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build social links payload
    const payloadSocialLinks = Object.entries(socialLinks)
      .filter(
        ([key, value]) =>
          value && key !== "phone_code" && key !== "whatsapp_code"
      )
      .map(([key, value]) => {
        if (key === "phone") {
          const code = socialLinks["phone_code"] || "+962";
          return {
            platform: "phone",
            url: `${code} ${value}`,
          };
        }
        if (key === "whatsapp") {
          const code = socialLinks["whatsapp_code"] || "+962";
          return {
            platform: "whatsapp",
            url: `${code} ${value}`,
          };
        }
        return {
          platform: key,
          url: value,
        };
      });

    onSubmit({ ...currentProfile, socialLinks: payloadSocialLinks });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card-glass p-4 sm:p-6 md:p-8 space-y-6 lg:flex-[1.35] min-w-0"
      data-aos="fade-right"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-dark flex items-center gap-2">
          <span className="flex-shrink-0">
            {profileType === "personal" ? (
              <User className="w-5 h-5" />
            ) : (
              <Briefcase className="w-5 h-5" />
            )}
          </span>
          <span className="break-words">
            {profileType === "personal"
              ? "Personal Information"
              : "Business Information"}
          </span>
        </h2>
        <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-primary/10 to-purple-500/10 text-brand-primary border border-brand-primary/20 flex items-center gap-1 whitespace-nowrap">
          <Zap className="w-3 h-3 flex-shrink-0" /> Live preview →
        </span>
      </div>

      {/* Basic Info */}
      <BasicInfoSection
        profileType={profileType}
        currentProfile={currentProfile}
        updateProfile={updateProfile}
      />

      {/* Custom Card Design Uploader */}
      <div className="rounded-xl p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
        <CardDesignUploader
          currentDesignUrl={currentProfile.customDesignUrl}
          onUpload={handleCustomDesignUpload}
          onRemove={handleCustomDesignRemove}
        />
        {uploadError && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-800">{uploadError}</p>
          </div>
        )}
      </div>

      {/* Card Design Settings */}
      <div className="rounded-xl p-3 sm:p-4 bg-white shadow-sm space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">
          Card Design Settings
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          <div className="lg:col-span-7">
            <TemplateSelector
              templates={templates}
              selectedTemplate={selectedTemplate}
              onTemplateChange={onTemplateChange}
            />
          </div>

          <div className="lg:col-span-5 h-full">
            <DesignModeSection
              currentProfile={currentProfile}
              updateProfile={updateProfile}
            />
          </div>
        </div>

        {/* Background upload section */}
        <div className="pt-2 border-t border-gray-200/60">
          <input
            type="file"
            accept="image/*"
            id="custom-bg"
            className="hidden"
            onChange={handleBackgroundUpload}
            aria-label="Upload custom background"
          />
        </div>
      </div>

      {/* Social Links */}
      <SocialLinksSection
        socialLinks={socialLinks}
        onSocialLinksChange={onSocialLinksChange}
      />

      {/* Submit Buttons */}
      <div className="pt-4 space-y-3">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary-clean w-full py-3 sm:py-3.5 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all"
          aria-label={`Generate ${profileType} card`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin h-5 w-5 flex-shrink-0" />
              <span className="hidden sm:inline">Creating Your Card...</span>
              <span className="sm:hidden">Creating...</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 sm:gap-2 justify-center">
              <Rocket className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">
                Generate my{" "}
                {profileType === "personal" ? "Personal" : "Business"} Card
              </span>
              <span className="sm:hidden">
                Generate {profileType === "personal" ? "Personal" : "Business"}
              </span>
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
