// AI Generation utility
import { CARD_TEMPLATES } from "../constants/cardTemplates";

export const generateAIImage = async (prompt) => {
  const encodedPrompt = encodeURIComponent(prompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=450&nologo=true&enhance=true`;
  return imageUrl;
};

// Utility function to adjust color brightness
export function adjustColorBrightness(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

// Get template styles based on design mode
export function getTemplateStyles(selectedTemplate, currentProfile) {
  // 🆕 PRIORITY 1: Custom Design (customDesignUrl from database)
  if (currentProfile.customDesignUrl) {
    return {
      style: {
        backgroundImage: `url(${currentProfile.customDesignUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      className: "",
      textColor: "text-white",
      overlay: "from-black/60 to-black/30",
    };
  }

  // PRIORITY 2: AI Background
  if (currentProfile.designMode === "ai" && currentProfile.aiBackground) {
    return {
      style: {
        backgroundImage: `url(${currentProfile.aiBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      className: "",
      textColor: "text-white",
      overlay: "from-black/40 to-black/20",
    };
  }

  // PRIORITY 3: Template mode
  if (currentProfile.designMode === "template" && selectedTemplate) {
    const templateData = CARD_TEMPLATES[selectedTemplate];

    if (templateData?.fullImage) {
      return {
        style: {
          backgroundImage: `url(${templateData.fullImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        },
        className: "",
        textColor: "text-white",
        overlay: "from-black/30 to-transparent",
      };
    }
  }

  // PRIORITY 4: Manual color
  if (currentProfile.designMode === "manual" && currentProfile.color) {
    return {
      style: { backgroundColor: currentProfile.color },
      className: "",
      textColor: "text-white",
      overlay: "from-black/5 to-transparent",
    };
  }

  // ✅ FIXED FALLBACK: Use first template or LinkMe blue
  // If we have a template selected (from any previous mode), show it
  if (selectedTemplate && CARD_TEMPLATES[selectedTemplate]?.fullImage) {
    return {
      style: {
        backgroundImage: `url(${CARD_TEMPLATES[selectedTemplate].fullImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      className: "",
      textColor: "text-white",
      overlay: "from-black/30 to-transparent",
    };
  }

  // Final fallback: Simple LinkMe blue color (not gradient with old classes)
  return {
    style: { backgroundColor: "#0066ff" }, // LinkMe blue
    className: "",
    textColor: "text-white",
    overlay: "from-black/10 to-transparent",
  };
}
