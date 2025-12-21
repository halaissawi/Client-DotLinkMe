import React from "react";
import FormField from "./FormField";
import ImageUpload from "./ImageUpload";
import { User, Building, Briefcase, Factory, FileText } from "lucide-react";

export default function BasicInfoSection({
  profileType,
  currentProfile,
  updateProfile,
}) {
  const isPersonal = profileType === "personal";

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    updateProfile({ image: url, imageFile: file });
  };

  const handleAILogoGenerate = async (imageUrl) => {
    try {
      // Fetch the image from the URL
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create a File object from the blob
      const file = new File([blob], "ai-generated-logo.png", {
        type: blob.type || "image/png",
      });

      updateProfile({
        image: imageUrl,
        imageFile: file,
        aiGeneratedLogo: true,
      });
    } catch (error) {
      console.error("Error converting AI image to file:", error);
      alert("Failed to process AI-generated logo. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        icon={
          isPersonal ? (
            <User className="w-5 h-5" />
          ) : (
            <Building className="w-5 h-5" />
          )
        }
        label={isPersonal ? "Full Name" : "Company Name"}
        value={currentProfile.name}
        onChange={(value) => updateProfile({ name: value })}
        placeholder={isPersonal ? "Full Name" : ".LinkMe Solutions"}         
      />

      <FormField
        icon={
          isPersonal ? (
            <Briefcase className="w-5 h-5" />
          ) : (
            <Factory className="w-5 h-5" />
          )
        }
        label={isPersonal ? "Title / Role" : "Industry / Category"}
        value={currentProfile.title}
        onChange={(value) => updateProfile({ title: value })}
        placeholder={
          isPersonal
            ? "QA Engineer – NFC Systems"
            : "Smart NFC & Digital Identity"
        }
      />

      <FormField
        icon={<FileText className="w-5 h-5" />}
        label={isPersonal ? "Short Bio" : "Description"}
        value={currentProfile.bio}
        onChange={(value) => updateProfile({ bio: value })}
        placeholder={
          isPersonal
            ? "Passionate about building clean, smart, and user-friendly systems."
            : "We help you turn your physical card into a smart NFC-powered identity."
        }
        multiline
        rows={3}
      />

      <ImageUpload
        label={isPersonal ? "Profile Image" : "Company Logo"}
        onChange={handleImageUpload}
        currentImage={currentProfile.image}
        isBusinessProfile={!isPersonal}
        onAIGenerate={handleAILogoGenerate}
        helperText="Recommended: square image (1:1) for best preview."
      />
    </div>
  );
}
