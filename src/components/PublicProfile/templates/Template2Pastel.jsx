import React from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  Share2,
  User,
  Building2,
  Sparkles,
  Heart,
  Star,
  Download,
  Link as LinkIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getPlatformIcon } from "../../../utils/platformIcons";

export default function Template2Pastel({
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
  themeColor = "#C9A5E8",
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
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${themeColor}15 0%, ${themeColor}25 50%, ${themeColor}35 100%)`,
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 opacity-20 pointer-events-none">
        <Sparkles className="w-16 h-16" style={{ color: themeColor }} />
      </div>
      <div className="absolute bottom-20 left-10 opacity-20 pointer-events-none">
        <Heart className="w-12 h-12" style={{ color: themeColor }} />
      </div>
      <div className="absolute top-1/3 left-20 opacity-10 pointer-events-none">
        <Star className="w-20 h-20" style={{ color: themeColor }} />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-[2.5rem] overflow-visible shadow-2xl">
          {/* Header */}
          <div className="relative pt-8 pb-6">
            {/* Share Button */}
            <button
              onClick={() => setShowShareModal(true)}
              className="absolute top-4 right-4 p-2 bg-white/60 backdrop-blur-sm rounded-full hover:bg-white/80 transition-colors shadow-lg z-20"
              style={{ color: themeColor }}
              aria-label="Share profile"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* Avatar Container */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                {/* Decorative circles - all fully visible now! */}
                <div
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full"
                  style={{ backgroundColor: themeColor, opacity: 0.4 }}
                />
                <div
                  className="absolute -bottom-2 -left-3 w-6 h-6 rounded-full"
                  style={{ backgroundColor: themeColor, opacity: 0.3 }}
                />
                <div
                  className="absolute top-1/2 -right-5 w-4 h-4 rounded-full"
                  style={{ backgroundColor: themeColor, opacity: 0.5 }}
                />

                {/* Avatar */}
                {profile.avatarUrl ? (
                  <div
                    className="w-28 h-28 rounded-full p-1 shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, white 0%, ${themeColor}30 100%)`,
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
                    className="w-28 h-28 rounded-full p-1 shadow-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, white 0%, ${themeColor}30 100%)`,
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
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
                )}
              </div>
            </div>

            {/* Name & Title */}
            <div className="text-center px-6">
              <h1
                className="text-2xl font-bold mb-1"
                style={{ color: themeColor }}
              >
                {profile.name}
              </h1>
              {profile.title && (
                <p className="text-gray-700 text-sm mb-1">{profile.title}</p>
              )}
              <p className="text-gray-500 text-xs">
                {profile.profileType === "personal"
                  ? "Personal Profile"
                  : profile.company || "Business Profile"}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            {/* Bio Card */}
            {profile.bio && (
              <div
                className="mb-5 p-4 rounded-2xl shadow-sm"
                style={{ backgroundColor: `${themeColor}11` }}
              >
                <div className="flex items-start gap-2 mb-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${themeColor}33` }}
                  >
                    <User className="w-3 h-3" style={{ color: themeColor }} />
                  </div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: themeColor }}
                  >
                    My Story
                  </p>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pl-8">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Contact Cards */}
            <div className="space-y-2 mb-5">
              {phoneLink && (
                <button
                  onClick={() => handleCall(phoneLink.id, phoneLink.url)}
                  className="w-full p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-left bg-white"
                  aria-label="Call"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${themeColor}22` }}
                    >
                      <Phone
                        className="w-4 h-4"
                        style={{ color: themeColor }}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Mobile phone</p>
                      <p className="text-sm font-medium text-gray-900">
                        {phoneLink.url}
                      </p>
                    </div>
                  </div>
                </button>
              )}

              {emailLink && (
                <button
                  onClick={() => handleEmail(emailLink.id, emailLink.url)}
                  className="w-full p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-left bg-white"
                  aria-label="Send email"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${themeColor}22` }}
                    >
                      <Mail className="w-4 h-4" style={{ color: themeColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {emailLink.url}
                      </p>
                    </div>
                  </div>
                </button>
              )}

              {whatsappLink && (
                <button
                  onClick={() =>
                    handleWhatsApp(whatsappLink.id, whatsappLink.url)
                  }
                  className="w-full p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-left bg-white"
                  aria-label="Message on WhatsApp"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${themeColor}22` }}
                    >
                      <MessageCircle
                        className="w-4 h-4"
                        style={{ color: themeColor }}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">WhatsApp</p>
                      <p className="text-sm font-medium text-gray-900">
                        Message me
                      </p>
                    </div>
                  </div>
                </button>
              )}
            </div>

            {/* ✅ FIXED: Social Links with COLORED icons */}
            {visibleSocialLinks.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-5">
                {visibleSocialLinks.map((link) => {
                  const IconComponent = getPlatformIcon(link.platform);

                  return (
                    <button
                      key={link.id}
                      onClick={() => handleSocialClick(link.id, link.url)}
                      className="w-11 h-11 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-110 bg-white"
                      aria-label={`Visit ${link.platform}`}
                    >
                      {React.isValidElement(IconComponent) ? (
                        React.cloneElement(IconComponent, {
                          className: "w-5 h-5",
                          style: { color: themeColor },
                        })
                      ) : IconComponent ? (
                        <IconComponent
                          className="w-5 h-5"
                          style={{ color: themeColor }}
                        />
                      ) : (
                        <LinkIcon
                          className="w-5 h-5"
                          style={{ color: themeColor }}
                        />
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
                background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}CC 100%)`,
              }}
              aria-label="Save contact"
            >
              <Download className="w-5 h-5" />
              <span>Save Contact</span>
            </button>

            {/* Powered By */}
            <p className="text-xs text-gray-500 mt-5 text-center">
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
