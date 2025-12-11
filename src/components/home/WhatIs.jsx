import React from "react";
import { Zap, UserCircle, BarChart2 } from "lucide-react";

const WhatIs = () => {
  return (
    <section
      data-aos="fade-up"
      className="py-20 bg-white text-brand-dark overflow-hidden"
    >
      <div className="section-shell grid md:grid-cols-2 gap-8 md:gap-14 items-center">
        {/* ---------- RIGHT SIDE (TEXT AREA) ---------- */}
        <div className="space-y-6 order-2 md:order-1 px-4 md:px-0">
          <h2 className="text-3xl md:text-4xl font-semibold leading-snug">
            What is{" "}
            <span className="font-bold text-brand-primary whitespace-nowrap">
              <span className="inline-block w-2 h-2 sm:w-2 sm:h-2 md:w-2 md:h-2 bg-[#f2a91d] rounded-full translate-y-[2px]"></span>
              LinkMe?
            </span>

          </h2>

          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            LinkMe is a modern digital identity platform that lets you share your entire profile—links,
            contact details, and personal branding—instantly through smart links, QR codes,
            and optional NFC cards. With a clean, dynamic interface, LinkMe makes networking faster,
            smarter, and more professional.

          </p>

          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            The platform gives you full control over your identity,
            allowing you to update your profile anytime and view basic analytics
            that help you understand how people interact with your digital presence.
          </p>
        </div>

        {/* ---------- LEFT SIDE (ICON CARDS) ---------- */}
        <div className="space-y-4 md:space-y-6 order-1 md:order-2 px-4 md:px-0">
          <div
            data-aos="fade-left"
            data-aos-duration="600"
            className="card-glass p-4 md:p-6 flex gap-3 md:gap-4 items-start"
          >
            <Zap
              size={36}
              className="text-brand-primary flex-shrink-0 md:w-[42px] md:h-[42px]"
            />
            <div>
              <h3 className="text-lg md:text-xl font-semibold">
                One-Tap Sharing
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Share your info instantly via NFC, QR, or smart link.
              </p>
            </div>
          </div>

          <div
            data-aos="fade-left"
            data-aos-delay="150"
            data-aos-duration="600"
            className="card-glass p-4 md:p-6 flex gap-3 md:gap-4 items-start"
          >
            <UserCircle
              size={36}
              className="text-brand-primary flex-shrink-0 md:w-[42px] md:h-[42px]"
            />
            <div>
              <h3 className="text-lg md:text-xl font-semibold">
                Profile Page
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Your bio, links, and contact details in one place.
              </p>
            </div>
          </div>

          <div
            data-aos="fade-left"
            data-aos-delay="300"
            data-aos-duration="600"
            className="card-glass p-4 md:p-6 flex gap-3 md:gap-4 items-start"
          >
            <BarChart2
              size={36}
              className="text-brand-primary flex-shrink-0 md:w-[42px] md:h-[42px]"
            />
            <div>
              <h3 className="text-lg md:text-xl font-semibold">
                Analytics
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                See visits and clicks in real time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIs;
