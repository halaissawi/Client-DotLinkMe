import React from "react";
import { Hand, Sparkles, TrendingUp } from "lucide-react";

export default function DashboardHeader({ userName }) {
  return (
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066ff]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#f2a91d]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* ===== SMALL MOBILE ICONS (ONLY ON MOBILE) ===== */}
      <div className="absolute top-3 right-3 flex sm:hidden gap-2 z-20">
        {/* Small Box 1 */}
        <div className="w-10 h-10 rounded-xl bg-[#0066ff]/10 flex items-center justify-center border border-[#0066ff]/20">
          <TrendingUp size={18} className="text-[#0066ff]" />
        </div>

        {/* Small Box 2 */}
        <div className="w-10 h-10 rounded-xl bg-[#f2a91d]/10 flex items-center justify-center border border-[#f2a91d]/20">
          <Sparkles size={18} className="text-[#f2a91d]" />
        </div>
      </div>
      {/* ============================================ */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 px-4 sm:px-6 lg:px-0">
        {/* Left Content */}
        <div className="space-y-3">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0066ff]/10 rounded-full border border-[#0066ff]/20">
            <Sparkles size={14} className="text-[#0066ff]" />
            <span className="text-xs font-semibold text-[#0066ff] uppercase tracking-wide">
              Dashboard
            </span>
          </div>

          {/* Welcome Message */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0b0f19] leading-tight">
            <span className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="bg-gradient-to-r from-[#0066ff] to-[#0052cc] bg-clip-text text-transparent">
                Welcome back,
              </span>
              <span className="relative inline-block">
                <span className="text-[#f2a91d]">{userName}!</span>
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-[#f2a91d]/60 via-[#f2a91d] to-[#f2a91d]/60 rounded-full"></span>
              </span>
              <Hand
                className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-[#f2a91d] inline-block animate-wave"
                style={{ transformOrigin: "70% 70%" }}
              />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl leading-relaxed">
            Here's what's happening with your products today
          </p>
        </div>

        {/* Right Content - STATS (HIDDEN ON MOBILE) */}
        <div className="hidden sm:flex flex-wrap sm:flex-nowrap gap-3 sm:gap-4">
          {/* Quick Stat Card 1 */}
          <div className="flex-1 min-w-[140px] bg-gradient-to-br from-white to-[#f0f5ff] rounded-2xl p-4 border border-[#0066ff]/20 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-[#0066ff]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp size={20} className="text-[#0066ff]" />
              </div>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
              Active Status
            </p>
            <p className="text-lg sm:text-xl font-bold text-[#0b0f19]">
              All Good
            </p>
          </div>

          {/* Quick Stat Card 2 */}
          <div className="flex-1 min-w-[140px] bg-gradient-to-br from-white to-[#fff8ed] rounded-2xl p-4 border border-[#f2a91d]/20 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-[#f2a91d]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Sparkles size={20} className="text-[#f2a91d]" />
              </div>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
              Quick Access
            </p>
            <p className="text-lg sm:text-xl font-bold text-[#0b0f19]">Ready</p>
          </div>
        </div>
      </div>
    </div>
  );
}
