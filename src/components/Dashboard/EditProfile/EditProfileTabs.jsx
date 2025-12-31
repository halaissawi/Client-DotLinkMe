import React from "react";
import { Edit3, Link as LinkIcon, Settings, Palette } from "lucide-react";

export default function EditProfileTabs({
  activeTab,
  setActiveTab,
  socialLinksCount,
}) {
  const tabs = [
    { id: "basic", label: "Basic Info", icon: Edit3 },
    { id: "design", label: "Design", icon: Palette }, // 🆕 NEW TAB
    {
      id: "links",
      label: "Social Links",
      icon: LinkIcon,
      count: socialLinksCount,
    },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-full px-4 sm:px-0 fade-up">
      {/* Desktop/Tablet Tabs */}
      <div
        className="hidden sm:inline-flex p-2 rounded-xl border border-gray-200 bg-white gap-2 animate-logo"
        style={{
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        }}
      >
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative px-4 md:px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 overflow-hidden ${
                isActive
                  ? "bg-gradient-to-r from-[#0066ff] to-[#0052cc] text-white shadow-lg scale-105"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#0066ff]"
              }`}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Active background glow */}
              {isActive && (
                <span className="absolute inset-0 bg-gradient-to-r from-[#0052cc] to-[#0066ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              )}

              <Icon
                className={`w-4 h-4 relative z-10 transition-transform duration-300 ${
                  isActive ? "" : "group-hover:scale-110"
                }`}
              />

              <span className="relative z-10 text-sm md:text-base whitespace-nowrap">
                {tab.label}
              </span>

              {tab.count !== undefined && (
                <span
                  className={`relative z-10 px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#0066ff]/10 text-[#0066ff] group-hover:bg-[#0066ff]/20"
                  }`}
                >
                  {tab.count}
                </span>
              )}

              {/* Bottom indicator for active tab */}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f2a91d] rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Tabs - Full Width Stacked */}
      <div className="sm:hidden flex flex-col gap-2 animate-logo">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative w-full px-4 py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 overflow-hidden ${
                isActive
                  ? "bg-gradient-to-r from-[#0066ff] to-[#0052cc] text-white shadow-lg border-2 border-[#0066ff]"
                  : "bg-white text-gray-700 hover:bg-gray-50 hover:text-[#0066ff] border-2 border-gray-200 hover:border-[#0066ff]/30"
              }`}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Icon container */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? "bg-white/20"
                    : "bg-[#0066ff]/10 group-hover:bg-[#0066ff]/20"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Label and count */}
              <div className="flex-1 flex items-center justify-between">
                <span className="text-base">{tab.label}</span>

                {tab.count !== undefined && (
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[#0066ff]/10 text-[#0066ff] group-hover:bg-[#0066ff]/20"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </div>

              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f2a91d] rounded-r-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
