import React, { useState, useEffect } from "react";
import {
  Settings,
  Copy,
  Link as LinkIcon,
  User,
  Calendar,
  Bell,
  Trash2,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // ✅ Add
import { useAuth } from "../../../context/AuthContext"; // ✅ Add
import TemplateSelector from "../../PublicProfile/TemplateSelector";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function SettingsTab({ profile, onCopyLink, onAccountDeleted }) {
  const navigate = useNavigate(); // ✅ Add
  const { logout } = useAuth(); // ✅ Add
  const [notifications, setNotifications] = useState({
    emailNotifications: profile?.emailNotifications ?? true,
    profileViews: profile?.profileViews ?? true,
    newContacts: profile?.newContacts ?? true,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fix: Use /u/ route for public profile
  const profileUrl = `${window.location.origin}/u/${profile.slug}`;
  // NEW - CORRECT:
  const [selectedTemplate, setSelectedTemplate] = useState(
    profile.pageTemplate || "modern" // ✅ Use PAGE template
  );
  const [selectedColor, setSelectedColor] = useState(
    profile.pageColor || "#0EA5E9" // ✅ Use PAGE color
  );
  // Add this function to update the profile
  const updateProfile = async (updates) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `${API_URL}/api/profiles/${profile.id}`, // ADD /api HERE
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!", {
          duration: 2000,
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile", {
        duration: 3000,
        position: "top-center",
      });
    }
  };
  // NEW - CORRECT:
  const handleTemplateChange = async (templateId) => {
    setSelectedTemplate(templateId);
    await updateProfile({ pageTemplate: templateId }); // ✅ Save to pageTemplate
  };

  const handleColorChange = async (color) => {
    setSelectedColor(color);
    await updateProfile({ pageColor: color }); // ✅ Save to pageColor
  };
  // Update local state when profile prop changes
  useEffect(() => {
    if (profile) {
      setNotifications({
        emailNotifications: profile.emailNotifications ?? true,
        profileViews: profile.profileViews ?? true,
        newContacts: profile.newContacts ?? true,
      });
    }
  }, [profile]);

  const handleCopyLink = () => {
    onCopyLink(profileUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleNotificationChange = async (key) => {
    const newValue = !notifications[key];

    // Optimistic update
    setNotifications((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `${API_URL}/profiles/${profile.id}/notifications`,
        {
          [key]: newValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Notification preferences updated", {
          duration: 2000,
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Failed to update notification settings:", error);

      // Revert on error
      setNotifications((prev) => ({
        ...prev,
        [key]: !newValue,
      }));

      toast.error(
        error.response?.data?.message ||
          "Failed to update notification settings",
        {
          duration: 3000,
          position: "top-center",
        }
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation.toLowerCase() !== "delete") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    setIsDeleting(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(`${API_URL}/auth/delete-account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          confirmation: deleteConfirmation,
        },
      });

      if (response.data.success) {
        toast.success("Account deleted successfully");

        // Close modal
        setShowDeleteModal(false);
        setDeleteConfirmation("");

        // ✅ IMPORTANT: Call logout to clear everything
        await logout();

        // ✅ Navigate and force reload to reset app state
        setTimeout(() => {
          window.location.href = "/"; // Force full page reload
        }, 1000);
      }
    } catch (error) {
      console.error("Account deletion failed:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete account. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-6"
      style={{
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      }}
    >
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">
            Profile Settings
          </h2>
          <p className="text-sm text-gray-600">
            Manage your profile and preferences
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Profile URL
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={profileUrl}
              readOnly
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 cursor-default focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-3 whitespace-nowrap flex items-center justify-center gap-2 rounded-xl transition-all ${
                copiedUrl ? "bg-green-500 text-white" : "btn-ghost-clean"
              }`}
              title="Copy URL"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Share this link to let people view your profile
          </p>
        </div>

        {/* Profile Slug */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile Slug
          </label>
          <div className="px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm font-mono">
            {profile.slug}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This is your unique profile identifier
          </p>
        </div>

        {/* Profile Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Profile Type
          </label>
          <div className="px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm capitalize flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                profile.profileType === "personal"
                  ? "bg-blue-500"
                  : "bg-purple-500"
              }`}
            ></span>
            {profile.profileType === "personal"
              ? "Personal Profile"
              : "Business Profile"}
          </div>
        </div>

        {/* Created Date */}
        {profile.createdAt && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Profile Created
            </label>
            <div className="px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm">
              {new Date(profile.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        )}

        {/* Notification Preferences */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notification Preferences
            {isSaving && (
              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
            )}
          </label>
          <div className="space-y-3 border border-gray-200 rounded-xl p-4 bg-gray-50">
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Email Notifications
                </p>
                <p className="text-xs text-gray-500">
                  Receive updates via email
                </p>
              </div>
              <button
                onClick={() => handleNotificationChange("emailNotifications")}
                disabled={isSaving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.emailNotifications
                    ? "bg-purple-600"
                    : "bg-gray-300"
                } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.emailNotifications
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Profile Views */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Profile View Alerts
                </p>
                <p className="text-xs text-gray-500">
                  Get notified when someone views your profile
                </p>
              </div>
              <button
                onClick={() => handleNotificationChange("profileViews")}
                disabled={isSaving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.profileViews ? "bg-purple-600" : "bg-gray-300"
                } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.profileViews
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* New Contacts */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  New Contact Notifications
                </p>
                <p className="text-xs text-gray-500">
                  Alert when someone saves your contact info
                </p>
              </div>
              <button
                onClick={() => handleNotificationChange("newContacts")}
                disabled={isSaving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.newContacts ? "bg-purple-600" : "bg-gray-300"
                } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.newContacts
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800 font-medium mb-2">
            ℹ️ Profile Information
          </p>
          <ul className="text-sm text-blue-700 space-y-1 ml-4 list-disc">
            <li>Your profile URL is permanent and cannot be changed</li>
            <li>Share your profile link to connect with others</li>
            <li>All changes to your profile are saved automatically</li>
          </ul>
        </div>

        {/* Danger Zone */}
        <div className="border-2 border-red-200 rounded-xl p-4 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 mb-1">
                Danger Zone
              </h3>
              <p className="text-sm text-red-700 mb-3">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
      <TemplateSelector
        selectedTemplate={selectedTemplate}
        selectedColor={selectedColor}
        onTemplateChange={handleTemplateChange}
        onColorChange={handleColorChange}
      />
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Delete Account?
              </h3>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              This action cannot be undone. This will permanently delete your
              account, profile, and all associated data including:
            </p>

            <ul className="text-sm text-gray-600 mb-4 ml-4 list-disc space-y-1">
              <li>Your profile and all personal information</li>
              <li>All social links and connections</li>
              <li>Analytics and visitor data</li>
              <li>Orders and NFC card designs</li>
            </ul>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="font-bold">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="DELETE"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={isDeleting}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation("");
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={
                  deleteConfirmation.toLowerCase() !== "delete" || isDeleting
                }
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Account"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
