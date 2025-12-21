import React from "react";
import { getTemplateStyles } from "../../../utils/cardUtils";

export default function CardPreview({ profile, currentDesign }) {
  const templateStyles = getTemplateStyles(currentDesign.template, {
    ...profile,
    color: currentDesign.color,
    designMode: currentDesign.designMode, // لازم تكون "template"
    aiBackground: currentDesign.aiBackground,
    uploadedImage: currentDesign.uploadedImage,
  });

  return (
    <div
      className={`relative w-full h-44 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${templateStyles.className}`}
      style={{
        ...templateStyles.style,
        ...(templateStyles.borderColor && {
          borderColor: templateStyles.borderColor,
        }),
      }}
    >
      {templateStyles.overlay && (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${templateStyles.overlay}`}
        />
      )}

      <div
        className={`relative z-10 h-full flex flex-col justify-between px-4 py-3 ${templateStyles.textColor}`}
      >
        <div>
          <p className="text-xs font-semibold opacity-90">.LinkMe</p>     
          <p className="text-[10px] opacity-70">Smart NFC Digital Identity</p>
        </div>
      </div>
    </div>
  );
}
