import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Check,
  Star,
  ChevronRight,
  Zap,
  Shield,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Plus,
  Menu as MenuIcon,
  ChefHat,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const ProductShowcase = () => {
  const { addToCart, cartCount } = useCart();
  const [activeFilter, setActiveFilter] = useState("All");
  const [quantities, setQuantities] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // LinkMe Brand Colors - Light Theme
  const colors = {
    primary: "#0066ff",
    dark: "#0b0f19",
    accent: "#f2a91d",
    light: "#f5f5f5",
    white: "#ffffff",
    success: "#10b981",
    gray: "#6b7280",
    lightGray: "#f9fafb",
  };

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      if (data.success) {
        setProducts(data.data || []);
      } else {
        throw new Error(data.message || "Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", "Cards", "Accessories"];

  const filteredProducts =
    activeFilter === "All"
      ? products
      : products.filter((product) => product.category === activeFilter);

  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, value),
    }));
  };

  const getBadgeColor = (badge) => {
    const badgeColors = {
      "Best Seller": colors.accent,
      Premium: colors.primary,
      New: colors.success,
      Popular: "#8b5cf6",
      Eco: "#10b981",
      Trending: "#ec4899",
      Restaurant: "#f59e0b",
      "Start Free": colors.success,
    };
    return badgeColors[badge] || colors.primary;
  };

  const handleAddToCart = (product) => {
    const qty = quantities[product.id] || 1;
    addToCart({ ...product, quantity: qty });
    toast.success(`${product.name} added to cart!`, {
      icon: "🛒",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  const getProductButtonConfig = (product) => {
    if (!product.inStock) {
      return {
        disabled: true,
        text: "Out of Stock",
        variant: "disabled",
        icon: AlertCircle,
        showQuantity: false,
      };
    }

    switch (product.productType) {
      case "profile":
        return {
          text: (product.category === "Accessories" || product.category === "Bracelet") ? "Create Your Profile" : "Create Your Card",
          icon: Plus,
          onClick: () => navigate("/create-card", { state: { product } }),
          showQuantity: false,
          variant: "primary",
        };

      case "menu":
        return {
          text: "Build Your Menu",
          icon: ChefHat,
          onClick: () => navigate("/build-menu"),
          showQuantity: false,
          variant: "primary",
        };

      default:
        return {
          text: "Add to Cart",
          icon: ShoppingCart,
          onClick: () => handleAddToCart(product),
          showQuantity: true,
          variant: "accent",
        };
    }
  };

  // Loading state
  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen"
        style={{ backgroundColor: colors.lightGray }}
      >
        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-lg font-medium" style={{ color: colors.gray }}>
          Loading products...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen px-4"
        style={{ backgroundColor: colors.lightGray }}
      >
        <div
          className="max-w-md w-full p-6 rounded-2xl shadow-xl"
          style={{ backgroundColor: colors.white }}
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <h2 className="text-2xl font-bold" style={{ color: colors.dark }}>
              Error Loading Products
            </h2>
          </div>
          <p className="mb-6" style={{ color: colors.gray }}>
            {error}
          </p>
          <button
            onClick={fetchProducts}
            className="w-full px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-105"
            style={{
              background: `linear-gradient(to right, ${colors.accent}, #eab308)`,
              color: colors.white,
            }}
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: colors.lightGray,
      }}
    >
      {/* Header Section */}
      <div
        className="relative overflow-hidden"
        style={{ backgroundColor: colors.white }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                backgroundColor: `${colors.primary}10`,
                border: `1px solid ${colors.primary}30`,
              }}
            >
              <Zap size={16} style={{ color: colors.primary }} />
              <span
                style={{ color: colors.primary }}
                className="text-sm font-medium"
              >
                Smart NFC Technology
              </span>
            </div>

            <h1
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ color: colors.dark }}
            >
              Elevate Your{" "}
              <span className="bg-gradient-to-r from-brand-accent via-yellow-400 to-brand-accent bg-clip-text text-transparent animate-gradient">
                Networking
              </span>
            </h1>
            <p
              className="text-xl max-w-2xl mx-auto mb-8"
              style={{ color: colors.gray }}
            >
              Premium NFC business cards and digital profiles that make lasting
              impressions
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              {[
                { icon: Shield, text: "Secure & Private" },
                { icon: Zap, text: "Instant Setup" },
                { icon: TrendingUp, text: "Track Analytics" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2"
                  style={{ color: colors.gray }}
                >
                  <item.icon size={20} style={{ color: colors.accent }} />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subtle decorative gradient */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-5"
          style={{ background: colors.primary }}
        />
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md"
              style={{
                backgroundColor:
                  activeFilter === category ? colors.primary : colors.white,
                color: activeFilter === category ? colors.white : colors.dark,
                border: `2px solid ${activeFilter === category ? colors.primary : "#e5e7eb"}`,
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: colors.gray, opacity: 0.3 }}
            />
            <h3
              className="text-2xl font-bold mb-2"
              style={{ color: colors.dark }}
            >
              No Products Found
            </h3>
            <p style={{ color: colors.gray }}>
              {activeFilter === "All"
                ? "No products available at the moment. Check back soon!"
                : `No ${activeFilter.toLowerCase()} available at the moment.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const buttonConfig = getProductButtonConfig(product);
              const isFreeCreation =
                product.productType === "profile" ||
                product.productType === "menu";

              return (
                <div
                  key={product.id}
                  className={`group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                    isFreeCreation ? "border-2 border-brand-primary/20" : ""
                  }`}
                  style={{
                    backgroundColor: colors.white,
                    border: !isFreeCreation ? `1px solid #e5e7eb` : undefined,
                  }}
                >
                  {/* Subtle Glow Effect on Hover */}
                  <div
                    className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 blur-md transition-all duration-500"
                    style={{
                      background: isFreeCreation
                        ? `linear-gradient(135deg, ${colors.primary}40, ${colors.accent}40)`
                        : `linear-gradient(135deg, ${colors.primary}30, ${colors.accent}30)`,
                    }}
                  />

                  <div className="relative bg-white rounded-2xl h-full flex flex-col">
                    {/* Image Container */}
                    <div
                      className="relative h-64 overflow-hidden rounded-t-2xl flex items-center justify-center p-4"
                      style={{ backgroundColor: colors.white }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {isFreeCreation && (
                          <span
                            className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 animate-pulse"
                            style={{
                              backgroundColor: colors.success,
                            }}
                          >
                            Start Free
                          </span>
                        )}
                        {product.badge && (
                          <span
                            className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                            style={{
                              backgroundColor: getBadgeColor(product.badge),
                            }}
                          >
                            {product.badge}
                          </span>
                        )}
                        {product.discount && (
                          <span
                            className="px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                            style={{
                              backgroundColor: "#ef4444",
                              color: colors.white,
                            }}
                          >
                            -{product.discount}%
                          </span>
                        )}
                      </div>

                      {/* Stock Status */}
                      {!product.inStock && (
                        <div
                          className="absolute inset-0 flex items-center justify-center backdrop-blur-sm"
                          style={{ backgroundColor: `${colors.white}95` }}
                        >
                          <span
                            className="text-lg font-bold"
                            style={{ color: colors.gray }}
                          >
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              fill={
                                i < Math.floor(product.rating)
                                  ? colors.accent
                                  : "none"
                              }
                              stroke={
                                i < Math.floor(product.rating)
                                  ? colors.accent
                                  : "#d1d5db"
                              }
                            />
                          ))}
                        </div>
                        <span
                          className="text-sm font-medium"
                          style={{ color: colors.gray }}
                        >
                          {product.rating} ({product.reviews})
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className="text-xl font-bold mb-2"
                        style={{ color: colors.dark }}
                      >
                        {product.name}
                      </h3>

                      {/* Features */}
                      <div className="space-y-2 mb-4">
                        {product.features &&
                          product.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Check
                                size={16}
                                style={{ color: colors.primary, marginTop: 2 }}
                              />
                              <span
                                className="text-sm"
                                style={{ color: colors.gray }}
                              >
                                {feature}
                              </span>
                            </div>
                          ))}
                      </div>

                      {/* Price Section */}
                      <div className="mt-auto">
                        <div className="flex items-end gap-2 mb-4">
                          <span
                            className="text-3xl font-bold"
                            style={{ color: colors.primary }}
                          >
                            {isFreeCreation ? "$0" : `$${product.price}`}
                          </span>
                          {isFreeCreation && (
                            <span className="text-sm font-medium text-gray-500 mb-1">
                              to start
                            </span>
                          )}
                          {!isFreeCreation && product.originalPrice && (
                            <span
                              className="text-lg line-through mb-1"
                              style={{ color: colors.gray, opacity: 0.5 }}
                            >
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          {buttonConfig.showQuantity && (
                            <div
                              className="flex items-center rounded-lg overflow-hidden shadow-sm"
                              style={{ border: `1px solid #e5e7eb` }}
                            >
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    product.id,
                                    (quantities[product.id] || 1) - 1,
                                  )
                                }
                                className="px-3 py-2 transition-colors hover:bg-gray-100"
                                style={{
                                  backgroundColor: colors.white,
                                  color: colors.dark,
                                }}
                              >
                                -
                              </button>
                              <span
                                className="px-4 py-2 font-medium"
                                style={{ color: colors.dark }}
                              >
                                {quantities[product.id] || 1}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    product.id,
                                    (quantities[product.id] || 1) + 1,
                                  )
                                }
                                className="px-3 py-2 transition-colors hover:bg-gray-100"
                                style={{
                                  backgroundColor: colors.white,
                                  color: colors.dark,
                                }}
                              >
                                +
                              </button>
                            </div>
                          )}

                          <button
                            onClick={buttonConfig.onClick}
                            disabled={buttonConfig.disabled}
                            className={`group relative overflow-hidden flex-1 px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                              buttonConfig.variant === "accent"
                                ? "hover:shadow-[0_12px_40px_rgba(242,169,29,0.6)]"
                                : "hover:shadow-[0_12px_40px_rgba(0,102,255,0.4)]"
                            }`}
                            style={{
                              background:
                                buttonConfig.variant === "accent"
                                  ? `linear-gradient(to right, ${colors.accent}, #eab308)`
                                  : `linear-gradient(to right, ${colors.primary}, #0052cc)`,
                              color: colors.white,
                              boxShadow:
                                buttonConfig.variant === "accent"
                                  ? "0 8px 30px rgba(242,169,29,0.4)"
                                  : "0 8px 30px rgba(0,102,255,0.3)",
                            }}
                          >
                            <span
                              className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                                buttonConfig.variant === "accent"
                                  ? "bg-gradient-to-r from-yellow-500 to-brand-accent"
                                  : "bg-gradient-to-r from-blue-600 to-brand-primary"
                              }`}
                            ></span>
                            <span className="relative z-10 flex items-center gap-2">
                              {buttonConfig.icon && (
                                <buttonConfig.icon size={18} />
                              )}
                              {buttonConfig.text}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-xl bg-brand-gradient">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-2"
            style={{ color: colors.white }}
          >
            Need Help Choosing?
          </h2>
          <p
            className="text-sm sm:text-base mb-4"
            style={{ color: colors.white, opacity: 0.9 }}
          >
            Our team is here to help you find the perfect solution for your
            networking needs
          </p>
          <button
            className="group relative overflow-hidden px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 mx-auto transition-all duration-300 hover:shadow-lg hover:scale-105"
            style={{
              background: "linear-gradient(to right, #eab308, #f2a91d)",
              color: colors.white,
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-brand-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative z-10 flex items-center gap-2">
              Contact Sales
              <ChevronRight size={20} />
            </span>
          </button>
        </div>
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <button
          onClick={() => navigate("/dashboard/cart")}
          className="fixed bottom-8 right-8 z-[100] bg-brand-primary text-white p-4 rounded-2xl shadow-2xl hover:scale-110 transition-all flex items-center gap-3 animate-bounce-subtle"
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-brand-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-primary">
              {cartCount}
            </span>
          </div>
          <span className="font-bold">View Cart</span>
        </button>
      )}

      {/* Bottom Decorative Elements */}
      <div
        className="fixed bottom-0 left-0 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-5"
        style={{ background: colors.accent }}
      />
    </div>
  );
};

export default ProductShowcase;


