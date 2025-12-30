import React, { useState } from "react";
import axios from "axios";
import {
  Eye,
  EyeOff,
  Lock,
  Loader2,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function PasswordSettings() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleInputChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));

    // Calculate password strength for new password
    if (field === "newPassword") {
      calculatePasswordStrength(value);
    }

    // Clear error message when user starts typing
    if (message.type === "error") {
      setMessage({ type: "", text: "" });
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^a-zA-Z\d]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return { text: "", color: "" };
    if (passwordStrength <= 2) return { text: "Weak", color: "text-red-600" };
    if (passwordStrength <= 3)
      return { text: "Fair", color: "text-yellow-600" };
    if (passwordStrength <= 4) return { text: "Good", color: "text-blue-600" };
    return { text: "Strong", color: "text-green-600" };
  };

  const getStrengthBarColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    if (passwordStrength <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    if (!passwordData.currentPassword) {
      setMessage({ type: "error", text: "Current password is required" });
      return false;
    }

    if (!passwordData.newPassword) {
      setMessage({ type: "error", text: "New password is required" });
      return false;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long",
      });
      return false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return false;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setMessage({
        type: "error",
        text: "New password must be different from current password",
      });
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordStrength(0);
    setShowPassword({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/me/password`,
        passwordData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage({ type: "success", text: "Password changed successfully!" });
      resetForm();

      // Auto-clear success message after 5 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    } catch (error) {
      console.error("Error changing password:", error);

      // More detailed error handling
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error changing password. Please try again.";

      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  const strengthLabel = getStrengthLabel();

  return (
    <div className="card-glass p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">
            Change Password
          </h2>
          <p className="text-sm text-gray-600">Keep your account secure</p>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-lg flex items-start gap-3 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleChangePassword} className="space-y-6">
        {/* Current Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700">
              Current Password <span className="text-red-500">*</span>
            </label>
            {/* ✅ Forgot Password Link */}
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-brand-primary hover:text-brand-primary/80 flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword.currentPassword ? "text" : "password"}
              value={passwordData.currentPassword}
              onChange={(e) =>
                handleInputChange("currentPassword", e.target.value)
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
              placeholder="Enter current password"
              disabled={saving}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("currentPassword")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              tabIndex={-1}
            >
              {showPassword.currentPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword.newPassword ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
              placeholder="Enter new password"
              disabled={saving}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("newPassword")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              tabIndex={-1}
            >
              {showPassword.newPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {passwordData.newPassword && (
            <div className="space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      level <= passwordStrength
                        ? getStrengthBarColor()
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              {strengthLabel.text && (
                <p className={`text-sm font-medium ${strengthLabel.color}`}>
                  Password Strength: {strengthLabel.text}
                </p>
              )}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <p className="font-semibold mb-1">Password Requirements:</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>At least 6 characters long</li>
              <li>Mix of uppercase and lowercase letters (recommended)</li>
              <li>Include numbers and special characters (recommended)</li>
            </ul>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword.confirmPassword ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
              placeholder="Confirm new password"
              disabled={saving}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirmPassword")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              tabIndex={-1}
            >
              {showPassword.confirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {passwordData.confirmPassword &&
            passwordData.newPassword !== passwordData.confirmPassword && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Passwords do not match
              </p>
            )}
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary-clean px-8 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Changing...
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                Change Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
