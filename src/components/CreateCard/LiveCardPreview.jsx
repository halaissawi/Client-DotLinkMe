import React, { useEffect, useState } from "react";
import {
  User,
  Building,
  Zap,
  Briefcase,
  Sparkles,
  Loader2,
} from "lucide-react";
import { CARD_TEMPLATES } from "../../constants/cardTemplates";

function generateProfileUrl(name) {
  if (!name || !name.trim()) return "https://linkme.io/your-smart-identity";
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return `https://linkme.io/${slug}`;
}

function adjustColorBrightness(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0xff) + amt;
  const B = (num & 0xff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (Math.min(255, Math.max(0, R)) << 16) +
      (Math.min(255, Math.max(0, G)) << 8) +
      Math.min(255, Math.max(0, B))
    )
      .toString(16)
      .slice(1)
  );
}
function getTemplateStyles(selectedTemplate, currentProfile) {
  // PRIORITY 1: Custom Design
  if (currentProfile.customDesignUrl) {
    return {
      style: {
        backgroundImage: `url(${currentProfile.customDesignUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
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
      textColor: "text-white",
      overlay: "from-black/40 to-black/20",
    };
  }

  // PRIORITY 3: Template
  if (currentProfile.designMode === "template" && selectedTemplate) {
    const template = CARD_TEMPLATES[selectedTemplate];

    if (template?.fullImage) {
      return {
        style: {
          backgroundImage: `url(${template.fullImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        },
        textColor: "text-white",
        overlay: "from-black/30 to-transparent",
      };
    }
  }

  // PRIORITY 4: Manual
  if (currentProfile.designMode === "manual") {
    const color = currentProfile.color || "#2563eb";
    return {
      style: {
        background: `linear-gradient(135deg, ${color} 0%, ${adjustColorBrightness(
          color,
          -30
        )} 100%)`,
      },
      textColor: "text-white",
      overlay: "from-black/10 to-transparent",
    };
  }

  return {
    style: {},
    className:
      "bg-gradient-to-br from-brand-primary/90 via-[#0B0F19] to-[#16203A]",
    textColor: "text-white",
    overlay: "from-black/10 to-transparent",
  };
}

/* ============================================================
   CardPreview - WITH LOADING INDICATOR
============================================================ */
function CardPreview({ profileType, currentProfile, selectedTemplate }) {
  const isPersonal = profileType === "personal";
  const templateStyles = getTemplateStyles(selectedTemplate, currentProfile);

  const [imageLoading, setImageLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Check if we're using an image-based background (AI, custom, or template)
  const hasBackgroundImage =
    (currentProfile.designMode === "ai" && currentProfile.aiBackground) ||
    currentProfile.customDesignUrl ||
    (currentProfile.designMode === "template" && selectedTemplate);

  const backgroundUrl =
    currentProfile.customDesignUrl ||
    currentProfile.aiBackground ||
    (currentProfile.designMode === "template" && selectedTemplate
      ? CARD_TEMPLATES[selectedTemplate]?.fullImage
      : null);

  // Reset loading states when background URL changes
  useEffect(() => {
    if (hasBackgroundImage && backgroundUrl) {
      setImageLoading(true);
      setImageLoaded(false);
      setImageError(false);

      const img = new Image();

      img.onload = () => {
        setImageLoading(false);
        setImageLoaded(true);
        setImageError(false);
      };

      img.onerror = () => {
        setImageLoading(false);
        setImageLoaded(false);
        setImageError(true);
      };

      img.src = backgroundUrl;

      const timeout = setTimeout(() => {
        if (!imageLoaded) {
          setImageLoading(false);
          setImageError(true);
        }
      }, 30000);

      return () => clearTimeout(timeout);
    } else {
      setImageLoading(false);
      setImageLoaded(false);
      setImageError(false);
    }
  }, [backgroundUrl, hasBackgroundImage, imageLoaded]);

  return (
    <div
      className={`
        relative w-full max-w-[360px] h-[200px] sm:h-[220px]
        rounded-[24px] shadow-2xl overflow-hidden transition-all
        ${templateStyles.className || ""}
      `}
      style={{
        ...templateStyles.style,
        ...(templateStyles.borderColor && {
          borderColor: templateStyles.borderColor,
        }),
        aspectRatio: "1.586 / 1",
      }}
    >
      {/* Loading Overlay */}
      {imageLoading && hasBackgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
            <p className="text-white text-xs font-medium">Loading Design...</p>
            <p className="text-white/70 text-[10px] mt-1">
              This may take a few moments
            </p>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {imageError && hasBackgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 to-orange-900/90 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="text-center px-4">
            <p className="text-white text-xs font-medium">
              Failed to load design
            </p>
            <p className="text-white/70 text-[10px] mt-1">Using fallback</p>
          </div>
        </div>
      )}

      {templateStyles.overlay && (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${templateStyles.overlay}`}
        />
      )}

      {/* CONTENT */}
      <div
        className={`relative z-10 h-full flex flex-col justify-between px-5 py-4 ${templateStyles.textColor}`}
      >
        <div className="flex items-center gap-3">
          {currentProfile.image ? (
            <img
              src={currentProfile.image}
              alt="Profile"
              className={`w-12 h-12 object-cover border-2 ${
                isPersonal ? "rounded-full" : "rounded-lg"
              } shadow-lg`}
            />
          ) : (
            <div
              className={`w-12 h-12 flex items-center justify-center border-2 ${
                isPersonal ? "rounded-full" : "rounded-lg"
              } bg-white/20 backdrop-blur-sm`}
            >
              {isPersonal ? <User /> : <Building />}
            </div>
          )}

          <div>
            <p className="text-sm font-semibold opacity-90">Dot LinkMe</p>
            <p className="text-xs opacity-70">Smart NFC Digital Identity</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold tracking-tight">
            {currentProfile.name || "Your Name"}
          </h3>
          <p className="text-xs opacity-80">
            {currentProfile.title || "Your role or title"}
          </p>
          <p className="text-[11px] opacity-75 line-clamp-2">
            {currentProfile.bio ||
              "This is a preview of your smart identity card."}
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span className="px-2 py-1 rounded-full bg-black/20 text-white">
            {isPersonal ? "Personal" : "Business"}
          </span>
          <span className="px-2 py-1 rounded-full bg-black/20 text-white">
            NFC • QR
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Main Component — with Mobile Preview Modal
============================================================ */
export default function LiveCardPreview({
  profileType,
  currentProfile,
  selectedTemplate,
}) {
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  return (
    <>
      {/* DESKTOP MODE - STICKY */}
      <div
        className="
          hidden lg:block
          w-full space-y-6 lg:sticky lg:top-28 lg:flex-[1] min-w-0
        "
        data-aos="fade-left"
      >
        <DesktopPreview
          profileType={profileType}
          currentProfile={currentProfile}
          selectedTemplate={selectedTemplate}
        />
      </div>

      {/* MOBILE PREVIEW BUTTON */}
      <button
        onClick={() => setShowMobilePreview(true)}
        className="
          lg:hidden fixed bottom-6 left-6 z-50
          group transition-all duration-300 hover:scale-110
        "
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[#0066ff]/20 rounded-full blur-xl animate-blob"></div>
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-[#0066ff] to-[#0052cc] rounded-full shadow-lg flex items-center justify-center">
            <span className="text-white text-[10px] sm:text-xs font-semibold">
              Preview
            </span>
          </div>
        </div>
      </button>

      {/* MOBILE PREVIEW MODAL */}
      {showMobilePreview && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:hidden"
          onClick={() => setShowMobilePreview(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <CardPreview
              profileType={profileType}
              currentProfile={currentProfile}
              selectedTemplate={selectedTemplate}
            />
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   Desktop Layout component
============================================================ */

function DesktopPreview({ profileType, currentProfile, selectedTemplate }) {
  const currentTemplate = CARD_TEMPLATES[selectedTemplate];
  const templateName = currentTemplate?.name || selectedTemplate;

  return (
    <>
      <div className="card-glass p-6 border-2 border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold text-brand-primary uppercase tracking-wide flex items-center gap-1">
              <Zap className="w-4 h-4" /> Live Preview
            </p>
            <p className="text-sm text-gray-500">Real-time card preview</p>
          </div>

          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-brand-primary/10 to-purple-500/10 text-[11px] font-medium border border-brand-primary/20">
            {profileType === "personal" ? (
              <User className="w-4 h-4" />
            ) : (
              <Briefcase className="w-4 h-4" />
            )}
          </span>
        </div>

        {/* Show current design mode */}
        <div className="mb-4 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 shadow-sm">
            <span className="text-xs font-medium text-gray-700">
              {currentProfile.customDesignUrl
                ? "Custom Design"
                : currentProfile.designMode === "ai"
                ? "AI Generated"
                : currentProfile.designMode === "template"
                ? `Template: ${templateName}`
                : "Manual Color"}
            </span>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <CardPreview
            profileType={profileType}
            currentProfile={currentProfile}
            selectedTemplate={selectedTemplate}
          />
        </div>
      </div>

      <div className="card-glass p-4 text-xs text-gray-600 border-2 border-gray-100">
        <ul className="space-y-1 pl-1">
          <li>• Changes update in real-time on the preview</li>
          <li>• Choose from ready templates for quick setup</li>
          <li>• Upload custom design for unique appearance</li>
          <li>• Use AI design for auto-generated backgrounds</li>
        </ul>
      </div>
    </>
  );
}
