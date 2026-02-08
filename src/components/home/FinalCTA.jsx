import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Shield, Zap, CheckCircle } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="relative py-20 sm:py-24 md:py-32 bg-brand-gradient text-white overflow-hidden">
      {/* Curved SVG Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform rotate-180">
        <svg
          className="relative block w-full h-[60px] sm:h-[80px] md:h-[100px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C300,100 900,100 1200,0 L1200,120 L0,120 Z"
            fill="#ffffff"
          />
        </svg>
      </div>

      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 md:w-96 md:h-96 bg-brand-accent/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 md:w-[500px] md:h-[500px] bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 md:w-[600px] md:h-[600px] bg-blue-400/15 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Enhanced BIG background text */}
      <h1
        className="
          absolute top-1/2 left-1/2 
          -translate-x-1/2 -translate-y-1/2
          text-[40px] sm:text-[70px] md:text-[100px] lg:text-[130px]
          font-extrabold tracking-wider
          text-white/5
          select-none pointer-events-none
          whitespace-nowrap
        "
      >
        START NOW
      </h1>

      <div className="section-shell relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <div
          data-aos="zoom-in"
          data-aos-duration="500"
          className="inline-flex items-center gap-2 px-4 py-2.5 mb-6 sm:mb-7 bg-white/15 backdrop-blur-xl border border-white/30 rounded-full shadow-lg hover:bg-white/20 transition-all duration-300"
        >
          <Sparkles size={16} className="text-brand-accent" />
          <span className="text-xs sm:text-sm font-bold text-white">
            Join Thousands of Smart Networkers
          </span>
        </div>

        {/* Title */}
        <h2
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-5 sm:mb-6"
        >
          Start Your Smart Identity <br className="hidden sm:block" />
          <span className="relative inline-block mt-2 sm:mt-0">
            <span className="bg-gradient-to-r from-brand-accent via-yellow-400 to-brand-accent bg-clip-text text-transparent animate-gradient">
              in Seconds
            </span>
            <span className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-1.5 sm:h-2 bg-gradient-to-r from-brand-accent/40 via-brand-accent to-brand-accent/40 blur-sm rounded-full"></span>
          </span>
        </h2>

        {/* Subtitle */}
        <p
          data-aos="fade-up"
          data-aos-delay="200"
          className="text-gray-100 max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed mb-10 sm:mb-12 px-4 opacity-90"
        >
          Build your digital profile and share it anywhere with just one tap.
          <span className="block mt-2 text-white font-semibold">
            No apps, no hassle — just instant connections.
          </span>
        </p>

        {/* Buttons Group */}
        <div
          data-aos="fade-up"
          data-aos-delay="300"
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-10 sm:mb-12"
        >
          <Link
            to="/create-card"
            className="
              group relative inline-flex items-center justify-center gap-2
              px-7 py-4 sm:px-9 sm:py-5
              text-base sm:text-lg font-bold
              bg-gradient-to-r from-brand-accent to-yellow-500 text-white rounded-xl
              shadow-[0_10px_40px_rgba(242,169,29,0.4)]
              hover:shadow-[0_15px_50px_rgba(242,169,29,0.6)]
              hover:scale-105 hover:-translate-y-1
              transition-all duration-300
              overflow-hidden
              w-full sm:w-auto
            "
          >
            <span className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-brand-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles size={20} />
              Get Started Free
            </span>
            <ArrowRight
              size={20}
              className="relative z-10 group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>

          <Link
            to="/products"
            className="
              group inline-flex items-center justify-center gap-2
              px-7 py-4 sm:px-9 sm:py-5
              text-base sm:text-lg font-bold
              bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-xl
              hover:bg-white/20 hover:border-white/50
              hover:scale-105 hover:-translate-y-1
              transition-all duration-300
              shadow-lg hover:shadow-xl
              w-full sm:w-auto
            "
          >
            View Products
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Trust Indicators */}
        <div
          data-aos="fade-up"
          data-aos-delay="400"
          className="flex flex-wrap items-center justify-center gap-5 sm:gap-7 text-sm sm:text-base"
        >
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 border border-white/20">
              <CheckCircle size={20} className="text-green-400" />
            </div>
            <span className="font-semibold text-white/90 group-hover:text-white transition-colors">
              Free Forever Plan
            </span>
          </div>

          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 border border-white/20">
              <Shield size={20} className="text-blue-400" />
            </div>
            <span className="font-semibold text-white/90 group-hover:text-white transition-colors">
              Bank-Level Security
            </span>
          </div>

          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 border border-white/20">
              <Zap size={20} className="text-yellow-400" />
            </div>
            <span className="font-semibold text-white/90 group-hover:text-white transition-colors">
              Setup in 2 Minutes
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default FinalCTA;
