import React from "react";
import { MapPin, Phone, Mail, Globe, Facebook, Instagram, Twitter } from "lucide-react";

export default function StepReview({ formData }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Menu</h2>
        <p className="text-gray-600">Check everything looks good before creating</p>
      </div>

      {/* Preview Card */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200 overflow-hidden">
        {/* Cover Image */}
        {formData.coverImage && (
          <div className="h-48 overflow-hidden">
            <img 
              src={formData.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <div className="p-8 text-center border-b">
          {formData.logo && (
            <img 
              src={formData.logo} 
              alt="Logo" 
              className="w-24 h-24 object-cover rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
            />
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {formData.restaurantName || "Your Restaurant"}
          </h1>
          {formData.tagline && (
            <p className="text-gray-600 text-lg">{formData.tagline}</p>
          )}
          {formData.cuisineType && (
            <span className="inline-block mt-3 px-4 py-1.5 bg-[#f2a91d]/10 text-[#f2a91d] rounded-full text-sm font-semibold">
              {formData.cuisineType} Cuisine
            </span>
          )}
        </div>

        {/* Contact Info */}
        <div className="p-6 border-b bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{formData.phone}</span>
              </div>
            )}
            {formData.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{formData.email}</span>
              </div>
            )}
            {formData.address && (
              <div className="flex items-center gap-3 text-sm md:col-span-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{formData.address}</span>
              </div>
            )}
            {formData.website && (
              <div className="flex items-center gap-3 text-sm md:col-span-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-[#f2a91d] hover:underline">
                  {formData.website}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Menu Categories */}
        <div className="p-8">
          <h3 className="text-xl font-bold mb-6 text-gray-900">Menu</h3>
          {formData.categories && formData.categories.length > 0 ? (
            <div className="space-y-8">
              {formData.categories.filter(cat => cat.items && cat.items.length > 0).map((category) => (
                <div key={category.id}>
                  <h4 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-[#f2a91d]">
                    {category.name}
                  </h4>
                  <div className="space-y-4">
                    {category.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            {item.image && (
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                              />
                            )}
                            <div>
                              <h5 className="font-semibold text-gray-900">{item.name}</h5>
                              {item.tags && item.tags.length > 0 && (
                                <div className="flex gap-1 mt-0.5">
                                  {item.tags.map(tag => (
                                    <span key={tag} className="text-xs">
                                      {tag === 'vegetarian' && '🌱'}
                                      {tag === 'vegan' && '🥬'}
                                      {tag === 'gluten-free' && '🌾'}
                                      {tag === 'spicy' && '🌶️'}
                                      {tag === 'popular' && '⭐'}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-600 pl-[3.75rem]">{item.description}</p>
                          )}
                        </div>
                        <span className="font-bold text-[#f2a91d] text-lg whitespace-nowrap">
                          ${item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No menu items added yet</p>
          )}
        </div>

        {/* Social Links */}
        {(formData.social?.facebook || formData.social?.instagram || formData.social?.twitter) && (
          <div className="p-6 bg-gray-50 border-t flex justify-center gap-4">
            {formData.social.facebook && (
              <a href={`https://facebook.com/${formData.social.facebook}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                <Facebook className="w-6 h-6" />
              </a>
            )}
            {formData.social.instagram && (
              <a href={`https://instagram.com/${formData.social.instagram}`} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700">
                <Instagram className="w-6 h-6" />
              </a>
            )}
            {formData.social.twitter && (
              <a href={`https://twitter.com/${formData.social.twitter}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
                <Twitter className="w-6 h-6" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">
            {formData.categories?.length || 0}
          </p>
          <p className="text-sm text-gray-600 mt-1">Categories</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-600">
            {formData.categories?.reduce((total, cat) => total + (cat.items?.length || 0), 0) || 0}
          </p>
          <p className="text-sm text-gray-600 mt-1">Menu Items</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">
            {formData.theme?.layout || "Modern"}
          </p>
          <p className="text-sm text-gray-600 mt-1">Theme</p>
        </div>
      </div>
    </div>
  );
}