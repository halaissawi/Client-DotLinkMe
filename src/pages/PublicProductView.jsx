import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Star, 
  ExternalLink,
  ShieldCheck,
  Zap,
  ChevronRight
} from "lucide-react";
import PublicMenuRenderer from "../components/PublicProfile/PublicMenuRenderer";

export default function PublicProductView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/api/user-products/${id}/public`);
        const data = await response.json();

        if (data.success) {
          setProduct(data.data);
          // Auto redirect for certain types or just show a nice landing
          if (data.data.productType === 'social_link' && data.data.profileData?.url) {
             // We can auto-redirect or show a "Redirecting..." screen
          }
        } else {
          setError(data.message || "Product not found");
        }
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, API_URL]);

  if (loading) return <LoadingSpinner fullPage text="Connecting to LinkMe..." />;
  
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
        <p className="text-gray-600 mb-6">{error || "This product is not active."}</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="btn-primary px-8 py-3"
        >
          Go to Home
        </button>
      </div>
    );
  }

  // ✅ Use dedicated renderer for menus
  if (product.productType === "menu") {
    return <PublicMenuRenderer profileData={product.profileData} />;
  }

  const { productType, profileData, product: baseProduct } = product;

  // Platform styling
  const platformColors = {
    facebook: { bg: "bg-[#1877F2]", text: "text-white", icon: Facebook },
    instagram: { bg: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]", text: "text-white", icon: Instagram },
    twitter: { bg: "bg-[#1DA1F2]", text: "text-white", icon: Twitter },
    youtube: { bg: "bg-[#FF0000]", text: "text-white", icon: Youtube },
    review: { bg: "bg-yellow-400", text: "text-gray-900", icon: Star },
  };

  const style = platformColors[baseProduct?.platform] || platformColors[productType] || { bg: "bg-brand-primary", text: "text-white", icon: Zap };
  const Icon = style.icon;

  const productImages = {
    facebook: "/products/facebookNfc.avif",
    instagram: "/products/instagramNfcCard.avif",
    twitter: "/products/instagramNfcCard.avif",
    youtube: "/products/youtubeNfcCard.avif",
    menu: "/products/menuNfcCard.avif",
    review: "/products/WhiteGoogleReview.png",
  };

  const defaultImg = productImages[baseProduct?.platform] || productImages[productType];

  const handleAction = () => {
    const targetUrl = productType === 'review' ? profileData?.googleReviewUrl : profileData?.url;
    if (targetUrl) {
      window.location.href = targetUrl;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
       {/* Background Decorative Pattern */}
       <div className="absolute top-0 left-0 w-full h-1/2 bg-gray-50 -z-10 skew-y-3 origin-top-left"></div>
       
       <div className="w-full max-w-xl flex flex-col items-center">
          {/* Main Product Image - CLEAN, NO HOLDER */}
          <div className="relative mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
             <div className={`absolute inset-0 ${style.bg} blur-[100px] opacity-20`}></div>
             <img 
               src={defaultImg || "/placeholder.png"} 
               alt={baseProduct?.name} 
               className="w-full max-w-[320px] h-auto rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] transform hover:scale-105 transition-transform duration-700"
             />
             {/* Simple Platform Icon Overlay */}
             <div className={`absolute -bottom-6 -right-6 w-16 h-16 ${style.bg} rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white`}>
                <Icon size={28} className={style.text} />
             </div>
          </div>

          <div className="text-center max-w-md animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
             <div className="flex items-center justify-center gap-2 mb-4">
                <span className="h-px w-8 bg-gray-200"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Verified Product</span>
                <span className="h-px w-8 bg-gray-200"></span>
             </div>
             
             <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                {productType === 'review' ? 'Review Us' : `Follow Me`}
             </h1>
             <p className="text-lg text-gray-500 font-medium mb-12">
                {profileData?.businessName || profileData?.nickname || baseProduct?.name}
             </p>

             <button
               onClick={handleAction}
               className={`w-full py-6 ${style.bg} ${style.text} rounded-[2rem] font-black text-xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4 group relative overflow-hidden`}
             >
               <span className="relative z-10 flex items-center gap-2">
                 {productType === 'review' ? 'Write a Review' : 'Connect Now'}
                 <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
               </span>
               <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
             </button>
             
             {/* Simple Branding */}
             <div className="mt-16 flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Powered by</p>
                <div className="flex items-center gap-2">
                   <span className="text-2xl font-black tracking-tighter text-[#0b0f19]">.LinkMe</span>
                </div>
             </div>
          </div>
       </div>

       {/* Simple Loading Dots */}
       <div className="fixed bottom-12 flex flex-col items-center gap-4">
          <p className="text-gray-300 text-[10px] font-black uppercase tracking-[0.4em]">Redirecting</p>
          <div className="flex gap-2">
             <div className={`w-1.5 h-1.5 rounded-full ${style.bg} animate-bounce [animation-delay:-0.3s] opacity-40`} />
             <div className={`w-1.5 h-1.5 rounded-full ${style.bg} animate-bounce [animation-delay:-0.15s] opacity-40`} />
             <div className={`w-1.5 h-1.5 rounded-full ${style.bg} animate-bounce opacity-40`} />
          </div>
       </div>
    </div>
  );
}
