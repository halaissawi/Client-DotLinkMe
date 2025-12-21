import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Calendar,
  Mail,
  Phone,
  Save,
  Loader2,
  Edit2,
} from "lucide-react";
import ChangeEmailModal from "./ChangeEmailModal";

export default function ProfileSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showEmailModal, setShowEmailModal] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setMessage({ type: "error", text: "Failed to fetch user data" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/me`,
        {
          firstName: user.firstName,
          secondName: user.secondName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          dateOfBirth: user.dateOfBirth,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error updating profile",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEmailChanged = (updatedUser) => {
    setUser(updatedUser);
    setMessage({ type: "success", text: "Email updated successfully!" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="card-glass p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Header - Responsive */}
        <div className="flex items-center gap-2 sm:gap-3 border-b border-gray-200 pb-3 sm:pb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-brand-primary to-purple-600 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-brand-dark truncate">
              Profile Settings
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 truncate">
              Update your personal information
            </p>
          </div>
        </div>

        {/* Message Alert - Responsive */}
        {message.text && (
          <div
            className={`p-3 sm:p-4 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form - Fully Responsive */}
        <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-6">
          {/* Grid - Single column on mobile, 2 columns on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* First Name */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={user?.firstName || ""}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                placeholder="Enter your first name"
              />
            </div>

            {/* Second Name */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                Second Name
              </label>
              <input
                type="text"
                value={user?.secondName || ""}
                onChange={(e) =>
                  handleInputChange("secondName", e.target.value)
                }
                className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                placeholder="Enter your second name"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={user?.lastName || ""}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                placeholder="Enter your last name"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1.5 sm:gap-2">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Phone Number
              </label>
              <input
                type="tel"
                value={user?.phoneNumber || ""}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                placeholder="+962 XX XXX XXXX"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1.5 sm:gap-2">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Date of Birth
              </label>
              <input
                type="date"
                value={user?.dateOfBirth || ""}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Email Address - Full width on all screens */}
            <div className="space-y-1.5 sm:space-y-2 md:col-span-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1.5 sm:gap-2">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="flex-1 border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm bg-gray-50 cursor-not-allowed min-w-0"
                  placeholder="your@email.com"
                />
                <button
                  type="button"
                  onClick={() => setShowEmailModal(true)}
                  className="px-4 py-2.5 sm:py-3 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium"
                >
                  <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Change Email
                </button>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500">
                Click "Change Email" to update with verification
              </p>
            </div>
          </div>

          {/* Account Created Info - Responsive */}
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600">
              <span className="font-semibold">Account Created:</span>{" "}
              <span className="block sm:inline mt-1 sm:mt-0">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </span>
            </p>
          </div>

          {/* Submit Button - Responsive */}
          <div className="flex justify-end pt-3 sm:pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary-clean w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform text-sm sm:text-base font-medium"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <ChangeEmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        currentEmail={user?.email || ""}
        onEmailChanged={handleEmailChanged}
      />
    </>
  );
}
