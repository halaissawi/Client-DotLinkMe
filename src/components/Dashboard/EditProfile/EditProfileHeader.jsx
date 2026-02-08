import React from "react";
import { ArrowLeft, ExternalLink, Share2, Sparkles } from "lucide-react";

export default function EditProfileHeader({ profile, onBack, onCopyLink }) {
  return (
    <div className="relative overflow-hidden pb-4">
      {/* Background decoration with blob animation */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#0066ff]/5 rounded-full blur-3xl -z-10 pointer-events-none animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#f2a91d]/5 rounded-full blur-3xl -z-10 pointer-events-none animate-blob animation-delay-2000"></div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 px-4 sm:px-0">
        {/* Left Section */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 fade-up">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex-shrink-0 p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-300 group border border-transparent hover:border-[#0066ff]/20 animate-logo"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-[#0066ff] group-hover:scale-110 transition-all duration-300" />
          </button>

          {/* Title Section */}
          <div className="flex-1 min-w-0 space-y-2 animate-logo-delay">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0066ff]/10 rounded-full border border-[#0066ff]/20">
              <Sparkles size={12} className="text-[#0066ff]" />
              <span className="text-xs font-semibold text-[#0066ff] uppercase tracking-wide">
                Edit Mode
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-[#0066ff] to-[#0052cc] bg-clip-text text-transparent">
                Edit Profile
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-600 truncate">
              {profile.name}
            </p>
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 fade-strong">
          {/* View Live Button */}
          <a
            href={profile.type === "user-product" ? `/u/p/${profile.id}` : `/u/${profile.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial group relative overflow-hidden px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white border-2 border-[#0066ff]/30 hover:border-[#0066ff]/50 text-[#0066ff] font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span className="absolute inset-0 bg-[#0066ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <ExternalLink className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <span className="relative z-10 text-sm sm:text-base">
              View Live
            </span>
          </a>

          {/* Share Button */}
          <button
            onClick={() => onCopyLink(profile.profileUrl)}
            className="flex-1 sm:flex-initial group relative overflow-hidden px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#0066ff] to-[#0052cc] text-white font-semibold shadow-[0_4px_20px_rgba(0,102,255,0.3)] hover:shadow-[0_6px_25px_rgba(0,102,255,0.4)] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#0052cc] to-[#0066ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <Share2 className="w-4 h-4 relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            <span className="relative z-10 text-sm sm:text-base">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
