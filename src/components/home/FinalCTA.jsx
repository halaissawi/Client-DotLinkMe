import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Star, Shield, Zap } from "lucide-react";

const FinalCTA = () => {
  return (
    <section
      data-aos="fade-up"
      className="relative py-16 sm:py-20 md:py-28 bg-gradient-to-br from-white via-[#f0f5ff] to-[#e6f0ff] overflow-hidden"
    >
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#0066ff]/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#f2a91d]/15 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0066ff]/8 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Enhanced BIG background text */}
      <h1
        className="
          absolute top-1/2 left-1/2 
          -translate-x-1/2 -translate-y-1/2
          text-[35px] sm:text-[60px] md:text-[90px] lg:text-[120px]
          font-extrabold tracking-wider
          text-[#0066ff]/12
          select-none pointer-events-none
          whitespace-nowrap
        "
      >
        START NOW
      </h1>

      <div className="section-shell relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Badge - Enhanced */}
        <div
          data-aos="zoom-in"
          data-aos-duration="500"
          className="inline-flex items-center gap-2 px-4 py-2.5 mb-5 sm:mb-6 bg-white/90 backdrop-blur-md border border-[#0066ff]/30 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <Sparkles size={16} className="text-[#f2a91d]" />
          <span className="text-xs sm:text-sm font-semibold text-[#0b0f19]">
            Join Thousands of Smart Networkers
          </span>
        </div>

        {/* Title - More compact on mobile */}
        <h2
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0b0f19] leading-tight mb-4 sm:mb-5"
        >
          Start Your Smart Identity <br className="hidden sm:block" />
          <span className="relative inline-block mt-1 sm:mt-0">
            <span className="text-[#0066ff]">in Seconds</span>
            <span className="absolute -bottom-0.5 sm:-bottom-1 left-0 w-full h-1 sm:h-1.5 bg-gradient-to-r from-[#f2a91d]/60 via-[#f2a91d]/80 to-[#f2a91d]/60 rounded-full"></span>
          </span>
        </h2>

        {/* Subtitle - More compact */}
        <p
          data-aos="fade-up"
          data-aos-delay="200"
          className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 px-4"
        >
          Build your digital profile and share it anywhere with just one tap.
          <br className="hidden sm:block" />
          <span className="block sm:inline text-gray-500 mt-1 sm:mt-0">
            No apps, no hassle — just instant connections.
          </span>
        </p>

        {/* Buttons Group - Enhanced */}
        <div
          data-aos="fade-up"
          data-aos-delay="300"
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          <Link
            to="/create-card"
            className="
              group relative inline-flex items-center justify-center gap-2
              px-6 py-3 sm:px-8 sm:py-4
              text-sm sm:text-base font-bold
              bg-[#0066ff] text-white rounded-xl
              shadow-[0_8px_30px_rgba(0,102,255,0.3)]
              hover:shadow-[0_12px_40px_rgba(0,102,255,0.4)]
              hover:scale-105 hover:-translate-y-0.5
              transition-all duration-300
              overflow-hidden
              w-full sm:w-auto
            "
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#0066ff] to-[#0052cc] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles size={18} />
              Get Started Now
            </span>
            <ArrowRight
              size={18}
              className="relative z-10 group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>

          <Link
            to="/products"
            className="
              inline-flex items-center justify-center gap-2
              px-6 py-3 sm:px-8 sm:py-4
              text-sm sm:text-base font-semibold
              bg-white text-[#0066ff] border-2 border-[#0066ff]/30 rounded-xl
              hover:bg-[#0066ff]/5 hover:border-[#0066ff]/60
              hover:scale-105
              transition-all duration-300
              shadow-sm hover:shadow-md
              w-full sm:w-auto
            "
          >
            View Products
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Trust Indicators - Enhanced with better styling */}
        <div
          data-aos="fade-up"
          data-aos-delay="400"
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600"
        >
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-[#f2a91d]/10 flex items-center justify-center group-hover:bg-[#f2a91d]/20 transition-colors">
              <Star size={16} className="text-[#f2a91d]" />
            </div>
            <span className="font-medium group-hover:text-gray-900 transition-colors">
              No Setup Fees
            </span>
          </div>
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-[#0066ff]/10 flex items-center justify-center group-hover:bg-[#0066ff]/20 transition-colors">
              <Shield size={16} className="text-[#0066ff]" />
            </div>
            <span className="font-medium group-hover:text-gray-900 transition-colors">
              Secure & Private
            </span>
          </div>
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-[#f2a91d]/10 flex items-center justify-center group-hover:bg-[#f2a91d]/20 transition-colors">
              <Zap size={16} className="text-[#f2a91d]" />
            </div>
            <span className="font-medium group-hover:text-gray-900 transition-colors">
              Instant Activation
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
