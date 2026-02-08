import React from "react";
import { Link } from "react-router-dom";
import UniversalCardPreview from "../../shared/UniversalCardPreview";
import {
  User,
  Building,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  UtensilsCrossed,
  Star,
  CheckCircle,
  AlertCircle,
  Eye,
  Link2,
  ArrowRight,
} from "lucide-react";

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


export default function ProductCard({ product }) {
  // Determine product type and get appropriate styling
  const getProductConfig = () => {
    // Digital Profile (created free)
    if (product.type === "profile") {
      return {
        icon: product.profileType === "personal" ? User : Building,
        iconBgColor:
          product.profileType === "personal" ? "bg-blue-100" : "bg-purple-100",
        iconColor:
          product.profileType === "personal"
            ? "text-blue-600"
            : "text-purple-600",
        badge: product.profileType === "personal" ? "Personal" : "Business",
        badgeColor:
          product.profileType === "personal" ? "bg-blue-500" : "bg-purple-500",
        link: `/dashboard/profiles/${product.originalId}`,
        canView: true,
        showCard: true,
      };
    }

    // Purchased Products
    switch (product.productType) {
      case "social_link":
        const platform = product.platform || product.product?.platform;
        const platformIcons = {
          facebook: { icon: Facebook, color: "#1877F2", img: "/products/facebookNfc.avif" },
          instagram: { icon: Instagram, color: "#E4405F", img: "/products/instagramNfcCard.avif" },
          twitter: { icon: Twitter, color: "#1DA1F2", img: "/products/instagramNfcCard.avif" },
          youtube: { icon: Youtube, color: "#FF0000", img: "/products/youtubeNfcCard.avif" },
        };
        const platformData = platformIcons[platform] || platformIcons.facebook;

        return {
          icon: platformData.icon,
          iconBgColor: "bg-pink-100",
          iconColor: "text-pink-600",
          platformColor: platformData.color,
          defaultImage: platformData.img,
          badge: platform
            ? platform.charAt(0).toUpperCase() + platform.slice(1)
            : "Social",
          badgeColor: "bg-pink-500",
          link: product.setupComplete
            ? `/u/p/${product.originalId}`
            : `/setup-social-link/${product.originalId}`,
          canView: product.setupComplete,
          showCard: false, 
        };

      case "menu":
        return {
          icon: UtensilsCrossed,
          iconBgColor: "bg-orange-100",
          iconColor: "text-orange-600",
          defaultImage: "/products/menuNfcCard.avif",
          badge: "Digital Menu",
          badgeColor: "bg-orange-500",
          link: product.setupComplete
            ? `/u/p/${product.originalId}`
            : `/setup-menu/${product.originalId}`,
          canView: product.setupComplete,
          showCard: false,
        };

      case "review":
        return {
          icon: Star,
          iconBgColor: "bg-yellow-100",
          iconColor: "text-yellow-600",
          defaultImage: "/products/WhiteGoogleReview.png",
          badge: "Review Stand",
          badgeColor: "bg-yellow-500",
          link: product.setupComplete
            ? `/u/p/${product.originalId}`
            : `/setup-review/${product.originalId}`,
          canView: product.setupComplete,
          showCard: false,
        };


      default:
        return {
          icon: User,
          iconBgColor: "bg-gray-100",
          iconColor: "text-gray-600",
          badge: "Product",
          badgeColor: "bg-gray-500",
          link: "#",
          canView: false,
          showCard: false,
        };
    }
  };

  const config = getProductConfig();
  const Icon = config.icon;

  // If it's a profile with card preview, show the card
  if (config.showCard && product.type === "profile") {
    return (
      <Link to={config.link} className="block group">
        <div className="relative">
          {/* Status Badge */}
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold text-white ${config.badgeColor} shadow-lg`}
            >
              {config.badge}
            </span>
            {product.isActive && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white shadow-lg flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Active
              </span>
            )}
          </div>

          {/* Card Preview */}
          <div className="hover:scale-[1.02] transition-transform duration-300">
            <UniversalCardPreview
              profile={product}
              selectedTemplate={product.template}
              showViewCount={true}
              customDesignUrl={product.customDesignUrl}
            />
          </div>

          {/* View Count */}
          {product.viewCount > 0 && (
            <div className="mt-2 flex items-center justify-center gap-1 text-sm text-gray-600">
              <Eye className="w-4 h-4" />
              <span>{product.viewCount} views</span>
            </div>
          )}
        </div>
      </Link>
    );
  }

  // For purchased products, show a clean product-focused card
  return (
    <Link to={config.link} className="block group">
      <div className="relative bg-white rounded-3xl border-2 border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-brand-primary/50 transition-all duration-300 group-hover:scale-[1.02]">
        {/* Status Badges */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-20">
           <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${config.badgeColor} text-white shadow-sm`}>
             {config.badge}
           </span>
           {product.setupComplete ? (
             <span className="bg-green-100 text-green-600 px-2 py-1 rounded-lg text-[9px] font-bold flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Ready
             </span>
           ) : (
             <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg text-[9px] font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Setup Needed
             </span>
           )}
        </div>

        <div className="flex flex-col items-center text-center">
          {/* Main Product Image - Clean & Centered */}
          <div className="relative w-full aspect-square flex items-center justify-center mb-6">
             <div className={`absolute inset-0 ${config.iconBgColor} opacity-20 blur-3xl rounded-full`}></div>
             <img 
               src={product.image || config.defaultImage} 
               alt={product.name} 
               className="relative z-10 max-w-[85%] max-h-[85%] object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
             />
             
             {/* Platform Icon Float */}
             <div className={`absolute bottom-0 right-[15%] w-10 h-10 ${config.iconBgColor} ${config.iconColor} rounded-xl flex items-center justify-center shadow-lg border-2 border-white transform translate-y-2`}>
                <Icon className="w-6 h-6" />
             </div>
          </div>

          <div className="space-y-1">
             <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-primary transition-colors leading-tight">
               {product.name}
             </h3>
             <p className="text-sm font-medium text-gray-500 truncate max-w-[200px]">
               {product.profileData?.businessName || product.nickname || '.LinkMe Smart Product'}
             </p>
          </div>

          <div className="mt-6 w-full flex items-center justify-between p-3 bg-gray-50 rounded-2xl group-hover:bg-brand-primary/5 transition-colors">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Link2 className="w-3 h-3" /> NFC Active
             </span>
             <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand-primary transition-colors group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );


}
