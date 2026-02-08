import React from "react";
import {
  CheckCircle2,
  Sparkles,
  Link as LinkIcon,
  QrCode,
  Utensils,
  Layout,
} from "lucide-react";

const STEPS = [
  {
    number: 1,
    title: "Setup restaurant info.",
  },
  {
    number: 2,
    title: "Add menu categories.",
  },
  {
    number: 3,
    title: "Add your delicious items.",
  },
];

const FEATURES = [
  {
    icon: <LinkIcon size={18} className="text-[#0066ff]" />,
    text: "A unique digital menu link",
  },
  {
    icon: <Layout size={18} className="text-[#0066ff]" />,
    text: "Mobile-friendly menu layout",
  },
  {
    icon: <QrCode size={18} className="text-[#0066ff]" />,
    text: "Printable QR for tables",
  },
];

export default function BuildMenuHero() {
  return (
    <section className="relative w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-10 sm:pb-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-[#0066ff]/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-60 sm:w-80 h-60 sm:h-80 bg-[#f2a91d]/5 rounded-full blur-3xl -z-10"></div>

      <div
        className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start lg:items-center"
        data-aos="fade-up"
      >
        {/* Left Content */}
        <div className="w-full flex-1 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f2a91d]/10 rounded-full border border-[#f2a91d]/20">
            <Utensils size={16} className="text-[#f2a91d]" />
            <span className="text-sm font-semibold text-[#f2a91d] uppercase tracking-wide">
              Menu Builder
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0b0f19] leading-tight">
            Build Your{" "}
            <span className="relative inline-block text-[#f2a91d]">
              Digital Menu
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-[#0066ff]/60 via-[#0066ff] to-[#0066ff]/60 rounded-full"></span>
            </span>{" "}
            <br className="hidden sm:block" />
            in Minutes
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-base md:text-lg max-w-2xl leading-relaxed">
            Transform your physical menu into a stunning digital experience. 
            Perfect for restaurants, cafes, and bars looking to modernize their service.
          </p>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 w-full">
            {STEPS.map((step, index) => (
              <div
                key={step.number}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="relative group bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#f2a91d]/30 transition-all duration-300"
              >
                {/* Step number badge */}
                <div className="absolute -top-3 -left-3 w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#f2a91d] to-[#eab308] text-white rounded-full flex items-center justify-center font-bold text-base sm:text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {step.number}
                </div>

                <div className="pt-4">
                  <p className="font-semibold text-sm md:text-base text-[#0b0f19] mb-1">
                    {step.title}
                  </p>
                </div>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#f2a91d] to-[#0066ff] group-hover:w-full transition-all duration-300 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Info Card */}
        <div
          className="w-full lg:w-[420px] max-w-full bg-gradient-to-br from-white to-[#fff9f0] rounded-3xl p-6 md:p-8 border border-[#f2a91d]/10 shadow-xl"
          data-aos="fade-left"
          data-aos-delay="200"
        >
          {/* Header */}
          <div className="flex items-start gap-3 mb-6">
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-[#f2a91d] to-[#eab308] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Sparkles size={22} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0b0f19] mb-1">
                Why Digital?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Benefits of a smart digital menu:
              </p>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-4 mb-6">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-white/60 rounded-xl border border-[#f2a91d]/10 hover:bg-white hover:border-[#f2a91d]/20 transition-all duration-300"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#f2a91d]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pt-1">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="flex items-start gap-2 p-4 bg-[#0066ff]/10 rounded-xl border border-[#0066ff]/20">
            <CheckCircle2
              size={18}
              className="text-[#0066ff] flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-gray-600 leading-relaxed">
              Update prices and items instantly from your smartphone. No more reprints!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
