import React from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  Share2,
  User,
  Building2,
  ArrowRight,
  Download,
  Link as LinkIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getPlatformIcon } from "../../../utils/platformIcons";

export default function Template3Modern({
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
  themeColor = "#0EA5E9",
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

  const gradient1 = themeColor;
  const gradient2 = `${themeColor}DD`;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(180deg, ${gradient2} 0%, ${gradient1} 100%)`,
      }}
    >
      <div className="w-full max-w-sm">
        {/* Main Card */}
        <div className="bg-white rounded-3xl overflow-visible shadow-2xl">
          {/* ✅ SUPER FIXED: Header with proper padding */}
          <div className="relative bg-white pt-6 pb-4 px-6 flex items-center justify-between">
            <div className="w-8"></div>
            <button
              onClick={() => setShowShareModal(true)}
              className="p-2 rounded-full transition-colors hover:bg-gray-100"
              style={{ color: themeColor }}
              aria-label="Share profile"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* ✅ FIXED: Avatar with proper spacing - NO CROPPING! */}
          <div className="flex justify-center mb-6 px-6">
            {profile.avatarUrl ? (
              <div
                className="w-24 h-24 rounded-full p-0.5 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${gradient1}, ${gradient2})`,
                }}
              >
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full rounded-full object-cover bg-white"
                />
              </div>
            ) : (
              <div
                className="w-24 h-24 rounded-full p-0.5 shadow-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${gradient1}, ${gradient2})`,
                }}
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  {isPersonal ? (
                    <User className="w-12 h-12" style={{ color: themeColor }} />
                  ) : (
                    <Building2
                      className="w-12 h-12"
                      style={{ color: themeColor }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            {/* Name & Title */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {profile.name}
              </h1>
              {profile.title && (
                <p className="text-gray-600 text-sm">{profile.title}</p>
              )}
            </div>

            {/* Action Buttons with Gradients */}
            <div className="space-y-3 mb-6">
              {profile.bio && (
                <div
                  className="w-full p-4 rounded-2xl text-white shadow-lg relative overflow-hidden cursor-default"
                  style={{
                    background: `linear-gradient(135deg, ${gradient1} 0%, ${gradient2} 100%)`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-semibold">About Me</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {profile.bio}
                  </p>
                </div>
              )}

              {phoneLink && (
                <button
                  onClick={() => handleCall(phoneLink.id, phoneLink.url)}
                  className="w-full p-4 rounded-2xl text-white shadow-lg relative overflow-hidden group transition-transform hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${gradient1} 0%, ${gradient2} 100%)`,
                  }}
                  aria-label="Call"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Call</p>
                        <p className="text-sm text-white/80">{phoneLink.url}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              )}

              {emailLink && (
                <button
                  onClick={() => handleEmail(emailLink.id, emailLink.url)}
                  className="w-full p-4 rounded-2xl text-white shadow-lg relative overflow-hidden group transition-transform hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${gradient1} 0%, ${gradient2} 100%)`,
                  }}
                  aria-label="Send email"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-semibold">Email</p>
                        <p className="text-sm text-white/80 truncate">
                          {emailLink.url}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </div>
                </button>
              )}

              {whatsappLink && (
                <button
                  onClick={() =>
                    handleWhatsApp(whatsappLink.id, whatsappLink.url)
                  }
                  className="w-full p-4 rounded-2xl text-white shadow-lg relative overflow-hidden group transition-transform hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${gradient1} 0%, ${gradient2} 100%)`,
                  }}
                  aria-label="Message on WhatsApp"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">WhatsApp</p>
                        <p className="text-sm text-white/80">Send message</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              )}
            </div>

            {/* Social Links with colored icons */}
            {visibleSocialLinks.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {visibleSocialLinks.map((link) => {
                  const IconComponent = getPlatformIcon(link.platform);

                  return (
                    <button
                      key={link.id}
                      onClick={() => handleSocialClick(link.id, link.url)}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${gradient1} 0%, ${gradient2} 100%)`,
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
              className="w-full py-3.5 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${gradient1} 0%, ${gradient2} 100%)`,
              }}
              aria-label="Save contact"
            >
              <Download className="w-5 h-5" />
              <span>Save Contact</span>
            </button>

            {/* Powered By */}
            <p className="text-xs text-gray-400 mt-6 text-center">
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
