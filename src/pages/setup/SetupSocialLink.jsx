import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Loader2,
  Check,
  ArrowLeft,
} from "lucide-react";

export default function SetupSocialLink() {
  const { userProductId } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userProduct, setUserProduct] = useState(null);
  const [formData, setFormData] = useState({
    nickname: "",
    url: "",
  });

  // Platform configurations
  const platformConfig = {
    facebook: {
      name: "Facebook",
      icon: Facebook,
      color: "#1877F2",
      placeholder: "https://facebook.com/yourpage",
    },
    instagram: {
      name: "Instagram",
      icon: Instagram,
      color: "#E4405F",
      placeholder: "https://instagram.com/yourusername",
    },
    twitter: {
      name: "Twitter",
      icon: Twitter,
      color: "#1DA1F2",
      placeholder: "https://twitter.com/yourusername",
    },
    youtube: {
      name: "YouTube",
      icon: Youtube,
      color: "#FF0000",
      placeholder: "https://youtube.com/@yourchannel",
    },
  };

  useEffect(() => {
    fetchUserProduct();
  }, [userProductId]);

  const fetchUserProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/user-products/${userProductId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to load product");
      }

      setUserProduct(data.data);

      // Pre-populate with existing data if available
      setFormData({
        nickname: data.data.nickname || data.data.product?.name || "My Social Card",
        url: data.data.profileData?.url || "",
      });
    } catch (error) {
      console.error("Error fetching user product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load product details",
        confirmButtonColor: "#0066ff",
      }).then(() => {
        navigate("/dashboard");
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.nickname.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please enter a nickname for this card",
        confirmButtonColor: "#0066ff",
      });
      return;
    }

    if (!formData.url.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please enter your social media URL",
        confirmButtonColor: "#0066ff",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(formData.url);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Invalid URL",
        text: "Please enter a valid URL (starting with https://)",
        confirmButtonColor: "#0066ff",
      });
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/user-products/${userProductId}/setup`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nickname: formData.nickname,
            profileData: {
              platform: userProduct.product.platform,
              url: formData.url,
              design: "default", // use a fixed design
            },
            setupComplete: true,
          }),
        },
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Setup failed");
      }

      Swal.fire({
        icon: "success",
        title: "Setup Complete!",
        html: `
          <p>Your ${platformConfig[userProduct.product.platform]?.name} card is ready!</p>
          <p class="text-sm text-gray-600 mt-2">You can now order the physical card or view it in your dashboard.</p>
        `,
        confirmButtonColor: "#0066ff",
      }).then(() => {
        navigate("/dashboard");
      });
    } catch (error) {
      console.error("Setup error:", error);
      Swal.fire({
        icon: "error",
        title: "Setup Failed",
        text: error.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#0066ff",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!userProduct) {
    return null;
  }

  const platform = userProduct.product?.platform;
  const config = platformConfig[platform];

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Invalid platform configuration</p>
        </div>
      </div>
    );
  }

  const PlatformIcon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${config.color}20` }}
            >
              <PlatformIcon
                className="w-8 h-8"
                style={{ color: config.color }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Setup Your {config.name} Card
              </h1>
              <p className="text-gray-600">
                Configure your NFC card to direct link to your {config.name}
              </p>
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Product</p>
                <p className="font-semibold text-gray-900">
                  {userProduct.product?.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">NFC Status</p>
                <p className="text-sm font-medium text-green-600">Ready for link</p>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="space-y-6">
            {/* Nickname */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Card Nickname
              </label>
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) =>
                  setFormData({ ...formData, nickname: e.target.value })
                }
                placeholder="e.g., My Personal Instagram"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium"
              />
              <p className="text-xs text-gray-500 mt-1">
                Give this card a name to identify it in your dashboard
              </p>
            </div>

            {/* Social Media URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Your {config.name} Profile Link
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <PlatformIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder={config.placeholder}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                When someone taps your card, they will go directly to this link
              </p>
            </div>

            {/* Design Note */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm h-fit">
                   <PlatformIcon className="w-5 h-5" style={{ color: config.color }} />
                </div>
                <div>
                   <p className="text-sm font-semibold text-gray-900">Premium {config.name} Design</p>
                   <p className="text-xs text-gray-600 mt-1">Your card will use our signature {config.name} layout designed for maximum engagement.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-brand-primary to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Complete Setup
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
