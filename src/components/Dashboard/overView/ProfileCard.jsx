import React from "react";
import { Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { User, Building, Eye } from "lucide-react";
import { generateProfileUrl, getTemplateStyles } from "./DashboardUtils";

export default function ProfileCard({ profile }) {
  const isPersonal = profile.profileType === "personal";
  const template = profile.template || "template1";
  const templateStyles = getTemplateStyles(template, profile);

  const profileUrl = generateProfileUrl(profile.name);

  return (
    <Link to={`/dashboard/profiles/${profile.id}`} className="block group">
      <div
        className={`relative w-full h-48 rounded-[24px] shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl hover:scale-[1.02] ${templateStyles.className}`}
        style={{
          ...templateStyles.style,
          ...(templateStyles.borderColor && {
            borderColor: templateStyles.borderColor,
          }),
        }}
      >
        {/* Background overlay */}
        {templateStyles.overlay && (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${templateStyles.overlay}`}
          />
        )}

        {/* Content */}
        <div
          className={`relative z-10 h-full flex flex-col justify-between px-5 py-4 ${templateStyles.textColor}`}
        >
          {/* Header with logo/avatar */}
          <div className="flex items-center gap-3">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="avatar"
                className={`w-12 h-12 ${
                  isPersonal ? "rounded-full" : "rounded-lg"
                } border-2 border-white/80 object-cover shadow-lg`}
              />
            ) : (
              <div
                className={`w-12 h-12 flex items-center justify-center text-xl bg-white/20 border-white/40 text-white border-2 ${
                  isPersonal ? "rounded-full" : "rounded-lg"
                } shadow-lg backdrop-blur-sm`}
              >
                {isPersonal ? (
                  <User className="w-6 h-6" />
                ) : (
                  <Building className="w-6 h-6" />
                )}
              </div>
            )}

            <div>
              <p className="text-sm font-semibold opacity-90">Dot LinkMe</p>
              <p className="text-xs opacity-70">Smart NFC Digital Identity</p>
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-0.5">
            <h3 className="text-lg font-bold tracking-tight">
              {profile.name || (isPersonal ? "Your Name" : "Company Name")}
            </h3>
            <p className="text-xs opacity-85">
              {profile.title ||
                (isPersonal ? "Your role or title" : "Your industry")}
            </p>
            <p className="text-[11px] mt-1 line-clamp-2 opacity-75">
              {profile.bio ||
                "This is a preview of your smart identity card. Add a short bio or description here."}
            </p>
          </div>

          {/* Footer with tags and QR */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-[10px]">
              <span className="px-2 py-1 rounded-full bg-black/15 text-white opacity-80">
                {isPersonal ? "Personal" : "Business"}
              </span>
              <span className="px-2 py-1 rounded-full flex items-center gap-1 bg-black/15 text-white opacity-80">
                <Eye className="w-3 h-3" />
                {profile.viewCount || 0}
              </span>
            </div>

            <div className="bg-white rounded-md p-1 shadow-lg">
              <QRCodeCanvas value={profileUrl} size={40} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
