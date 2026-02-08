import React from "react";
import { Zap, UserCircle, BarChart2 } from "lucide-react";

const WhatIs = () => {
  return (
    <section
      data-aos="fade-up"
      className="py-20 bg-white text-brand-dark overflow-hidden relative"
    >
      <div className="section-shell grid md:grid-cols-2 gap-8 md:gap-14 items-center">
        {/* ---------- RIGHT SIDE (TEXT AREA) ---------- */}
        <div className="space-y-6 order-2 md:order-1 px-4 md:px-0">
          <div>
            <span className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-semibold mb-4">
              About LinkMe
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-snug">
              What is{" "}
              <span className="relative inline-block">
                <span className="font-bold text-brand-primary whitespace-nowrap">
                  <span className="inline-block w-2 h-2 sm:w-2 sm:h-2 md:w-2 md:h-2 bg-[#f2a91d] rounded-full translate-y-[2px]"></span>
                  LinkMe?
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-brand-accent/40 via-brand-accent to-transparent rounded-full"></span>
              </span>
            </h2>
          </div>

          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            LinkMe is a modern digital identity platform that lets you share
            your entire profile—links, contact details, and personal
            branding—instantly through smart links, QR codes, and optional NFC
            cards. With a clean, dynamic interface, LinkMe makes networking
            faster, smarter, and more professional.
          </p>

          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            The platform gives you full control over your identity, allowing you
            to update your profile anytime and view basic analytics that help
            you understand how people interact with your digital presence.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center p-4 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 rounded-xl border border-brand-primary/10">
              <div className="text-2xl md:text-3xl font-bold text-brand-primary">
                10k+
              </div>
              <div className="text-xs md:text-sm text-gray-600">
                Active Users
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 rounded-xl border border-brand-primary/10">
              <div className="text-2xl md:text-3xl font-bold text-brand-primary">
                50k+
              </div>
              <div className="text-xs md:text-sm text-gray-600">
                Cards Shared
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 rounded-xl border border-brand-primary/10">
              <div className="text-2xl md:text-3xl font-bold text-brand-primary">
                99%
              </div>
              <div className="text-xs md:text-sm text-gray-600">
                Satisfaction
              </div>
            </div>
          </div>
        </div>

        {/* ---------- LEFT SIDE (ICON CARDS WITH 3D EFFECT) ---------- */}
        <div className="space-y-4 md:space-y-6 order-1 md:order-2 px-4 md:px-0">
          <div
            data-aos="fade-left"
            data-aos-duration="600"
            className="group relative card-glass p-5 md:p-7 flex gap-4 md:gap-5 items-start transform hover:scale-105 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 via-brand-accent/0 to-brand-primary/0 group-hover:from-yellow-400/10 group-hover:via-brand-accent/10 group-hover:to-brand-primary/10 transition-all duration-500"></div>

            <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-brand-accent to-yellow-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
              <Zap className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-brand-primary transition-colors">
                One-Tap Sharing
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Share your info instantly via NFC, QR, or smart link. No apps,
                no friction.
              </p>
            </div>
          </div>

          <div
            data-aos="fade-left"
            data-aos-delay="150"
            data-aos-duration="600"
            className="group relative card-glass p-5 md:p-7 flex gap-4 md:gap-5 items-start transform hover:scale-105 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-brand-primary/0 to-purple-400/0 group-hover:from-blue-400/10 group-hover:via-brand-primary/10 group-hover:to-purple-400/10 transition-all duration-500"></div>

            <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-brand-primary to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
              <UserCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-brand-primary transition-colors">
                Beautiful Profile Page
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Your bio, links, and contact details in one stunning place.
              </p>
            </div>
          </div>

          <div
            data-aos="fade-left"
            data-aos-delay="300"
            data-aos-duration="600"
            className="group relative card-glass p-5 md:p-7 flex gap-4 md:gap-5 items-start transform hover:scale-105 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 via-emerald-400/0 to-teal-400/0 group-hover:from-green-400/10 group-hover:via-emerald-400/10 group-hover:to-teal-400/10 transition-all duration-500"></div>

            <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
              <BarChart2 className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-brand-primary transition-colors">
                Real-Time Analytics
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                See visits, clicks, and engagement in real time. Know your
                reach.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIs;
