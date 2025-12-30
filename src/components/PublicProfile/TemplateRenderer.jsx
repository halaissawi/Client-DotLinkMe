import React from "react";
import {
  Template1Luxury,
  Template2Pastel,
  Template3Modern,
  Template4Cosmic,
  Template5Minimal,
  Template6Glass,
} from "./templates";

// Template configuration
export const TEMPLATE_CONFIG = {
  luxury: {
    id: "luxury",
    name: "Luxury Dark",
    description: "Premium dark theme with gold accents",
    component: Template1Luxury,
    defaultColor: "#FFD700",
    preview: "dark-elegant",
  },
  pastel: {
    id: "pastel",
    name: "Pastel Creative",
    description: "Soft gradients with artistic elements",
    component: Template2Pastel,
    defaultColor: "#C9A5E8",
    preview: "light-creative",
  },
  modern: {
    id: "modern",
    name: "Modern Professional",
    description: "Clean gradients and button cards",
    component: Template3Modern,
    defaultColor: "#0EA5E9",
    preview: "professional",
  },
  cosmic: {
    id: "cosmic",
    name: "Cosmic Galaxy",
    description: "Orbital icons and hexagon navigation",
    component: Template4Cosmic,
    defaultColor: "#8B5CF6",
    preview: "creative-space",
  },
  minimal: {
    id: "minimal",
    name: "Minimal Clean",
    description: "Simple elegant black and white",
    component: Template5Minimal,
    defaultColor: "#000000",
    preview: "minimal",
  },
  glass: {
    id: "glass",
    name: "Glassmorphism",
    description: "Frosted glass with blur effects",
    component: Template6Glass,
    defaultColor: "#06B6D4",
    preview: "modern-glass",
  },
};

export default function TemplateRenderer({
  templateId = "modern",
  themeColor,
  profile,
  phoneLink,
  emailLink,
  whatsappLink,
  handleCall,
  handleEmail,
  handleWhatsApp,
  handleDownloadVCard,
  handleSocialClick,
  setShowShareModal,
}) {
  // Get the template configuration
  const templateConfig = TEMPLATE_CONFIG[templateId] || TEMPLATE_CONFIG.modern;
  const TemplateComponent = templateConfig.component;

  // Use provided theme color or template's default
  const finalColor = themeColor || templateConfig.defaultColor;

  return (
    <TemplateComponent
      profile={profile}
      phoneLink={phoneLink}
      emailLink={emailLink}
      whatsappLink={whatsappLink}
      handleCall={handleCall}
      handleEmail={handleEmail}
      handleWhatsApp={handleWhatsApp}
      handleDownloadVCard={handleDownloadVCard}
      handleSocialClick={handleSocialClick}
      setShowShareModal={setShowShareModal}
      themeColor={finalColor}
    />
  );
}
