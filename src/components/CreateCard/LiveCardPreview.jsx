import React, { useState } from "react";
import { Zap, User, Briefcase } from "lucide-react";
import { CARD_TEMPLATES } from "../../constants/cardTemplates";
import UniversalCardPreview from "../shared/UniversalCardPreview";

export default function LiveCardPreview({
  profileType,
  currentProfile,
  selectedTemplate,
}) {
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  return (
    <>
      {/* DESKTOP MODE - STICKY */}
      <div
        className="
          hidden lg:block
          w-full space-y-6 lg:sticky lg:top-28 lg:flex-[1] min-w-0
        "
        data-aos="fade-left"
      >
        <DesktopPreview
          profileType={profileType}
          currentProfile={currentProfile}
          selectedTemplate={selectedTemplate}
        />
      </div>

      {/* MOBILE PREVIEW BUTTON */}
      <button
        onClick={() => setShowMobilePreview(true)}
        className="
          lg:hidden fixed bottom-6 left-6 z-50
          group transition-all duration-300 hover:scale-110
        "
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[#0066ff]/20 rounded-full blur-xl animate-blob"></div>
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-[#0066ff] to-[#0052cc] rounded-full shadow-lg flex items-center justify-center">
            <span className="text-white text-[10px] sm:text-xs font-semibold">
              Preview
            </span>
          </div>
        </div>
      </button>

      {/* MOBILE PREVIEW MODAL */}
      {showMobilePreview && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:hidden"
          onClick={() => setShowMobilePreview(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <UniversalCardPreview
              profile={currentProfile}
              profileType={profileType}
              selectedTemplate={selectedTemplate}
            />
          </div>
        </div>
      )}
    </>
  );
}

function DesktopPreview({ profileType, currentProfile, selectedTemplate }) {
  const currentTemplate = CARD_TEMPLATES[selectedTemplate];
  const templateName = currentTemplate?.name || selectedTemplate;

  return (
    <>
      <div className="card-glass p-6 border-2 border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold text-brand-primary uppercase tracking-wide flex items-center gap-1">
              <Zap className="w-4 h-4" /> Live Preview
            </p>
            <p className="text-sm text-gray-500">Real-time card preview</p>
          </div>

          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-brand-primary/10 to-purple-500/10 text-[11px] font-medium border border-brand-primary/20">
            {profileType === "personal" ? (
              <User className="w-4 h-4" />
            ) : (
              <Briefcase className="w-4 h-4" />
            )}
          </span>
        </div>

        {/* Show current design mode */}
        <div className="mb-4 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 shadow-sm">
            <span className="text-xs font-medium text-gray-700">
              {currentProfile.customDesignUrl
                ? "Custom Design"
                : currentProfile.aiBackground
                ? "AI Generated"
                : currentProfile.designMode === "template" && selectedTemplate
                ? `Template: ${templateName}`
                : "Manual Color"}
            </span>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <UniversalCardPreview
            profile={currentProfile}
            profileType={profileType}
            selectedTemplate={selectedTemplate}
          />
        </div>
      </div>

      <div className="card-glass p-4 text-xs text-gray-600 border-2 border-gray-100">
        <ul className="space-y-1 pl-1">
          <li>• Changes update in real-time on the preview</li>
          <li>• Choose from ready templates for quick setup</li>
          <li>• Upload custom design for unique appearance</li>
          <li>• Use AI design for auto-generated backgrounds</li>
        </ul>
      </div>
    </>
  );
}
