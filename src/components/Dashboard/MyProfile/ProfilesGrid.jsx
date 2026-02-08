import React from "react";
import { Link } from "react-router-dom";
import { 
  Edit, 
  Eye, 
  Share2, 
  Pause, 
  Play, 
  Trash2, 
  Link2, 
  User, 
  Building, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  UtensilsCrossed, 
  Star,
  ShoppingCart,
  QrCode
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import ProfileCardPreview from "./ProfileCardPreview";

/* ==================== UTILITY FUNCTION ==================== */
function adjustColorBrightness(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0xff) + amt;
  const B = (num & 0xff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (Math.min(255, Math.max(0, R)) << 16) +
      (Math.min(255, Math.max(0, G)) << 8) +
      Math.min(255, Math.max(0, B))
    )
      .toString(16)
      .slice(1)
  );
}


export default function ProfilesGrid({
  profiles: items,
  showQR,
  setShowQR,
  onShare,
  onCopyLink,
  onToggleStatus,
  onDelete,
}) {
  const getProductConfig = (item) => {
    if (item.type === "profile") {
      const isProductBased = !!item.product;
      return {
        icon: item.profileType === "personal" ? User : Building,
        label: isProductBased ? item.product.name : (item.profileType === "personal" ? "Personal Profile" : "Business Profile"),
        defaultImage: item.product?.image || "/products/standardCard.png", // Added fallback
        editLink: `/dashboard/edit/profile/${item.id}`,
        viewLink: `/u/${item.slug}`,
        isSetup: true,
      };
    }

    if (item.type === "menu") {
      return {
        icon: UtensilsCrossed,
        label: "Digital Menu",
        subLabel: item.restaurantName,
        defaultImage: "/products/menuNfcCard.avif",
        editLink: `/dashboard/edit/menu/${item.id}`,
        viewLink: `/menu/${item.uniqueSlug}`,
        isSetup: true,
      };
    }

    // For user-products
    switch (item.productType) {
      case "social_link":
        const platformIcons = { 
          facebook: { icon: Facebook, color: "#1877F2", img: "/products/facebookNfc.avif" }, 
          instagram: { icon: Instagram, color: "#E4405F", img: "/products/instagramNfcCard.avif" }, 
          twitter: { icon: Twitter, color: "#1DA1F2", img: "/products/instagramNfcCard.avif" }, 
          youtube: { icon: Youtube, color: "#FF0000", img: "/products/youtubeNfcCard.avif" } 
        };
        const platform = platformIcons[item.platform] || platformIcons.facebook;
        return {
          icon: platform.icon,
          platformColor: platform.color,
          defaultImage: platform.img,
          label: `${item.platform?.charAt(0).toUpperCase() + item.platform?.slice(1)} Card`,
          subLabel: item.nickname,
          editLink: `/dashboard/edit/user-product/${item.id}`,
          viewLink: item.profileData?.url || null,
          isSetup: item.setupComplete,
        };

      case "menu":
        return {
          icon: UtensilsCrossed,
          defaultImage: "/products/menuNfcCard.avif",
          label: "Digital Menu",
          subLabel: item.nickname,
          editLink: `/dashboard/edit/user-product/${item.id}`,
          viewLink: item.isPaid ? (item.profileData?.url || null) : null,
          isSetup: item.setupComplete,
          isPaid: item.isPaid,
        };
      case "review":
        return {
          icon: Star,
          defaultImage: "/products/WhiteGoogleReview.png",
          label: "Review Stand",
          subLabel: item.profileData?.businessName || item.nickname,
          editLink: `/dashboard/edit/user-product/${item.id}`,
          viewLink: item.profileData?.url || null,
          isSetup: item.setupComplete,
        };

      default:
        return {
          icon: User,
          label: "Product",
          subLabel: item.name,
          editLink: `/dashboard/edit/user-product/${item.id}`,
          viewLink: item.profileData?.url || null,
          isSetup: false,
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => {
        const config = getProductConfig(item);
        const Icon = config.icon;

        return (
          <div
            key={item.unifiedId}
            className="group bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-brand-primary/50 transition-all duration-300 space-y-4"
          >
            {/* Card/Icon Preview */}
            {item.type === "profile" && !item.product ? (
              <ProfileCardPreview
                profile={item}
                onShare={onCopyLink}
                onToggleQR={(id) => setShowQR(showQR === id ? null : id)}
                showQR={showQR}
              />
            ) : (item.product?.image || item.image || config.defaultImage) ? (
              <div className="relative h-44 flex items-center justify-center p-2">
                 <img 
                   src={item.product?.image || item.image || config.defaultImage} 
                   alt={item.name} 
                   className="max-w-full max-h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                 />
                 
                 {/* Subtle Status Badges */}
                 <div className="absolute top-0 left-0 flex gap-2">
                   {!item.setupComplete && item.type !== 'profile' && (
                     <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-md">
                       Setup Required
                     </span>
                   )}
                   {item.isActive && (
                      <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,1)] animate-pulse"></div>
                   )}
                 </div>
              </div>
            ) : (
              <div 
                className={`relative h-44 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6 text-white shadow-inner transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-2xl`}
                style={{
                  background: item.productType === 'social_link' 
                    ? `linear-gradient(135deg, ${config.platformColor || '#0066ff'} 0%, ${adjustColorBrightness(config.platformColor || '#0066ff', -30)} 100%)`
                    : item.productType === 'review' 
                      ? 'linear-gradient(135deg, #f2a91d 0%, #d97706 100%)'
                      : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                }}
              >
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 shadow-lg border border-white/30 transform group-hover:rotate-12 transition-transform duration-500">
                    <Icon className="w-9 h-9 text-white drop-shadow-md" />
                  </div>
                  <h4 className="font-black text-lg tracking-tight drop-shadow-sm">{config.label}</h4>
                  <p className="text-xs font-medium opacity-90 truncate max-w-[150px] mt-1 drop-shadow-sm">
                    {item.profileData?.businessName || item.nickname || config.subLabel}
                  </p>
                </div>

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                   {!item.setupComplete && (
                     <span className="bg-white/90 text-red-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">
                       Setup Required
                     </span>
                   )}
                   {item.isActive && (
                      <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse"></div>
                   )}
                </div>

                {/* Brand Logo */}
                <div className="absolute bottom-3 right-4 opacity-50 text-[10px] font-bold tracking-widest uppercase">
                  .LinkMe
                </div>
              </div>
            )}

            {/* Item Info & Stats */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Link2 className="w-4 h-4" />
                  <span className="font-medium">
                    {item.type === "profile" ? (item.socialLinks?.length || 0) : (item.setupComplete ? "Active" : "New")}
                  </span>
                </div>
              </div>

              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                  item.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.isActive ? "bg-green-500" : "bg-gray-500"
                  }`}
                ></span>
                {item.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                to={config.editLink}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all font-medium text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>

              {config.viewLink ? (
                <a
                  href={config.viewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-blue-600 text-white hover:shadow-lg transition-all font-medium text-sm"
                >
                  <Eye className="w-4 h-4" />
                  View
                </a>
              ) : item.productType === 'menu' && !item.isPaid ? (
                <Link
                  to="/gallery"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-100 text-orange-700 hover:bg-orange-200 transition-all font-bold text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Buy Product
                </Link>
              ) : (
                <button
                  disabled
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed font-medium text-sm"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
              )}

              <button
                onClick={() => onShare(item)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all font-medium text-sm"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQR(showQR === item.unifiedId ? null : item.unifiedId);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all font-medium text-sm"
              >
                <QrCode className="w-4 h-4" />
                QR Code
              </button>

              <button
                onClick={() => onToggleStatus(item)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${
                  item.isActive
                    ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                    : "bg-green-50 text-green-600 hover:bg-green-100"
                }`}
              >
                {item.isActive ? (
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

            {/* Delete Button */}
            <button
              onClick={() => onDelete(item)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all font-medium text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete {item.type === "profile" ? "Profile" : "Product"}
            </button>

            {/* QR Code Modal Fallback for non-ProfileCardPreview items */}
            {showQR === item.unifiedId && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQR(null);
                }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full transform animate-in zoom-in-95 duration-200"
                >
                  <div className="flex flex-col items-center gap-6">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                        {config.label}
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border-4 border-gray-50 shadow-inner">
                      <QRCodeCanvas
                        value={
                          item.type === "profile"
                            ? `${window.location.origin}/u/${item.slug}`
                            : `${window.location.origin}/u/p/${item.id}`
                        }
                        size={200}
                        level="H"
                        includeMargin={false}
                      />
                    </div>

                    <p className="text-sm text-gray-500 text-center px-4">
                      Scan this code to view the {item.type === "profile" ? "profile" : "product"} page instantly.
                    </p>

                    <button
                      onClick={() => setShowQR(null)}
                      className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
