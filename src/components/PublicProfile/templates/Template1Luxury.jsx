import React, { useState } from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  Share2,
  ChevronDown,
  ChevronUp,
  User,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getPlatformIcon } from "../../../utils/platformIcons";

export default function Template1Luxury({
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
  themeColor = "#FFD700", // Gold default
}) {
  const [expandedSection, setExpandedSection] = useState(null);

  const isPersonal = profile.profileType === "personal";

  const visibleSocialLinks =
    profile.socialLinks?.filter(
      (link) =>
        link.isVisible &&
        link.platform !== "phone" &&
        link.platform !== "email" &&
        link.platform !== "whatsapp"
    ) || [];

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Main Card */}
        <div className="bg-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header with gradient */}
          <div
            className="relative h-32"
            style={{
              background: `linear-gradient(135deg, ${themeColor}22 0%, ${themeColor}44 100%)`,
            }}
          >
            {/* Share Button */}
            <button
              onClick={() => setShowShareModal(true)}
              className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
              style={{ color: themeColor }}
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* Avatar - Overlapping */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
              {profile.avatarUrl ? (
                <div
                  className="w-32 h-32 rounded-full p-1 shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}88 100%)`,
                  }}
                >
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className="w-32 h-32 rounded-full p-1 shadow-2xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}88 100%)`,
                  }}
                >
                  <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                    {isPersonal ? (
                      <User
                        className="w-16 h-16"
                        style={{ color: themeColor }}
                      />
                    ) : (
                      <Building2
                        className="w-16 h-16"
                        style={{ color: themeColor }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="pt-20 px-6 pb-6">
            {/* Name & Title */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">
                {profile.name}
              </h1>
              {profile.title && (
                <p className="text-gray-400 text-sm mb-1">{profile.title}</p>
              )}
              <p className="text-gray-500 text-xs">
                {profile.profileType === "personal"
                  ? "Personal Profile"
                  : profile.company || "Business Profile"}
              </p>
            </div>

            {/* Social Icons Row */}
            {visibleSocialLinks.length > 0 && (
              <div className="flex justify-center gap-3 mb-6">
                {visibleSocialLinks.slice(0, 6).map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleSocialClick(link.id, link.url)}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{
                      backgroundColor: `${themeColor}22`,
                      color: themeColor,
                    }}
                  >
                    {getPlatformIcon(link.platform)}
                  </button>
                ))}
              </div>
            )}

            {/* Expandable Sections */}
            <div className="space-y-3">
              {/* Projects & Work Section */}
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  border: `1px solid ${themeColor}33`,
                }}
              >
                <button
                  onClick={() => toggleSection("work")}
                  className="w-full px-4 py-3 flex items-center justify-between transition-colors"
                  style={{
                    backgroundColor:
                      expandedSection === "work"
                        ? `${themeColor}11`
                        : "transparent",
                  }}
                >
                  <span className="text-white font-medium">Bio & Info</span>
                  {expandedSection === "work" ? (
                    <ChevronUp
                      className="w-5 h-5"
                      style={{ color: themeColor }}
                    />
                  ) : (
                    <ChevronDown
                      className="w-5 h-5"
                      style={{ color: themeColor }}
                    />
                  )}
                </button>
                {expandedSection === "work" && profile.bio && (
                  <div className="px-4 py-3 bg-gray-900/50">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Connect Section */}
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  border: `1px solid ${themeColor}33`,
                }}
              >
                <button
                  onClick={() => toggleSection("connect")}
                  className="w-full px-4 py-3 flex items-center justify-between transition-colors"
                  style={{
                    backgroundColor:
                      expandedSection === "connect"
                        ? `${themeColor}11`
                        : "transparent",
                  }}
                >
                  <span className="text-white font-medium">Connect</span>
                  {expandedSection === "connect" ? (
                    <ChevronUp
                      className="w-5 h-5"
                      style={{ color: themeColor }}
                    />
                  ) : (
                    <ChevronDown
                      className="w-5 h-5"
                      style={{ color: themeColor }}
                    />
                  )}
                </button>
                {expandedSection === "connect" && (
                  <div className="px-4 py-3 bg-gray-900/50 space-y-2">
                    {phoneLink && (
                      <button
                        onClick={() => handleCall(phoneLink.id, phoneLink.url)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                      >
                        <Phone
                          className="w-4 h-4"
                          style={{ color: themeColor }}
                        />
                        <span className="text-gray-300 text-sm">
                          {phoneLink.url}
                        </span>
                      </button>
                    )}
                    {emailLink && (
                      <button
                        onClick={() => handleEmail(emailLink.id, emailLink.url)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                      >
                        <Mail
                          className="w-4 h-4"
                          style={{ color: themeColor }}
                        />
                        <span className="text-gray-300 text-sm truncate">
                          {emailLink.url}
                        </span>
                      </button>
                    )}
                    {whatsappLink && (
                      <button
                        onClick={() =>
                          handleWhatsApp(whatsappLink.id, whatsappLink.url)
                        }
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                      >
                        <MessageCircle
                          className="w-4 h-4"
                          style={{ color: themeColor }}
                        />
                        <span className="text-gray-300 text-sm">WhatsApp</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Save Contact Button */}
            <button
              onClick={handleDownloadVCard}
              className="w-full mt-6 py-3.5 rounded-xl font-semibold text-gray-900 transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}CC 100%)`,
              }}
            >
              + Add to Contacts
            </button>

            {/* Powered By */}
            <p className="text-xs text-gray-600 mt-6 text-center">
              Powered by{" "}
              <Link to="/" className="font-semibold">
                <span style={{ color: themeColor }}>Dot</span>LinkMe
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
