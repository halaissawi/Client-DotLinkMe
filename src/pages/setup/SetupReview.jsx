import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Star, Loader2, Check, ArrowLeft, Info, MapPin } from "lucide-react";

export default function SetupReview() {
  const { userProductId } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userProduct, setUserProduct] = useState(null);
  const [formData, setFormData] = useState({
    nickname: "",
    businessName: "",
    googleReviewUrl: "",
  });

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
        nickname: data.data.nickname || data.data.product?.name || "My Review Stand",
        businessName: data.data.profileData?.businessName || "",
        googleReviewUrl: data.data.profileData?.googleReviewUrl || "",
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
        text: "Please enter a nickname",
        confirmButtonColor: "#0066ff",
      });
      return;
    }

    if (!formData.businessName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please enter your business name",
        confirmButtonColor: "#0066ff",
      });
      return;
    }

    if (!formData.googleReviewUrl.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please enter your Google Review URL",
        confirmButtonColor: "#0066ff",
      });
      return;
    }

    // Basic URL validation
    try {
      const url = new URL(formData.googleReviewUrl);
      if (
        !url.hostname.includes("google.com") &&
        !url.hostname.includes("goo.gl")
      ) {
        // We warn but allow other links if they are valid URLs, 
        // but for "Google Review" product, it's better to stay strict.
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Invalid URL",
        text: "Please enter a valid Google Review URL",
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
              businessName: formData.businessName,
              googleReviewUrl: formData.googleReviewUrl,
              design: "stand_standard",
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
          <p>Your Google Review stand is ready!</p>
          <p class="text-sm text-gray-600 mt-2">You can now order the physical stand or view it in your dashboard.</p>
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
            <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <Star className="w-8 h-8 text-yellow-600 fill-yellow-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Setup Your Review Stand
              </h1>
              <p className="text-gray-600">
                Instantly collect 5-star Google reviews with your NFC stand
              </p>
            </div>
          </div>

          <div className="p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/10 flex gap-3">
             <Info className="w-5 h-5 text-brand-primary flex-shrink-0" />
             <p className="text-sm text-gray-700 leading-relaxed">
               This configuration will be linked directly to your NFC stand. 
               When customers tap, your Google Review page will open instantly.
             </p>
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
                Internal Name (Nickname)
              </label>
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) =>
                  setFormData({ ...formData, nickname: e.target.value })
                }
                placeholder="e.g., Reception Review Stand"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium"
              />
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Public Business Name
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                placeholder="Your Business Name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium"
              />
            </div>

            {/* Google Review URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Google Review Link
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  value={formData.googleReviewUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      googleReviewUrl: e.target.value,
                    })
                  }
                  placeholder="https://g.page/r/YOUR_CODE/review"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium"
                />
              </div>
            </div>

            {/* Visual Reminder */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Display Preview</p>
                <div className="aspect-[3/2] bg-white rounded-xl border-dashed border-2 border-gray-200 flex flex-col items-center justify-center p-6 text-center">
                    <Star className="w-12 h-12 text-yellow-400 fill-yellow-400 mb-2" />
                    <h3 className="font-bold text-gray-900">{formData.businessName || "Your Business Name"}</h3>
                    <p className="text-xs text-brand-primary font-bold mt-1">Tap to Review on Google</p>
                </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-brand-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Activate My Stand
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
