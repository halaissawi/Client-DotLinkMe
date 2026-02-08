import React, { useState } from "react";
import { Search, ChevronRight, X, Phone, MapPin, Clock, Instagram, Facebook } from "lucide-react";

export default function PublicMenuRenderer({ profileData }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const categories = profileData?.categories || [];
  const items = categories.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, category: cat.name }))
  );

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const {
    restaurantName = "Our Menu",
    description = "Welcome to our digital menu",
    logo,
    coverImage,
    primaryColor = "#000000",
    accentColor = "#FF8000",
  } = profileData || {};

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative h-64 bg-gray-900">
        <div className="absolute inset-0 bg-black/50 z-10" />
        {coverImage ? (
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900" />
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
          <div className="flex items-center gap-4 mb-4">
            {logo ? (
              <img
                src={logo}
                alt="Logo"
                className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-white object-cover"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-orange-500 flex items-center justify-center text-3xl font-bold"
                style={{ backgroundColor: accentColor }}
              >
                {restaurantName.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{restaurantName}</h1>
              <p className="opacity-90 text-sm line-clamp-1">{description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-white px-6 py-4 shadow-sm border-b border-gray-100 flex items-center justify-between overflow-x-auto whitespace-nowrap gap-6 no-scrollbar">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Clock className="w-4 h-4 text-green-600" />
          <span>Open Now</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Phone className="w-4 h-4 text-blue-600" />
          <span>Call Us</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <MapPin className="w-4 h-4 text-red-600" />
          <span>Map</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 px-4 py-3 shadow-sm">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all font-medium"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeCategory === "all"
                ? "bg-gray-900 text-white shadow-lg scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            style={
              activeCategory === "all" ? { backgroundColor: primaryColor } : {}
            }
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.name
                  ? "bg-gray-900 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={
                activeCategory === cat.name
                  ? { backgroundColor: primaryColor }
                  : {}
              }
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="p-4 space-y-6">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between gap-4 cursor-pointer hover:border-orange-500/30 transition-all active:scale-[0.98]"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                    {item.description || "Detailed description available."}
                  </p>
                  <p
                    className="font-bold text-lg"
                    style={{ color: accentColor }}
                  >
                    {item.price ? `${item.price}` : "Price on request"}
                  </p>
                </div>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-xl object-cover bg-gray-100"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 font-medium">No items found</p>
          </div>
        )}
      </div>

      {/* Item Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-10 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-md transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedItem.image ? (
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 font-medium">No Image</span>
              </div>
            )}

            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedItem.name}
                </h2>
                <p
                  className="text-xl font-bold whitespace-nowrap"
                  style={{ color: accentColor }}
                >
                  {selectedItem.price}
                </p>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {selectedItem.description ||
                  "This delicious item is prepared with fresh ingredients."}
              </p>

              <button
                className="w-full py-4 rounded-xl font-bold text-white shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: primaryColor }}
                onClick={() => setSelectedItem(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <div className="text-center py-8 opacity-50 hover:opacity-100 transition-opacity">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Powered by .LinkMe
        </p>
      </div>
    </div>
  );
}
