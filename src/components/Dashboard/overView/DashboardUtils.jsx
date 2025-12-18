import { CARD_TEMPLATES } from "../../../constants/cardTemplates";

export function generateProfileUrl(name) {
  if (!name || !name.trim()) {
    return "https://linkme.io/your-smart-identity";
  }

  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return `https://linkme.io/${slug}`;
}

export function getTemplateStyles(template, profile) {
  // PRIORITY 1: Custom Design (HIGHEST PRIORITY)
  if (profile?.customDesignUrl) {
    return {
      style: {
        backgroundImage: `url(${profile.customDesignUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      className: "",
      textColor: "text-white",
      overlay: "from-black/60 to-black/30",
    };
  }

  // PRIORITY 2: AI Background
  if (profile?.designMode === "ai" && profile?.aiBackground) {
    return {
      style: {
        backgroundImage: `url(${profile.aiBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      className: "",
      textColor: "text-white",
      overlay: "from-black/40 to-black/20",
    };
  }

  // PRIORITY 3: Template mode
  if (profile?.designMode === "template" && template) {
    const templateData = CARD_TEMPLATES[template];

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

  // PRIORITY 4: Manual mode
  if (profile?.designMode === "manual" && profile?.color) {
    const color = profile.color;

    return {
      style: {
        background: `linear-gradient(135deg, ${color} 0%, ${color} 100%)`,
      },
      className: "",
      textColor: "text-white",
      overlay: "from-black/10 to-transparent",
    };
  }

  // Fallback
  return {
    style: {},
    className:
      "bg-gradient-to-br from-brand-primary/90 via-[#0B0F19] to-[#16203A]",
    textColor: "text-white",
    overlay: "from-black/10 to-transparent",
  };
}

// Helper function to adjust color brightness
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

export function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}
