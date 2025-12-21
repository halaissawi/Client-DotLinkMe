import React from "react";
import {
  Eye,
  Activity,
  Download,
  ExternalLink,
  Copy,
  Check,
  X,
  User,
  Building,
  Sparkles,
  Link as LinkIcon,
  Palette,
  Zap,
  Loader2,
} from "lucide-react";
import { CARD_TEMPLATES } from "../../../constants/cardTemplates";

// ==================== UTILITY FUNCTIONS ====================
function generateProfileUrl(slug) {
  if (!slug) {
    return "https://linkme.io/your-smart-identity";
  }
  return `${window.location.origin}/u/${slug}`;
}

function adjustColorBrightness(color, percent) {
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

// ✅ UPDATED: Fixed template styles function with proper priority
function getTemplateStyles(profile) {
  // 🆕 PRIORITY 1: Custom Upload Design (HIGHEST PRIORITY)
  if (profile?.customDesignUrl) {
    console.log("🎨 [PREVIEW] Using custom uploaded design");
    return {
      style: {
        backgroundImage: `url(${profile.customDesignUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      className: "",
      textColor: "text-white",
      overlay: "from-black/60 to-black/30",
      mode: "custom",
    };
  }

  // PRIORITY 2: AI Generated Background
  if (profile?.designMode === "ai" && profile?.aiBackground) {
    console.log("🎨 [PREVIEW] Using AI generated background");
    return {
      style: {
        backgroundImage: `url(${profile.aiBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      className: "",
      textColor: "text-white",
      overlay: "from-black/40 to-black/20",
      mode: "ai",
    };
  }

  // PRIORITY 3: Template (template1, template2, etc.)
  if (profile?.designMode === "template" && profile?.template) {
    const template = CARD_TEMPLATES[profile.template];

    if (template?.fullImage) {
      console.log("🎨 [PREVIEW] Using template:", profile.template);
      return {
        style: {
          backgroundImage: `url(${template.fullImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        },
        className: "",
        textColor: "text-white",
        overlay: "from-black/30 to-transparent",
        mode: "template",
      };
    }
  }

  // PRIORITY 4: Manual Color (FALLBACK)
  if (profile?.color) {
    console.log("🎨 [PREVIEW] Using manual color:", profile.color);
    const color = profile.color;
    return {
      style: {
        background: `linear-gradient(135deg, ${color} 0%, ${adjustColorBrightness(
          color,
          -30
        )} 100%)`,
      },
      className: "",
      textColor: "text-white",
      overlay: "from-black/10 to-transparent",
      mode: "manual",
    };
  }

  // Default fallback
  console.log("🎨 [PREVIEW] Using default fallback");
  return {
    style: {},
    className:
      "bg-gradient-to-br from-brand-primary/90 via-[#0B0F19] to-[#16203A]",
    textColor: "text-white",
    overlay: "from-black/10 to-transparent",
    mode: "default",
  };
}

// ==================== LIVE CARD PREVIEW COMPONENT ====================
function LiveCardPreview({ profile }) {
  const [imageLoading, setImageLoading] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const isPersonal = profile.profileType === "personal";
  const templateStyles = getTemplateStyles(profile);
  const profileUrl = generateProfileUrl(profile.slug);

  // Check if we're using an image-based background
  const hasBackgroundImage =
    profile.customDesignUrl ||
    (profile.designMode === "ai" && profile.aiBackground) ||
    (profile.designMode === "template" &&
      profile.template &&
      CARD_TEMPLATES[profile.template]?.fullImage);

  const backgroundUrl =
    profile.customDesignUrl ||
    profile.aiBackground ||
    (profile.template && CARD_TEMPLATES[profile.template]?.fullImage);

  // Reset loading states when background URL changes
  React.useEffect(() => {
    if (hasBackgroundImage && backgroundUrl) {
      setImageLoading(true);
      setImageLoaded(false);
      setImageError(false);

      console.log("🔄 [EDIT PREVIEW] Loading background:", backgroundUrl);

      const img = new Image();

      img.onload = () => {
        console.log("✅ [EDIT PREVIEW] Background loaded successfully");
        setImageLoading(false);
        setImageLoaded(true);
        setImageError(false);
      };

      img.onerror = () => {
        console.error("❌ [EDIT PREVIEW] Failed to load background");
        setImageLoading(false);
        setImageLoaded(false);
        setImageError(true);
      };

      img.src = backgroundUrl;

      const timeout = setTimeout(() => {
        if (!imageLoaded) {
          console.warn("⏱️ [EDIT PREVIEW] Image loading timeout");
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

  // Get display mode for badge
  const getDisplayMode = () => {
    if (profile.customDesignUrl) return "Custom Upload";
    if (profile.designMode === "ai" && profile.aiBackground)
      return "AI Generated";
    if (profile.designMode === "template" && profile.template)
      return `Template: ${profile.template}`;
    return "Manual Color";
  };

  return (
    <div className="space-y-4">
      {/* Design Mode Badge */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
          <span className="text-xs font-medium text-gray-700">
            {getDisplayMode()}
          </span>

          {/* Custom Design Badge */}
          {profile.customDesignUrl && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Custom
            </span>
          )}

          {/* AI Badge */}
          {!profile.customDesignUrl &&
            profile.designMode === "ai" &&
            profile.aiBackground && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3" />
                AI
              </span>
            )}

          {/* Template Badge */}
          {!profile.customDesignUrl &&
            !profile.aiBackground &&
            profile.designMode === "template" &&
            profile.template && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-green-100 to-teal-100 text-green-700 font-semibold flex items-center gap-1">
                <Palette className="w-3 h-3" />
                Template
              </span>
            )}

          {/* Manual Badge */}
          {!profile.customDesignUrl &&
            !profile.aiBackground &&
            profile.designMode === "manual" && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center gap-1">
                <Palette className="w-3 h-3" />
                Manual
              </span>
            )}
        </div>
      </div>

      {/* Card Preview */}
      <div
        className={`relative w-full h-48 rounded-[24px] shadow-2xl overflow-hidden transition-all duration-300 ${templateStyles.className}`}
        style={{
          ...templateStyles.style,
          ...(templateStyles.borderColor && {
            borderColor: templateStyles.borderColor,
          }),
        }}
      >
        {/* Loading Overlay */}
        {imageLoading && hasBackgroundImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
              <p className="text-white text-xs font-medium">
                Loading Design...
              </p>
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
              <p className="text-white/70 text-[10px] mt-1">
                Using fallback design
              </p>
            </div>
          </div>
        )}

        {/* Background overlay */}
        {templateStyles.overlay && (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${templateStyles.overlay}`}
          />
        )}

        {/* Content */}
        <div
          className={`relative z-10 h-full flex flex-col justify-between px-5 py-4 ${templateStyles.textColor}`}
        >
          {/* Header with logo/avatar */}
          <div className="flex items-center gap-3">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="avatar"
                className={`w-12 h-12 ${
                  isPersonal ? "rounded-full" : "rounded-lg"
                } border-2 border-white/80 object-cover shadow-lg`}
              />
            ) : (
              <div
                className={`w-12 h-12 flex items-center justify-center text-xl bg-white/20 border-white/40 text-white border-2 ${
                  isPersonal ? "rounded-full" : "rounded-lg"
                } shadow-lg backdrop-blur-sm`}
              >
                {isPersonal ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Building className="w-5 h-5" />
                )}
              </div>
            )}

            <div>
              <p className="text-sm font-semibold opacity-90">Dot LinkMe</p>
              <p className="text-xs opacity-70">Smart NFC Digital Identity</p>
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-0.5">
            <h3 className="text-lg font-bold tracking-tight">
              {profile.name || (isPersonal ? "Your Name" : "Company Name")}
            </h3>
            <p className="text-xs opacity-85">
              {profile.title ||
                (isPersonal ? "Your role or title" : "Your industry")}
            </p>
            <p className="text-[11px] mt-1 line-clamp-2 opacity-75">
              {profile.bio || "This is a preview of your smart identity card."}
            </p>
          </div>

          {/* Footer with tags */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-[10px]">
              <span className="px-2 py-1 rounded-full bg-black/15 text-white opacity-80">
                {isPersonal ? "Personal" : "Business"}
              </span>
              <span className="px-2 py-1 rounded-full flex items-center gap-1 bg-black/15 text-white opacity-80">
                <Eye className="w-3 h-3" />
                {profile.viewCount || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN SIDEBAR COMPONENT ====================
export default function ProfileSidebar({
  profile,
  socialLinks,
  onCopyLink,
  onNavigate,
}) {
  const downloadQR = () => {
    const canvas = document.getElementById("qr-code");
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${profile.slug}-qr-code.png`;
    link.href = url;
    link.click();
  };

  return (
    <div className="relative">
      {/* Live Card Preview - STICKY POSITION */}
      <div className="mb-6">
        <div
          className="bg-white border-2 border-gray-200 rounded-2xl p-6 space-y-4"
          style={{
            boxShadow:
              "0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)",
          }}
        >
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-blue-600 flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-dark">
                Live Preview
              </h2>
              <p className="text-xs text-gray-600">Real-time card preview</p>
            </div>
          </div>
          <LiveCardPreview profile={profile} />
        </div>
      </div>

      {/* Regular Scrollable Content */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <div
          className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3"
          style={{
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          }}
        >
          <h3 className="font-bold text-brand-dark mb-4">Quick Actions</h3>
          <a
            href={`/u/${profile.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <ExternalLink className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">View Public Profile</p>
              <p className="text-xs text-gray-500">See how others see you</p>
            </div>
          </a>

          <button
            onClick={() => onCopyLink(profile.profileUrl)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all w-full text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <Copy className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Copy Profile Link</p>
              <p className="text-xs text-gray-500">Share with anyone</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate(`/dashboard/analytics`)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all w-full text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">View Analytics</p>
              <p className="text-xs text-gray-500">Track performance</p>
            </div>
          </button>
        </div>

        {/* Stats Card */}
        <div
          className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4"
          style={{
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-brand-dark">Statistics</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-brand-dark">
                    {profile.viewCount || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <LinkIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Social Links</p>
                  <p className="text-2xl font-bold text-brand-dark">
                    {socialLinks.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  {profile.isActive ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-lg font-bold">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        profile.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {profile.isActive ? "Active" : "Inactive"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
