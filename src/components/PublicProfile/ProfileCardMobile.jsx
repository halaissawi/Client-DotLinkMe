import React from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  Globe,
  User,
  Building2,
  Share2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getPlatformIcon } from "../../utils/platformIcons";

export default function ProfileCardMobile({
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
  const isPersonal = profile.profileType === "personal";

  // Filter out contact methods (phone, email, whatsapp) - KEEP website and all other social links
  const visibleSocialLinks =
    profile.socialLinks?.filter(
      (link) =>
        link.isVisible &&
        link.platform !== "phone" &&
        link.platform !== "email" &&
        link.platform !== "whatsapp"
    ) || [];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Phone-like Card Container */}
        <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
          <div className="bg-white rounded-[2.5rem] overflow-hidden">
            {/* blue Header with More Curved Wave */}
            <div className="relative bg-blue-500 h-40">
              {/* More Curved Wave SVG */}
              <div className="absolute bottom-0 left-0 right-0">
                <svg
                  viewBox="0 0 1440 160"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,80 C320,140 480,140 720,80 C960,20 1120,20 1440,80 L1440,160 L0,160 Z"
                    fill="white"
                  />
                </svg>
              </div>

              {/* Share Button */}
              <button
                onClick={() => setShowShareModal(true)}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full active:bg-white/30 transition-colors"
              >
                <Share2 className="w-5 h-5 text-white" />
              </button>

              {/* Avatar - Overlapping */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-20">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                    {isPersonal ? (
                      <User className="w-14 h-14 text-blue-500" />
                    ) : (
                      <Building2 className="w-14 h-14 text-blue-500" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="pt-16 px-6 pb-6 text-center">
              {/* Name & Title */}
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                {profile.name}
              </h1>
              {profile.title && (
                <p className="text-sm text-gray-600 mb-1">{profile.title}</p>
              )}
              <p className="text-xs text-gray-500 mb-5">
                {profile.profileType === "personal"
                  ? "Personal Profile"
                  : profile.company || "Business Profile"}
              </p>

              {/* Bio */}
              {profile.bio && (
                <p className="text-sm text-gray-700 leading-relaxed mb-5">
                  {profile.bio}
                </p>
              )}

              {/* Contact Info List */}
              <div className="space-y-2 mb-5">
                {phoneLink && (
                  <button
                    onClick={() => handleCall(phoneLink.id, phoneLink.url)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 active:bg-gray-100 rounded-xl transition-all text-left"
                  >
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Mobile phone
                      </p>
                      <p className="text-xs text-gray-500">{phoneLink.url}</p>
                    </div>
                  </button>
                )}

                {emailLink && (
                  <button
                    onClick={() => handleEmail(emailLink.id, emailLink.url)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 active:bg-gray-100 rounded-xl transition-all text-left"
                  >
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Email
                      </p>
                      <p className="text-xs text-gray-500">{emailLink.url}</p>
                    </div>
                  </button>
                )}

                {whatsappLink && (
                  <button
                    onClick={() =>
                      handleWhatsApp(whatsappLink.id, whatsappLink.url)
                    }
                    className="w-full flex items-center gap-3 px-3 py-2.5 active:bg-gray-100 rounded-xl transition-all text-left"
                  >
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        WhatsApp
                      </p>
                      <p className="text-xs text-gray-500">
                        {whatsappLink.url.includes("wa.me")
                          ? whatsappLink.url.split("wa.me/")[1]
                          : whatsappLink.url}
                      </p>
                    </div>
                  </button>
                )}
              </div>

              {visibleSocialLinks.map((link) => (
                <div key={link.id}>
                  <p className="text-xs">{link.url}</p>{" "}
                  {/* Show the actual URL */}
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 bg-blue-500 text-white rounded-full flex items-center justify-center active:scale-95 transition-transform"
                  >
                    {getPlatformIcon(link.platform)}
                  </a>
                </div>
              ))}

              {/* Save Contact Button */}
              <button
                onClick={handleDownloadVCard}
                className="w-full py-3.5 bg-blue-500 text-white font-semibold rounded-xl active:bg-blue-600 transition-all text-sm"
              >
                + Add to Contacts
              </button>

              {/* Powered By */}
              <p className="text-xs text-gray-400 mt-5">
                Powered by{" "}
                <Link to="/" className="font-semibold">
                  <span className="text-brand-accent">Dot</span>LinkMe
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
