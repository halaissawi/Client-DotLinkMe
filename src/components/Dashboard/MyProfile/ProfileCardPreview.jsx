import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Eye, User, Building } from "lucide-react";
import { CARD_TEMPLATES } from "../../../constants/cardTemplates";

/* ==================== UTILS ==================== */
export function generateProfileUrl(slug) {
  if (!slug) {
    return "https://linkme.io/your-smart-identity";
  }
  return `${window.location.origin}/u/${slug}`;
}

export function getTemplateStyles(template, profile) {
  // PRIORITY 1: Custom uploaded design
  if (profile?.customDesignUrl) {
    return {
      style: {
        backgroundImage: `url(${profile.customDesignUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      textColor: "text-white",
      overlay: "from-black/60 to-black/30",
    };
  }

  // PRIORITY 2: AI background
  if (profile?.designMode === "ai" && profile?.aiBackground) {
    return {
      style: {
        backgroundImage: `url(${profile.aiBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      textColor: "text-white",
      overlay: "from-black/40 to-black/20",
    };
  }

  // PRIORITY 3: NEW CARD TEMPLATES (THE ONLY TEMPLATES)
  if (profile?.designMode === "template" && template) {
    const templateData = CARD_TEMPLATES[template];

    if (templateData?.fullImage) {
      return {
        style: {
          backgroundImage: `url(${templateData.fullImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        },
        textColor: "text-white",
        overlay: "from-black/30 to-transparent",
      };
    }
  }

  // PRIORITY 4: Manual color fallback
  if (profile?.designMode === "manual" && profile?.color) {
    return {
      style: {
        backgroundColor: profile.color,
      },
      textColor: "text-white",
      overlay: "from-black/10 to-transparent",
    };
  }

  // FINAL fallback
  return {
    style: {
      background: "linear-gradient(to bottom right, #2563eb, #0f172a, #1e293b)",
    },
    textColor: "text-white",
    overlay: "from-black/10 to-transparent",
  };
}

/* ==================== COMPONENT ==================== */
export default function ProfileCardPreview({
  profile,
  onShare,
  onToggleQR,
  showQR,
}) {
  const isPersonal = profile.profileType === "personal";
  const template = profile.template;
  const templateStyles = getTemplateStyles(template, profile);
  const profileUrl = generateProfileUrl(profile.slug);

  return (
    <div className="space-y-3">
      {/* Card */}
      <div
        className="relative w-full h-48 rounded-[24px] shadow-2xl overflow-hidden"
        style={templateStyles.style}
      >
        {templateStyles.overlay && (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${templateStyles.overlay}`}
          />
        )}

        <div
          className={`relative z-10 h-full flex flex-col justify-between px-5 py-4 ${templateStyles.textColor}`}
        >
          {/* Header */}
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
                className={`w-12 h-12 flex items-center justify-center bg-white/20 border-2 border-white/40 text-white ${
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
              <p className="text-sm font-semibold opacity-90">.LinkMe</p>
              <p className="text-xs opacity-70">Smart NFC Digital Identity</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-lg font-bold">
              {profile.name || (isPersonal ? "Your Name" : "Company Name")}
            </h3>
            <p className="text-xs opacity-85">
              {profile.title ||
                (isPersonal ? "Your role or title" : "Your industry")}
            </p>
            <p className="text-[11px] opacity-75 line-clamp-2 mt-1">
              {profile.bio || "This is a preview of your smart identity card."}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2 text-[10px]">
              <span className="px-2 py-1 rounded-full bg-black/20">
                {isPersonal ? "Personal" : "Business"}
              </span>
              <span className="px-2 py-1 rounded-full bg-black/20 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {profile.viewCount || 0}
              </span>
            </div>

            <button
              onClick={() => onToggleQR(profile.id)}
              className="bg-white rounded-md p-1 shadow-lg hover:scale-110 transition-transform"
            >
              <QRCodeCanvas value={profileUrl} size={40} />
            </button>
          </div>
        </div>
      </div>

      {/* QR Popup */}
      {showQR === profile.id && (
        <div className="p-4 border-2 border-gray-200 rounded-xl bg-white">
          <div className="flex flex-col items-center gap-3">
            <QRCodeCanvas value={profileUrl} size={200} includeMargin />
            <p className="text-xs text-gray-600 break-all text-center">
              {profileUrl}
            </p>
            <button
              onClick={() => onShare(profile)}
              className="text-sm text-brand-primary font-medium hover:underline"
            >
              Copy Profile Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
