import React from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  Share2,
  User,
  Building2,
  Link as LinkIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getPlatformIcon } from "../../../utils/platformIcons";

export default function Template5Minimal({
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
  themeColor = "#000000",
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

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Simple Clean Card */}
        <div className="relative">
          {/* Share Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="absolute top-0 right-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
            style={{ color: themeColor }}
            aria-label="Share profile"
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* Avatar */}
          <div className="flex justify-center mb-6">
            {profile.avatarUrl ? (
              <div className="relative">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-32 h-32 rounded-full object-cover"
                  style={{
                    border: `3px solid ${themeColor}`,
                  }}
                />
                {/* Accent dot */}
                <div
                  className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white"
                  style={{ backgroundColor: themeColor }}
                />
              </div>
            ) : (
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center"
                style={{
                  border: `3px solid ${themeColor}`,
                  color: themeColor,
                }}
              >
                {isPersonal ? (
                  <User className="w-16 h-16" />
                ) : (
                  <Building2 className="w-16 h-16" />
                )}
              </div>
            )}
          </div>

          {/* Name & Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-gray-900 mb-2">
              {profile.name}
            </h1>
            {profile.title && (
              <p className="text-gray-600 text-base mb-1">{profile.title}</p>
            )}
            <div
              className="w-12 h-0.5 mx-auto mt-4"
              style={{ backgroundColor: themeColor }}
            />
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mb-8 px-4">
              <p className="text-gray-700 text-center leading-relaxed">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Contact Methods - Minimal Lines */}
          <div className="space-y-0 mb-8">
            {phoneLink && (
              <button
                onClick={() => handleCall(phoneLink.id, phoneLink.url)}
                className="w-full py-4 px-6 border-t border-gray-200 hover:bg-gray-50 transition-colors text-left group"
                aria-label="Call"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">
                        Phone
                      </p>
                      <p className="text-gray-900 font-light">
                        {phoneLink.url}
                      </p>
                    </div>
                  </div>
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: themeColor }}
                  />
                </div>
              </button>
            )}

            {emailLink && (
              <button
                onClick={() => handleEmail(emailLink.id, emailLink.url)}
                className="w-full py-4 px-6 border-t border-gray-200 hover:bg-gray-50 transition-colors text-left group"
                aria-label="Send email"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Mail className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">
                        Email
                      </p>
                      <p className="text-gray-900 font-light truncate">
                        {emailLink.url}
                      </p>
                    </div>
                  </div>
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 ml-2"
                    style={{ backgroundColor: themeColor }}
                  />
                </div>
              </button>
            )}

            {whatsappLink && (
              <button
                onClick={() =>
                  handleWhatsApp(whatsappLink.id, whatsappLink.url)
                }
                className="w-full py-4 px-6 border-t border-gray-200 hover:bg-gray-50 transition-colors text-left group"
                aria-label="Message on WhatsApp"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <MessageCircle className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">
                        WhatsApp
                      </p>
                      <p className="text-gray-900 font-light">Send message</p>
                    </div>
                  </div>
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: themeColor }}
                  />
                </div>
              </button>
            )}

            <div className="border-t border-gray-200" />
          </div>

          {/* ✅ FIXED: Social Links with proper icon rendering */}
          {visibleSocialLinks.length > 0 && (
            <div className="flex justify-center gap-6 mb-8">
              {visibleSocialLinks.map((link) => {
                const IconComponent = getPlatformIcon(link.platform);

                return (
                  <button
                    key={link.id}
                    onClick={() => handleSocialClick(link.id, link.url)}
                    className="text-gray-400 hover:text-gray-900 transition-colors"
                    aria-label={`Visit ${link.platform}`}
                  >
                    {React.isValidElement(IconComponent) ? (
                      React.cloneElement(IconComponent, {
                        className: "w-6 h-6",
                      })
                    ) : IconComponent ? (
                      <IconComponent className="w-6 h-6" />
                    ) : (
                      <LinkIcon className="w-6 h-6" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Save Contact Button */}
          <button
            onClick={handleDownloadVCard}
            className="w-full py-4 border font-light tracking-wide transition-all hover:bg-gray-900 hover:text-white"
            style={{
              borderColor: themeColor,
              color: themeColor,
            }}
            aria-label="Save contact"
          >
            ADD TO CONTACTS
          </button>

          {/* Powered By */}
          <p className="text-xs text-gray-400 mt-8 text-center">
            Powered by{" "}
            <Link
              to="/"
              className="font-normal hover:underline"
              style={{ color: themeColor }}
            >
              DotLinkMe
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
