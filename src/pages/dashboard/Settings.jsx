import React from "react";
import { Settings as SettingsIcon } from "lucide-react";
import ProfileSettings from "../../components/Dashboard/Profile/ProfileSettings";
import PasswordSettings from "../../components/Dashboard/Profile/PasswordSettings";

export default function Settings() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary to-purple-600 flex items-center justify-center shadow-lg">
          <SettingsIcon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account preferences and security
          </p>
        </div>
      </div>

      {/* Profile Settings Section */}
      <ProfileSettings />

      {/* Password Settings Section */}
      <PasswordSettings />
    </div>
  );
}
