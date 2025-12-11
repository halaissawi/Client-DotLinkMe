import React from "react";
import { User, Briefcase } from "lucide-react";

const PROFILE_TYPES = [
  {
    id: "personal",
    label: "Personal Profile",
    icon: <User className="w-4 h-4" />,
    description: "For individual use",
  },
  {
    id: "business",
    label: "Business Profile",
    icon: <Briefcase className="w-4 h-4" />,
    description: "For companies",
  },
];

export default function ProfileTypeSwitch({ profileType, onSwitch }) {
  return (
    <div
      className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-10"
      data-aos="fade-up"
      role="group"
      aria-label="Profile type selection"
    >
      {PROFILE_TYPES.map((type) => {
        const isActive = profileType === type.id;

        return (
          <button
            key={type.id}
            type="button"
            onClick={() => onSwitch(type.id)}
            className={`
              btn-ghost-clean px-6 sm:px-8 py-3 rounded-2xl text-sm sm:text-base 
              transition-all flex items-center gap-2 justify-center
              min-w-[180px] sm:min-w-0 flex-1 sm:flex-initial
              ${
                isActive
                  ? "bg-brand-primary text-white border-brand-primary shadow-lg hover:shadow-xl hover:scale-105"
                  : "hover:border-brand-primary/40 hover:bg-brand-primary/5"
              }
            `}
            aria-pressed={isActive}
            aria-label={`${type.label} - ${type.description}`}
          >
            <span className="flex-shrink-0">{type.icon}</span>
            <span className="font-medium">{type.label}</span>
          </button>
        );
      })}
    </div>
  );
}
