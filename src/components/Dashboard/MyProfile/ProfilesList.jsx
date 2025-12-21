import React from "react";
import { Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import {
  Edit,
  Eye,
  Share2,
  Link2,
  QrCode,
  Pause,
  Play,
  User,
  Building,
  MoreVertical,
} from "lucide-react";

export default function ProfilesList({
  profiles,
  showQR,
  setShowQR,
  onShare,
  onCopyLink,
  onToggleStatus,
}) {
  const [openMenu, setOpenMenu] = React.useState(null);

  return (
    <div className="space-y-4 px-4 sm:px-0">
      {profiles.map((profile, index) => (
        <div
          key={profile.id}
          className="group bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 hover:shadow-xl hover:border-[#0066ff]/50 transition-all duration-300 "
          style={{
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            animationDelay: `${index * 0.1}s`,
          }}
        >
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Profile Header */}
            <div className="flex-1 flex items-start gap-4">
              <div className="flex items-center gap-4">
                {profile.avatarUrl ? (
                  <div className="relative">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className={`w-16 h-16 object-cover ring-2 ring-gray-100 group-hover:ring-[#0066ff]/50 transition-all ${profile.profileType === "personal"
                        ? "rounded-full"
                        : "rounded-xl"
                        }`}
                    />
                    {profile.isActive && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    )}
                  </div>
                ) : (
                  <div
                    className={`w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-3xl group-hover:from-[#0066ff]/10 group-hover:to-blue-100 transition-all relative ${profile.profileType === "personal"
                      ? "rounded-full"
                      : "rounded-xl"
                      }`}
                  >
                    {profile.profileType === "personal" ? (
                      <User className="w-8 h-8 text-gray-500" />
                    ) : (
                      <Building className="w-8 h-8 text-gray-500" />
                    )}
                    {profile.isActive && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    )}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-[#0b0f19] group-hover:text-[#0066ff] transition-colors text-lg">
                    {profile.name}
                  </h3>
                  <p className="text-sm text-gray-600">{profile.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-[#0066ff]/10 to-blue-100 text-[#0066ff] font-semibold capitalize">
                      {profile.profileType}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-600 hover:text-[#0066ff] transition-colors">
                <Eye className="w-4 h-4" />
                <span className="font-semibold">{profile.viewCount || 0}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 hover:text-[#f2a91d] transition-colors">
                <Link2 className="w-4 h-4" />
                <span className="font-semibold">
                  {profile.socialLinks?.length || 0}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid gap-2 grid-cols-5">
              <Link
                to={`/dashboard/profiles/${profile.id}`}
                className="group/btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 transition-all font-semibold text-sm"
              >
                <Edit className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                Edit
              </Link>

              <Link
                to={`/u/${profile.slug}`}
                target="_blank"
                className="group/btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0066ff] to-[#0052cc] text-white hover:shadow-lg hover:scale-105 transition-all font-semibold text-sm"
              >
                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                View
              </Link>

              <button
                onClick={() => onShare(profile)}
                className="group/btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105 transition-all font-semibold text-sm"
              >
                <Share2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                Share
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQR(prev => (prev === profile.id ? null : profile.id));
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all font-semibold text-sm"
              >
                <QrCode className="w-4 h-4" />
                QR
              </button>

              {showQR === profile.id && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full">
                    <div className="flex flex-col items-center gap-4">
                      <h3 className="text-xl font-bold text-gray-800">
                        Scan the QR code                      </h3>
                      <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                        <QRCodeCanvas
                          value={`${window.location.origin}/u/${profile.slug}`}
                          size={200}
                        />
                      </div>
                      <p className="text-sm text-gray-600 text-center">
                        Scan the code to view the card                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowQR(null);
                        }}
                        className="mt-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
                      >
                        closing
                      </button>
                    </div>
                  </div>
                </div>
              )}




              <button
                onClick={() => onToggleStatus(profile.id, profile.isActive)}
                className={`group/btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all font-semibold text-sm hover:scale-105 ${profile.isActive
                  ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                  : "bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
              >
                {profile.isActive ? (
                  <>
                    <Pause className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    Activate
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Mobile & Tablet Layout */}
          <div className="lg:hidden space-y-4">
            {/* Header Section */}
            <div className="flex items-start gap-3">
              {/* Avatar */}
              {profile.avatarUrl ? (
                <div className="relative flex-shrink-0">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className={`w-14 h-14 sm:w-16 sm:h-16 object-cover ring-2 ring-gray-100 group-hover:ring-[#0066ff]/50 transition-all ${profile.profileType === "personal"
                      ? "rounded-full"
                      : "rounded-xl"
                      }`}
                  />
                  {profile.isActive && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  )}
                </div>
              ) : (
                <div
                  className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-[#0066ff]/10 group-hover:to-blue-100 transition-all relative ${profile.profileType === "personal"
                    ? "rounded-full"
                    : "rounded-xl"
                    }`}
                >
                  {profile.profileType === "personal" ? (
                    <User className="w-7 h-7 text-gray-500" />
                  ) : (
                    <Building className="w-7 h-7 text-gray-500" />
                  )}
                  {profile.isActive && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  )}
                </div>
              )}

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#0b0f19] text-base sm:text-lg truncate group-hover:text-[#0066ff] transition-colors">
                  {profile.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  {profile.title}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-[#0066ff]/10 to-blue-100 text-[#0066ff] font-semibold capitalize">
                    {profile.profileType}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Eye className="w-4 h-4 text-[#0066ff]" />
                <span className="font-semibold">{profile.viewCount || 0}</span>
                <span className="text-xs">views</span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2 text-gray-600">
                <Link2 className="w-4 h-4 text-[#f2a91d]" />
                <span className="font-semibold">
                  {profile.socialLinks?.length || 0}
                </span>
                <span className="text-xs">links</span>
              </div>
            </div>

            {/* Action Buttons - 2 Column Grid on Mobile */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <Link
                to={`/dashboard/profiles/${profile.id}`}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all font-semibold text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>

              <Link
                to={`/u/${profile.slug}`}
                target="_blank"
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#0066ff] to-[#0052cc] text-white hover:shadow-lg transition-all font-semibold text-sm"
              >
                <Eye className="w-4 h-4" />
                View
              </Link>

              <button
                onClick={() => onShare(profile)}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all font-semibold text-sm"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>

              {/* QR Button */}

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQR(prev => (prev === profile.id ? null : profile.id));
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all font-semibold text-sm"
              >
                <QrCode className="w-4 h-4" />
                QR
              </button>

              {/* QR Preview - Mobile */}
              {showQR === profile.id && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
                >
                  <div
                    className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm sm:mx-4 p-6 pb-8 shadow-2xl animate-slide-up"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-col items-center gap-4">
                      {/* Handle bar للموبايل */}
                      <div className="w-12 h-1 bg-gray-300 rounded-full sm:hidden" />

                      <h3 className="text-lg font-bold text-gray-800">
                        Scan the QR code                      </h3>

                      <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                        <QRCodeCanvas
                          value={`${window.location.origin}/u/${profile.slug}`}
                          size={180}
                        />
                      </div>

                      <p className="text-sm text-gray-600 text-center">
                        Scan the code to view the card                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowQR(null);
                        }}
                        className="w-full mt-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
                      >
                        closing
                      </button>
                    </div>
                  </div>
                </div>
              )}



              <button
                onClick={() => onToggleStatus(profile.id, profile.isActive)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all font-semibold text-sm col-span-2 sm:col-span-1 ${profile.isActive
                  ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                  : "bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
              >
                {profile.isActive ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Activate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
