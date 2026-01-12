import React, { useState } from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  Share2,
  User,
  Building2,
  Menu,
  Download,
  Link as LinkIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getPlatformIcon } from "../../../utils/platformIcons";

export default function Template4Cosmic({
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
  themeColor = "#8B5CF6",
}) {
  const [activeSection, setActiveSection] = useState(null);
  const isPersonal = profile.profileType === "personal";

  const visibleSocialLinks =
    profile.socialLinks?.filter(
      (link) =>
        link.isVisible &&
        link.platform !== "phone" &&
        link.platform !== "email" &&
        link.platform !== "whatsapp"
    ) || [];

  // Orbital positions for social icons
  const getOrbitalPosition = (index, total) => {
    const angle = (360 / total) * index - 90;
    const radius = 90;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return { x, y };
  };

  // Create gradient colors
  const darkerColor = (color) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = -60;
    const R = Math.max(0, (num >> 16) + amt);
    const G = Math.max(0, ((num >> 8) & 0x00ff) + amt);
    const B = Math.max(0, (num & 0x0000ff) + amt);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B)
      .toString(16)
      .slice(1)}`;
  };

  const gradient1 = darkerColor(themeColor);
  const gradient2 = themeColor;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${gradient1} 0%, ${gradient2} 100%)`,
      }}
    >
      {/* Starfield effect */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Header */}
        <div className="flex justify-end items-center mb-8 px-4">
          <button
            onClick={() => setShowShareModal(true)}
            className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
            aria-label="Share profile"
          >
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Name & Title */}
        <div className="text-center mb-8 px-4">
          <h1 className="text-2xl font-bold text-white mb-1">{profile.name}</h1>
          {profile.title && (
            <p className="text-white/80 text-sm">{profile.title}</p>
          )}
        </div>

        {/* Orbital Avatar Section */}
        <div className="relative h-64 mb-8 flex items-center justify-center">
          {/* Orbital ring */}
          <div
            className="absolute w-48 h-48 rounded-full border-2 border-white/20"
            style={{
              boxShadow: `0 0 40px ${themeColor}33`,
            }}
          />

          {/* Avatar - Center - MOVED TO z-index 1 so icons can be on top */}
          <div className="relative z-[1]">
            {profile.avatarUrl ? (
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-md shadow-2xl">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-md shadow-2xl flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center">
                  {isPersonal ? (
                    <User className="w-16 h-16 text-white" />
                  ) : (
                    <Building2 className="w-16 h-16 text-white" />
                  )}
                </div>
              </div>
            )}

            {/* Glowing pulse */}
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-20 pointer-events-none"
              style={{ backgroundColor: themeColor }}
            />
          </div>

          {/* ✅ SUPER FIXED: Social Icons - z-index 20 to be above avatar */}
          {visibleSocialLinks.slice(0, 8).map((link, index) => {
            const pos = getOrbitalPosition(
              index,
              Math.min(visibleSocialLinks.length, 8)
            );
            const IconComponent = getPlatformIcon(link.platform);

            return (
              <button
                key={link.id}
                onClick={() => handleSocialClick(link.id, link.url)}
                className="absolute w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 shadow-lg z-[20]"
                style={{
                  left: `calc(50% + ${pos.x}px)`,
                  top: `calc(50% + ${pos.y}px)`,
                  transform: "translate(-50%, -50%)",
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

        {/* Hexagon Navigation Cards */}
        <div className="space-y-3 px-4">
          {/* About Hexagon */}
          {profile.bio && (
            <div
              className="relative group cursor-pointer"
              onClick={() =>
                setActiveSection(activeSection === "about" ? null : "about")
              }
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md rounded-2xl"
                style={{
                  clipPath:
                    "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
                }}
              />
              <div className="relative px-6 py-4 text-center">
                <p className="text-white font-semibold">About</p>
              </div>
              {activeSection === "about" && (
                <div className="mt-2 p-4 bg-white/10 backdrop-blur-md rounded-xl">
                  <p className="text-white/90 text-sm leading-relaxed">
                    {profile.bio}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Contact Hexagons */}
          <div className="grid grid-cols-2 gap-3">
            {phoneLink && (
              <button
                onClick={() => handleCall(phoneLink.id, phoneLink.url)}
                className="relative group"
                aria-label="Call"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-2xl"
                  style={{
                    clipPath:
                      "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
                  }}
                />
                <div className="relative px-4 py-6 flex flex-col items-center gap-2">
                  <Phone className="w-6 h-6 text-white" />
                  <p className="text-white text-xs font-semibold">Call</p>
                </div>
              </button>
            )}

            {emailLink && (
              <button
                onClick={() => handleEmail(emailLink.id, emailLink.url)}
                className="relative group"
                aria-label="Send email"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-2xl"
                  style={{
                    clipPath:
                      "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
                  }}
                />
                <div className="relative px-4 py-6 flex flex-col items-center gap-2">
                  <Mail className="w-6 h-6 text-white" />
                  <p className="text-white text-xs font-semibold">Email</p>
                </div>
              </button>
            )}

            {whatsappLink && (
              <button
                onClick={() =>
                  handleWhatsApp(whatsappLink.id, whatsappLink.url)
                }
                className="relative group col-span-2"
                aria-label="Message on WhatsApp"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-2xl"
                  style={{
                    clipPath:
                      "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
                  }}
                />
                <div className="relative px-4 py-4 flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5 text-white" />
                  <p className="text-white text-sm font-semibold">WhatsApp</p>
                </div>
              </button>
            )}
          </div>

          {/* Save Contact button */}
          <button
            onClick={handleDownloadVCard}
            className="relative group w-full"
            aria-label="Save contact"
          >
            <div
              className="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl shadow-lg"
              style={{
                clipPath:
                  "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
              }}
            />
            <div className="relative px-6 py-4 flex items-center justify-center gap-2">
              <Download className="w-5 h-5 text-white" />
              <p className="text-white font-bold">Save Contact</p>
            </div>
          </button>
        </div>

        {/* Powered By */}
        <p className="text-xs text-white/60 mt-8 text-center px-4">
          Powered by{" "}
          <Link to="/" className="font-semibold text-white hover:text-white/80">
            DotLinkMe
          </Link>
        </p>
      </div>
    </div>
  );
}
