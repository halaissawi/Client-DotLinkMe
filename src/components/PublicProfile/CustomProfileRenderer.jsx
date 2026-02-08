import React from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  Briefcase,
  GraduationCap,
  Code,
  Share2,
  User,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getPlatformIcon } from "../../utils/platformIcons";

/**
 * CustomProfileRenderer - Renders AI-generated profile with custom design
 * This component uses the customProfileDesign JSON to render a unique profile
 */
export default function CustomProfileRenderer({
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
}) {
  const design = profile.customProfileDesign || {};
  const {
    designConcept = {},
    colorPalette = {},
    layout = {},
    typography = {},
  } = design;

  const isPersonal = profile.profileType === "personal";

  // Filter visible social links
  const visibleSocialLinks =
    profile.socialLinks?.filter(
      (link) =>
        link.isVisible &&
        link.platform !== "phone" &&
        link.platform !== "email" &&
        link.platform !== "whatsapp",
    ) || [];

  // Extract color palette
  const primaryColor = colorPalette.primary || "#8B5CF6";
  const secondaryColor = colorPalette.secondary || "#EC4899";
  const accentColor = colorPalette.accent || "#F59E0B";
  const textColor = colorPalette.text || "#1F2937";
  const bgColor = colorPalette.background || "#FFFFFF";

  // Extract layout settings
  const headerStyle = layout.headerStyle || "gradient";
  const cardStyle = layout.cardStyle || "modern";
  const spacing = layout.spacing || "comfortable";

  // Extract typography
  const fontFamily = typography.fontFamily || "Inter, sans-serif";
  const headingSize = typography.headingSize || "2xl";

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: bgColor,
        fontFamily: fontFamily,
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div
          className={`
            rounded-3xl p-8 mb-6 relative overflow-hidden
            ${headerStyle === "gradient" ? "text-white" : ""}
          `}
          style={{
            background:
              headerStyle === "gradient"
                ? `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
                : headerStyle === "solid"
                  ? primaryColor
                  : "white",
          }}
        >
          {/* Share Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            <Share2 className="w-5 h-5 text-white" />
          </button>

          {/* Avatar and Basic Info */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white shadow-xl flex items-center justify-center">
                {isPersonal ? (
                  <User className="w-16 h-16 text-white" />
                ) : (
                  <Building2 className="w-16 h-16 text-white" />
                )}
              </div>
            )}

            <div className="text-center md:text-left flex-1">
              <h1
                className={`font-bold mb-2 ${
                  headingSize === "3xl" ? "text-3xl" : "text-2xl"
                }`}
                style={{ color: headerStyle === "white" ? textColor : "white" }}
              >
                {profile.name}
              </h1>
              {profile.title && (
                <p
                  className="text-lg mb-2"
                  style={{
                    color:
                      headerStyle === "white"
                        ? textColor
                        : "rgba(255,255,255,0.9)",
                  }}
                >
                  {profile.title}
                </p>
              )}
              <p
                className="text-sm"
                style={{
                  color:
                    headerStyle === "white"
                      ? textColor
                      : "rgba(255,255,255,0.7)",
                }}
              >
                {isPersonal
                  ? "Personal Profile"
                  : profile.company || "Business Profile"}
              </p>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p
              className="mt-6 text-center md:text-left leading-relaxed"
              style={{
                color:
                  headerStyle === "white"
                    ? textColor
                    : "rgba(255,255,255,0.95)",
              }}
            >
              {profile.bio}
            </p>
          )}
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {phoneLink && (
            <button
              onClick={() => handleCall(phoneLink.id, phoneLink.url)}
              className="p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-3"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <Phone className="w-6 h-6" style={{ color: primaryColor }} />
              </div>
              <div className="text-left">
                <p
                  className="text-sm font-semibold"
                  style={{ color: textColor }}
                >
                  Phone
                </p>
                <p className="text-xs text-gray-600">{phoneLink.url}</p>
              </div>
            </button>
          )}

          {emailLink && (
            <button
              onClick={() => handleEmail(emailLink.id, emailLink.url)}
              className="p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-3"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${secondaryColor}20` }}
              >
                <Mail className="w-6 h-6" style={{ color: secondaryColor }} />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p
                  className="text-sm font-semibold"
                  style={{ color: textColor }}
                >
                  Email
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {emailLink.url}
                </p>
              </div>
            </button>
          )}

          {whatsappLink && (
            <button
              onClick={() => handleWhatsApp(whatsappLink.id, whatsappLink.url)}
              className="p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-3"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <MessageCircle
                  className="w-6 h-6"
                  style={{ color: accentColor }}
                />
              </div>
              <div className="text-left">
                <p
                  className="text-sm font-semibold"
                  style={{ color: textColor }}
                >
                  WhatsApp
                </p>
                <p className="text-xs text-gray-600">
                  {whatsappLink.url.includes("wa.me")
                    ? whatsappLink.url.split("wa.me/")[1]
                    : whatsappLink.url}
                </p>
              </div>
            </button>
          )}
        </div>

        {/* Experience Section */}
        {profile.experience && profile.experience.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <Briefcase
                  className="w-6 h-6"
                  style={{ color: primaryColor }}
                />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: textColor }}>
                Experience
              </h2>
            </div>

            <div className="space-y-6">
              {profile.experience.map((exp, index) => (
                <div
                  key={index}
                  className="border-l-4 pl-4"
                  style={{ borderColor: primaryColor }}
                >
                  <h3
                    className="font-bold text-lg"
                    style={{ color: textColor }}
                  >
                    {exp.role}
                  </h3>
                  <p className="text-gray-700 mb-1">{exp.company}</p>
                  <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
                  {exp.description && (
                    <p className="text-sm text-gray-600">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${secondaryColor}20` }}
              >
                <Code className="w-6 h-6" style={{ color: secondaryColor }} />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: textColor }}>
                Skills
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-xl font-medium text-white"
                  style={{
                    background: `linear-gradient(135deg, ${secondaryColor} 0%, ${accentColor} 100%)`,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {profile.education && profile.education.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <GraduationCap
                  className="w-6 h-6"
                  style={{ color: accentColor }}
                />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: textColor }}>
                Education
              </h2>
            </div>

            <div className="space-y-4">
              {profile.education.map((edu, index) => (
                <div
                  key={index}
                  className="border-l-4 pl-4"
                  style={{ borderColor: accentColor }}
                >
                  <h3
                    className="font-bold text-lg"
                    style={{ color: textColor }}
                  >
                    {edu.degree}
                  </h3>
                  <p className="text-gray-700">{edu.institution}</p>
                  <p className="text-sm text-gray-500">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {visibleSocialLinks.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: textColor }}>
              Connect With Me
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {visibleSocialLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleSocialClick(link.id, link.url)}
                  className="w-14 h-14 rounded-2xl text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                  }}
                >
                  {getPlatformIcon(link.platform)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Save Contact Button */}
        <button
          onClick={handleDownloadVCard}
          className="w-full py-4 text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg text-lg"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
          }}
        >
          + Add to Contacts
        </button>

        {/* Powered By */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Powered by{" "}
          <Link
            to="/"
            className="font-semibold text-gray-600 hover:text-gray-900"
          >
            LinkMe
          </Link>
        </p>
      </div>
    </div>
  );
}
