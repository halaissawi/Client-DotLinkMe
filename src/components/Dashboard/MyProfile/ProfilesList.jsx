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
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  UtensilsCrossed,
  Star,
  ShoppingCart
} from "lucide-react";

export default function ProfilesList({
  profiles: items,
  showQR,
  setShowQR,
  onShare,
  onCopyLink,
  onToggleStatus,
}) {
  const [openMenu, setOpenMenu] = React.useState(null);

  const getProductConfig = (item) => {
    if (item.type === "profile") {
      return {
        icon: item.profileType === "personal" ? User : Building,
        avatar: item.avatarUrl,
        label: item.profileType === "personal" ? "Personal Profile" : "Business Profile",
        subLabel: item.title,
        editLink: `/dashboard/edit/profile/${item.id}`,
        viewLink: `/u/${item.slug}`,
        qrValue: `${window.location.origin}/u/${item.slug}`,
        isSetup: true,
      };
    }

    // For user-products
    switch (item.productType) {
      case "social_link":
        const pf = item.platform || item.product?.platform;
        const platformIconsList = { 
          facebook: { icon: Facebook, color: "#1877F2", img: "/products/facebookNfc.avif" }, 
          instagram: { icon: Instagram, color: "#E4405F", img: "/products/instagramNfcCard.avif" }, 
          twitter: { icon: Twitter, color: "#1DA1F2", img: "/products/instagramNfcCard.avif" }, 
          youtube: { icon: Youtube, color: "#FF0000", img: "/products/youtubeNfcCard.avif" } 
        };
        const platformData = platformIconsList[pf] || platformIconsList.facebook;
        return {
          icon: platformData.icon,
          avatar: platformData.img,
          label: `${pf?.charAt(0).toUpperCase() + pf?.slice(1)} Card`,
          subLabel: item.nickname,
          editLink: `/dashboard/edit/user-product/${item.id}`,
          viewLink: item.profileData?.url || null,
          qrValue: item.setupComplete ? `${window.location.origin}/u/p/${item.id}` : null,
          isSetup: item.setupComplete,
          platformColor: platformData.color,
        };
      case "menu":
        return {
          icon: UtensilsCrossed,
          avatar: "/products/menuNfcCard.avif",
          label: "Digital Menu",
          subLabel: item.nickname,
          editLink: `/dashboard/edit/user-product/${item.id}`,
          viewLink: item.isPaid ? (item.profileData?.url || null) : null,
          qrValue: (item.setupComplete && item.isPaid) ? `${window.location.origin}/u/p/${item.id}` : null,
          isSetup: item.setupComplete,
          isPaid: item.isPaid,
        };
      case "review":
        return {
          icon: Star,
          avatar: "/products/WhiteGoogleReview.png",
          label: "Review Stand",
          subLabel: item.nickname,
          editLink: `/dashboard/edit/user-product/${item.id}`,
          viewLink: item.profileData?.url || null,
          qrValue: item.setupComplete ? `${window.location.origin}/u/p/${item.id}` : null,
          isSetup: item.setupComplete,
        };

      default:
        return {
          icon: User,
          avatar: null,
          label: "Product",
          subLabel: item.name,
          editLink: "#",
          viewLink: item.profileData?.url || null,
          qrValue: null,
          isSetup: false,
        };
    }
  };

  return (
    <div className="space-y-4 px-4 sm:px-0">
      {items.map((item, index) => {
        const config = getProductConfig(item);
        const Icon = config.icon;

        return (
          <div
            key={item.unifiedId}
            className="group bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 hover:shadow-xl hover:border-brand-primary/50 transition-all duration-300 "
            style={{
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Item Header */}
              <div className="flex-1 flex items-start gap-4">
                <div className="flex items-center gap-4">
                  {config.avatar ? (
                    <div className="relative">
                      <img
                        src={config.avatar}
                        alt={item.name}
                        className={`w-16 h-16 object-cover ring-2 ring-gray-100 group-hover:ring-brand-primary/50 transition-all ${item.profileType === "personal" ? "rounded-full" : "rounded-xl"}`}
                      />
                      {item.isActive && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`w-16 h-16 flex items-center justify-center text-3xl group-hover:shadow-lg transition-all relative ${item.profileType === "personal" ? "rounded-full" : "rounded-xl"}`}
                      style={{
                        background: config.platformColor 
                          ? `linear-gradient(135deg, ${config.platformColor}20 0%, ${config.platformColor}40 100%)` 
                          : 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)'
                      }}
                    >
                      <Icon 
                        className="w-8 h-8 transition-transform group-hover:scale-110" 
                        style={{ color: config.platformColor || '#6b7280' }}
                      />
                      {item.isActive && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                      )}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-[#0b0f19] group-hover:text-brand-primary transition-colors text-lg">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate max-w-[200px]">{config.subLabel}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-brand-primary/10 to-blue-100 text-brand-primary font-semibold capitalize">
                        {config.label}
                      </span>
                      {item.productType === 'menu' && !item.isPaid && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center gap-1">
                          <ShoppingCart size={10} />
                          Purchase Required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600 hover:text-brand-primary transition-colors">
                  <Eye className="w-4 h-4" />
                  <span className="font-semibold">{item.viewCount || 0}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 hover:text-brand-accent transition-colors">
                  <Link2 className="w-4 h-4" />
                  <span className="font-semibold">
                    {item.type === "profile" ? (item.socialLinks?.length || 0) : (item.setupComplete ? "Set" : "New")}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid gap-2 grid-cols-5">
                <Link
                  to={config.editLink}
                  className="group/btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 transition-all font-semibold text-sm"
                >
                  <Edit className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  Edit
                </Link>

                {config.viewLink ? (
                  <a
                    href={config.viewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-blue-600 text-white hover:shadow-lg hover:scale-105 transition-all font-semibold text-sm"
                  >
                    <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    View
                  </a>
                ) : item.productType === 'menu' && !item.isPaid ? (
                  <Link
                    to="/gallery"
                    className="group/btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-100 text-orange-700 hover:bg-orange-200 hover:scale-105 transition-all font-bold text-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Buy Product
                  </Link>
                ) : (
                  <button disabled className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed font-semibold text-sm">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                )}

                <button
                  onClick={() => onShare(item)}
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
                    setShowQR(prev => (prev === item.unifiedId ? null : item.unifiedId));
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all font-semibold text-sm"
                >
                  <QrCode className="w-4 h-4" />
                  QR
                </button>

                {showQR === item.unifiedId && config.qrValue && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  >
                    <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full">
                      <div className="flex flex-col items-center gap-4">
                        <h3 className="text-xl font-bold text-gray-800">Scan QR Code</h3>
                        <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                          <QRCodeCanvas value={config.qrValue} size={200} />
                        </div>
                        <p className="text-sm text-gray-600 text-center">Scan the code to view</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowQR(null); }}
                          className="mt-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => onToggleStatus(item)}
                  className={`group/btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all font-semibold text-sm hover:scale-105 ${item.isActive ? "bg-orange-50 text-orange-600 hover:bg-orange-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
                >
                  {item.isActive ? (
                    <><Pause className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />Pause</>
                  ) : (
                    <><Play className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />Activate</>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden space-y-4">
              <div className="flex items-start gap-3">
                {config.avatar ? (
                  <div className="relative flex-shrink-0">
                    <img src={config.avatar} alt={item.name} className={`w-14 h-14 sm:w-16 sm:h-16 object-cover ring-2 ring-gray-100 group-hover:ring-brand-primary/50 transition-all ${item.profileType === "personal" ? "rounded-full" : "rounded-xl"}`} />
                    {item.isActive && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>}
                  </div>
                ) : (
                  <div className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-brand-primary/10 group-hover:to-blue-100 transition-all relative ${item.profileType === "personal" ? "rounded-full" : "rounded-xl"}`}>
                    <Icon className="w-7 h-7 text-gray-500" />
                    {item.isActive && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#0b0f19] text-base sm:text-lg truncate group-hover:text-brand-primary transition-colors">{item.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{config.subLabel}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-brand-primary/10 to-blue-100 text-brand-primary font-semibold capitalize">{config.label}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="w-4 h-4 text-brand-primary" />
                  <span className="font-semibold">{item.viewCount || 0}</span>
                  <span className="text-xs">views</span>
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Link2 className="w-4 h-4 text-brand-accent" />
                  <span className="font-semibold">{item.type === "profile" ? (item.socialLinks?.length || 0) : (item.setupComplete ? "Set" : "New")}</span>
                  <span className="text-xs">{item.type === "profile" ? "links" : ""}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <Link to={config.editLink} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all font-semibold text-sm">
                  <Edit className="w-4 h-4" />Edit
                </Link>

                {config.viewLink ? (
                  <a href={config.viewLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-blue-600 text-white hover:shadow-lg transition-all font-semibold text-sm">
                    <Eye className="w-4 h-4" />View
                  </a>
                ) : (
                  <button disabled className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed font-semibold text-sm">
                    <Eye className="w-4 h-4" />View
                  </button>
                )}

                <button onClick={() => onShare(item)} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all font-semibold text-sm">
                  <Share2 className="w-4 h-4" />Share
                </button>

                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowQR(prev => (prev === item.unifiedId ? null : item.unifiedId)); }} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all font-semibold text-sm">
                  <QrCode className="w-4 h-4" />QR
                </button>

                {showQR === item.unifiedId && config.qrValue && (
                  <div onClick={(e) => e.stopPropagation()} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
                    <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm sm:mx-4 p-6 pb-8 shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-1 bg-gray-300 rounded-full sm:hidden" />
                        <h3 className="text-lg font-bold text-gray-800">Scan QR Code</h3>
                        <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                          <QRCodeCanvas value={config.qrValue} size={180} />
                        </div>
                        <p className="text-sm text-gray-600 text-center">Scan to view</p>
                        <button onClick={(e) => { e.stopPropagation(); setShowQR(null); }} className="w-full mt-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all">Close</button>
                      </div>
                    </div>
                  </div>
                )}

                <button onClick={() => onToggleStatus(item)} className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all font-semibold text-sm col-span-2 sm:col-span-1 ${item.isActive ? "bg-orange-50 text-orange-600 hover:bg-orange-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                  {item.isActive ? <><Pause className="w-4 h-4" />Pause</> : <><Play className="w-4 h-4" />Activate</>}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
