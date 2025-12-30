import React from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  Share2,
  User,
  Building2,
  ExternalLink,
  Link as LinkIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getPlatformIcon } from "../../../utils/platformIcons";

export default function Template6Glass({
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
  themeColor = "#06B6D4",
}) {
  const isPersonal = profile.profileType === "personal";

  const visibleSocialLinks =
    profile.socialLinks?.filter(
      (link) =>
        link.isVisible &&
        link.platform !== "phone" &&
        link.platform !== "email" &&
        link.platform !== "whatsapp"
    ) || [];

  // Generate lighter shade for background
  const lightenColor = (color, percent = 30) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
    const B = Math.min(255, (num & 0x0000ff) + amt);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B)
      .toString(16)
      .slice(1)}`;
  };

  const lightBg = lightenColor(themeColor, 85);
  const mediumBg = lightenColor(themeColor, 70);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${lightBg} 0%, ${mediumBg} 100%)`,
      }}
    >
      {/* Floating blobs */}
      <div
        className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-30 blur-3xl"
        style={{ backgroundColor: themeColor }}
      />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: themeColor }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Glass Card */}
        <div className="relative">
          {/* Main glass container */}
          <div
            className="bg-white/40 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl"
            style={{
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            }}
          >
            {/* Share Button */}
            <button
              onClick={() => setShowShareModal(true)}
              className="absolute top-4 right-4 p-2.5 bg-white/30 backdrop-blur-md rounded-full hover:bg-white/50 transition-all shadow-lg"
              style={{ color: themeColor }}
              aria-label="Share profile"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* Avatar with glass effect */}
            <div className="flex justify-center mb-6">
              {profile.avatarUrl ? (
                <div className="relative">
                  <div
                    className="w-28 h-28 rounded-full p-1 backdrop-blur-xl shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${themeColor}33, ${themeColor}11)`,
                      border: `2px solid ${themeColor}44`,
                    }}
                  >
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  {/* Glow ring */}
                  <div
                    className="absolute inset-0 rounded-full blur-xl opacity-30 pointer-events-none"
                    style={{ backgroundColor: themeColor }}
                  />
                </div>
              ) : (
                <div className="relative">
                  <div
                    className="w-28 h-28 rounded-full p-1 backdrop-blur-xl shadow-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${themeColor}33, ${themeColor}11)`,
                      border: `2px solid ${themeColor}44`,
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center">
                      {isPersonal ? (
                        <User
                          className="w-14 h-14"
                          style={{ color: themeColor }}
                        />
                      ) : (
                        <Building2
                          className="w-14 h-14"
                          style={{ color: themeColor }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Name & Title */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {profile.name}
              </h1>
              {profile.title && (
                <p className="text-gray-700 text-sm mb-1">{profile.title}</p>
              )}
              <p className="text-gray-600 text-xs">
                {profile.profileType === "personal"
                  ? "Personal Profile"
                  : profile.company || "Business Profile"}
              </p>
            </div>

            {/* Bio glass card */}
            {profile.bio && (
              <div
                className="mb-5 p-4 rounded-2xl backdrop-blur-md"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <p className="text-sm text-gray-800 leading-relaxed text-center">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Glass Contact Cards */}
            <div className="space-y-3 mb-5">
              {phoneLink && (
                <button
                  onClick={() => handleCall(phoneLink.id, phoneLink.url)}
                  className="w-full p-4 rounded-2xl backdrop-blur-md transition-all hover:scale-[1.02] shadow-lg group"
                  style={{
                    background: "rgba(255, 255, 255, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                  }}
                  aria-label="Call"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${themeColor}33` }}
                      >
                        <Phone
                          className="w-5 h-5"
                          style={{ color: themeColor }}
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-gray-600 font-medium">
                          Mobile
                        </p>
                        <p className="text-sm text-gray-900 font-semibold">
                          {phoneLink.url}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
                  </div>
                </button>
              )}

              {emailLink && (
                <button
                  onClick={() => handleEmail(emailLink.id, emailLink.url)}
                  className="w-full p-4 rounded-2xl backdrop-blur-md transition-all hover:scale-[1.02] shadow-lg group"
                  style={{
                    background: "rgba(255, 255, 255, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                  }}
                  aria-label="Send email"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${themeColor}33` }}
                      >
                        <Mail
                          className="w-5 h-5"
                          style={{ color: themeColor }}
                        />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-xs text-gray-600 font-medium">
                          Email
                        </p>
                        <p className="text-sm text-gray-900 font-semibold truncate">
                          {emailLink.url}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors flex-shrink-0" />
                  </div>
                </button>
              )}

              {whatsappLink && (
                <button
                  onClick={() =>
                    handleWhatsApp(whatsappLink.id, whatsappLink.url)
                  }
                  className="w-full p-4 rounded-2xl backdrop-blur-md transition-all hover:scale-[1.02] shadow-lg group"
                  style={{
                    background: "rgba(255, 255, 255, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                  }}
                  aria-label="Message on WhatsApp"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${themeColor}33` }}
                      >
                        <MessageCircle
                          className="w-5 h-5"
                          style={{ color: themeColor }}
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-gray-600 font-medium">
                          WhatsApp
                        </p>
                        <p className="text-sm text-gray-900 font-semibold">
                          Send message
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
                  </div>
                </button>
              )}
            </div>

            {/* ✅ FIXED: Social Links with proper icon rendering */}
            {visibleSocialLinks.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-5">
                {visibleSocialLinks.map((link) => {
                  const IconComponent = getPlatformIcon(link.platform);

                  return (
                    <button
                      key={link.id}
                      onClick={() => handleSocialClick(link.id, link.url)}
                      className="w-12 h-12 rounded-2xl backdrop-blur-md flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                      style={{
                        background: "rgba(255, 255, 255, 0.4)",
                        border: "1px solid rgba(255, 255, 255, 0.5)",
                        color: themeColor,
                      }}
                      aria-label={`Visit ${link.platform}`}
                    >
                      {React.isValidElement(IconComponent) ? (
                        React.cloneElement(IconComponent, {
                          className: "w-5 h-5",
                        })
                      ) : IconComponent ? (
                        <IconComponent className="w-5 h-5" />
                      ) : (
                        <LinkIcon className="w-5 h-5" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Save Contact Button */}
            <button
              onClick={handleDownloadVCard}
              className="w-full py-4 rounded-2xl font-semibold text-white shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] backdrop-blur-md"
              style={{
                background: `linear-gradient(135deg, ${themeColor}DD 0%, ${themeColor}AA 100%)`,
                border: `1px solid ${themeColor}`,
              }}
              aria-label="Save contact"
            >
              + Add to Contacts
            </button>

            {/* Powered By */}
            <p className="text-xs text-gray-600 mt-6 text-center">
              Powered by{" "}
              <Link
                to="/"
                className="font-semibold hover:underline"
                style={{ color: themeColor }}
              >
                DotLinkMe
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
