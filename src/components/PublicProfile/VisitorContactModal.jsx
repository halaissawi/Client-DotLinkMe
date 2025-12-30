import React, { useState } from "react";
import { X, Mail, Phone, Loader2, CheckCircle } from "lucide-react";
import Swal from "sweetalert2";

export default function VisitorContactModal({
  isOpen,
  onClose,
  profileSlug,
  source = "direct",
  themeColor = "#3B82F6", // ✅ Added themeColor prop with blue default
}) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email.trim());
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    const trimmedPhone = phone.trim();
    const digitsOnly = trimmedPhone.replace(/\D/g, "");
    return (
      phoneRegex.test(trimmedPhone) &&
      digitsOnly.length >= 7 &&
      digitsOnly.length <= 15
    );
  };

  const handleValidation = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!handleValidation()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/profiles/public/${profileSlug}/visitor-contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            phone: phone.trim(),
            source,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save contact");
      }

      setSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 2500);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        confirmButtonColor: themeColor, // ✅ Use dynamic color
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPhone("");
    setErrors({});
    setSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ✅ Header with dynamic color */}
        <div
          className="relative p-6 text-center"
          style={{ backgroundColor: themeColor }}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-xl font-bold text-white mb-1">
            {submitted ? "Thank You!" : "Stay Connected"}
          </h2>
          <p className="text-sm text-white/90">
            {submitted ? "Information saved" : "Share your contact details"}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-900 font-semibold mb-2">Success!</p>
              <p className="text-sm text-gray-600">We'll be in touch soon</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    placeholder="you@example.com"
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-200"
                    }`}
                    style={
                      !errors.email ? { focusRingColor: `${themeColor}33` } : {}
                    }
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: "" });
                    }}
                    placeholder="07 XXXX XXXX"
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.phone
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-200"
                    }`}
                    disabled={loading}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>

              {/* ✅ Submit button with dynamic color */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: themeColor }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Submit"
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Your info is safe with us 🔒
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
