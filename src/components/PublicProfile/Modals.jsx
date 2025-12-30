import React from "react";
import {
  X,
  Copy,
  MessageCircle,
  Twitter,
  Facebook,
  Linkedin,
  Share2,
} from "lucide-react";

export default function ShareModal({
  isOpen,
  onClose,
  onShare,
  themeColor = "#3B82F6", // ✅ Added themeColor prop with blue default
}) {
  if (!isOpen) return null;

  const shareOptions = [
    { id: "copy", name: "Copy Link", icon: <Copy className="w-5 h-5" /> },
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: <MessageCircle className="w-5 h-5" />,
    },
    { id: "twitter", name: "Twitter", icon: <Twitter className="w-5 h-5" /> },
    {
      id: "facebook",
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
    },
  ];

  const hasNativeShare = navigator.share !== undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Share Profile</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* ✅ Native share button with dynamic color */}
          {hasNativeShare && (
            <button
              onClick={() => onShare("native")}
              className="w-full mb-4 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: themeColor }}
            >
              <Share2 className="w-5 h-5" />
              Share via...
            </button>
          )}

          <div className="space-y-2">
            {shareOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onShare(option.id)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-left group"
              >
                {/* ✅ Icon container with dynamic color on hover */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: "white",
                  }}
                >
                  <span
                    className="group-hover:scale-110 transition-transform"
                    style={{ color: themeColor }}
                  >
                    {option.icon}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {option.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
