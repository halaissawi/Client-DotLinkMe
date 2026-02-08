import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Instagram, 
  Facebook, 
  Twitter,
  Utensils,
  Info,
  Share2,
  AlertCircle
} from "lucide-react";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import NotFound from "./NotFound";

const DIETARY_TAGS = {
  vegetarian: { label: "Vegetarian", emoji: "🌱", color: "text-green-600 bg-green-50" },
  vegan: { label: "Vegan", emoji: "🥬", color: "text-emerald-600 bg-emerald-50" },
  "gluten-free": { label: "Gluten-Free", emoji: "🌾", color: "text-amber-600 bg-amber-50" },
  spicy: { label: "Spicy", emoji: "🌶️", color: "text-red-600 bg-red-50" },
  popular: { label: "Popular", emoji: "⭐", color: "text-yellow-600 bg-yellow-50" },
};

export default function MenuViewer() {
  const { slug } = useParams();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [logoError, setLogoError] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`${API_URL}/api/menu/${slug}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || "Failed to load menu");
        }
        
        if (data.success && data.data) {
          setMenu(data.data);
          if (data.data.categories?.length > 0) {
            // Set to null to show all categories by default
            setActiveCategory(null);
          }
        } else {
          setMenu(null);
        }
      } catch (err) {
        console.error("Error fetching menu:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [slug, API_URL]);

  // Memoize theme styles for performance
  const themeStyles = useMemo(() => {
    const primaryColor = menu?.theme?.primaryColor || "#f2a91d";
    return {
      color: { color: primaryColor },
      bg: { backgroundColor: primaryColor },
      borderColor: { borderColor: primaryColor },
    };
  }, [menu?.theme?.primaryColor]);

  // Helper to construct social media links
  const getSocialLink = (platform, value) => {
    if (!value) return null;
    
    const clean = value
      .replace(/^@/, '')
      .replace(/^https?:\/\//, '')
      .replace(/^(www\.)?/, '')
      .trim();
    
    const baseUrls = {
      instagram: 'https://instagram.com/',
      facebook: 'https://facebook.com/',
      twitter: 'https://twitter.com/',
    };
    
    if (clean.includes('.com') || clean.includes(platform)) {
      return clean.startsWith('http') ? clean : `https://${clean}`;
    }
    
    return baseUrls[platform] + clean;
  };

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: menu.restaurantName,
      text: `Check out ${menu.restaurantName}'s menu!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  // Loading state
  if (loading) {
    return <LoadingSpinner fullPage text="Loading menu..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Menu</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!menu) {
    return <NotFound />;
  }

  const theme = menu.theme || {};
  const primaryColor = theme.primaryColor || "#f2a91d";
  const fontFamily = theme.fontFamily || "Inter";

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{menu.restaurantName} - Digital Menu | LinkMe</title>
        <meta name="description" content={menu.tagline || `View the full menu for ${menu.restaurantName}`} />
        <meta property="og:title" content={`${menu.restaurantName} - Digital Menu`} />
        <meta property="og:description" content={menu.tagline || `View the full menu for ${menu.restaurantName}`} />
        <meta property="og:image" content={menu.logo || menu.coverImage || '/images/default-menu.png'} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pb-20" style={{ fontFamily }}>
        {/* Cover Image */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden">
          {menu.coverImage && !coverError ? (
            <img 
              src={menu.coverImage} 
              alt={`${menu.restaurantName} cover`}
              className="w-full h-full object-cover"
              onError={() => setCoverError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900" />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Restaurant Header */}
        <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10">
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
              {/* Logo */}
              <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-lg -mt-20 md:-mt-24 border border-gray-100 flex items-center justify-center overflow-hidden">
                {menu.logo && !logoError ? (
                  <img 
                    src={menu.logo} 
                    alt={`${menu.restaurantName} logo`}
                    className="w-full h-full object-contain" 
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <Utensils className="w-12 h-12 text-gray-300" />
                )}
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                    {menu.restaurantName}
                  </h1>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={handleShare}
                      className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                      aria-label="Share menu"
                    >
                      <Share2 className="w-5 h-5 text-gray-700" />
                    </button>
                    {menu.social?.instagram && (
                      <a 
                        href={getSocialLink('instagram', menu.social.instagram)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Visit our Instagram"
                      >
                        <Instagram className="w-5 h-5 text-gray-700" />
                      </a>
                    )}
                    {menu.social?.facebook && (
                      <a 
                        href={getSocialLink('facebook', menu.social.facebook)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Visit our Facebook"
                      >
                        <Facebook className="w-5 h-5 text-gray-700" />
                      </a>
                    )}
                    {menu.social?.twitter && (
                      <a 
                        href={getSocialLink('twitter', menu.social.twitter)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Visit our Twitter"
                      >
                        <Twitter className="w-5 h-5 text-gray-700" />
                      </a>
                    )}
                  </div>
                </div>
                
                {menu.tagline && (
                  <p className="text-lg text-gray-600 font-medium italic">"{menu.tagline}"</p>
                )}
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                  {menu.cuisineType && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-bold rounded-full border border-gray-200">
                      {menu.cuisineType}
                    </span>
                  )}
                  {menu.address && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                      <MapPin className="w-4 h-4" style={themeStyles.color} />
                      <span>{menu.address}</span>
                    </div>
                  )}
                  {menu.phone && (
                    <a 
                      href={`tel:${menu.phone}`} 
                      className="flex items-center gap-1.5 text-sm text-gray-500 font-medium hover:text-gray-900 transition-colors"
                      aria-label={`Call ${menu.restaurantName}`}
                    >
                      <Phone className="w-4 h-4" style={themeStyles.color} />
                      <span>{menu.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        {menu.categories && menu.categories.length > 0 && (
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 mt-8 shadow-sm">
            <div className="max-w-4xl mx-auto px-4">
              <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
                {/* All Categories Button */}
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-6 py-2.5 rounded-full text-sm font-black whitespace-nowrap transition-all border-2 ${
                    activeCategory === null
                      ? 'shadow-md scale-105'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                  style={{ 
                    backgroundColor: activeCategory === null ? primaryColor : 'transparent',
                    borderColor: activeCategory === null ? primaryColor : 'transparent',
                    color: activeCategory === null ? 'white' : undefined
                  }}
                  aria-label="View all categories"
                  aria-current={activeCategory === null ? 'true' : 'false'}
                >
                  All
                </button>

                {menu.categories.map((cat, index) => {
                  const catId = cat.id || `cat-${index}`;
                  return (
                    <button
                      key={catId}
                      onClick={() => setActiveCategory(catId)}
                      className={`px-6 py-2.5 rounded-full text-sm font-black whitespace-nowrap transition-all border-2 ${
                        activeCategory === catId
                          ? 'shadow-md scale-105'
                          : 'border-transparent text-gray-500 hover:text-gray-900'
                      }`}
                      style={{ 
                        backgroundColor: activeCategory === catId ? primaryColor : 'transparent',
                        borderColor: activeCategory === catId ? primaryColor : 'transparent',
                        color: activeCategory === catId ? 'white' : undefined
                      }}
                      aria-label={`View ${cat.name} category`}
                      aria-current={activeCategory === catId ? 'true' : 'false'}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Menu Area */}
        <div className="max-w-4xl mx-auto px-4 mt-10 space-y-12">
          {menu.categories && menu.categories.length > 0 ? (
            menu.categories.map((category, index) => {
              const catId = category.id || `cat-${index}`;
              
              // Show category if: no filter selected OR this category is selected
              if (activeCategory !== null && activeCategory !== catId) {
                return null;
              }

              return (
                <div key={catId} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                      <div className="w-1.5 h-8 rounded-full" style={themeStyles.bg} />
                      {category.name}
                    </h2>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  {category.items && category.items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {category.items.map((item, itemIndex) => (
                        <div 
                          key={item.id || `item-${itemIndex}`}
                          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex gap-4"
                        >
                          <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start gap-3">
                              <h3 className="text-lg font-bold text-gray-900 transition-colors">
                                {item.name}
                              </h3>
                              {item.price && !isNaN(parseFloat(item.price)) && (
                                <span className="font-black text-lg shrink-0" style={themeStyles.color}>
                                  ${parseFloat(item.price).toFixed(2)}
                                </span>
                              )}
                            </div>
                            
                            {item.description && (
                              <p className="text-sm text-gray-500 leading-relaxed">
                                {item.description}
                              </p>
                            )}

                            {/* Dietary Tags */}
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-1">
                                {item.tags.map(tagId => {
                                  const tag = DIETARY_TAGS[tagId];
                                  if (!tag) return null;
                                  return (
                                    <span 
                                      key={tagId} 
                                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${tag.color}`}
                                      aria-label={tag.label}
                                    >
                                      <span>{tag.emoji}</span>
                                      <span>{tag.label.toUpperCase()}</span>
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {item.image && (
                            <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-50">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover" 
                                loading="lazy"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No items in this category yet.</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-20">
              <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-600 mb-2">No menu items yet</p>
              <p className="text-gray-500">This menu is still being prepared.</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="max-w-4xl mx-auto px-4 mt-20">
          <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Utensils className="w-32 h-32" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl font-bold">Contact & Info</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {menu.email && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <Mail className="w-5 h-5" />
                      <a 
                        href={`mailto:${menu.email}`} 
                        className="hover:text-white transition-colors"
                        aria-label={`Email ${menu.restaurantName}`}
                      >
                        {menu.email}
                      </a>
                    </div>
                  )}
                  {menu.website && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <Globe className="w-5 h-5" />
                      <a 
                        href={menu.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-white transition-colors"
                        aria-label={`Visit ${menu.restaurantName} website`}
                      >
                        {menu.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Prices are inclusive of taxes where applicable. 
                    Please inform our staff of any food allergies or special dietary requirements.
                  </p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-500 font-medium">
                  © {new Date().getFullYear()} {menu.restaurantName}. Built with LinkMe.
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Info className="w-4 h-4" />
                  <span>NFC Menu Powered by LinkMe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}