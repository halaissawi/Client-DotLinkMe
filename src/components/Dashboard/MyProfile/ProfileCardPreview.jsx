import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import UniversalCardPreview from "../../shared/UniversalCardPreview";

export function generateProfileUrl(slug) {
  if (!slug) {
    return "https://www.linkmejo.com/your-smart-identity";
  }
  return `${window.location.origin}/u/${slug}`;
}

export default function ProfileCardPreview({
  profile,
  onShare,
  onToggleQR,
  showQR,
}) {
  const profileUrl = generateProfileUrl(profile.slug);

  return (
    <div className="space-y-3">
      {/* Card */}
      <UniversalCardPreview
        profile={profile}
        selectedTemplate={profile.template}
        showViewCount={true}
      />

      {/* QR Popup */}
      {showQR === profile.id && (
        <div className="p-4 border-2 border-gray-200 rounded-xl bg-white">
          <div className="flex flex-col items-center gap-3">
            <QRCodeCanvas value={profileUrl} size={200} includeMargin />
            <p className="text-xs text-gray-600 break-all text-center">
              {profileUrl}
            </p>
            <button
              onClick={() => onShare(profile)}
              className="text-sm text-brand-primary font-medium hover:underline"
            >
              Copy Profile Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
