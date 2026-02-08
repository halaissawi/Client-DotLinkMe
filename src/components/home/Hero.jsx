import React from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  BarChart2,
  Palette,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Shield,
  Bolt,
} from "lucide-react";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen bg-brand-gradient text-white flex items-center overflow-hidden pt-20 pb-24">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 md:w-96 md:h-96 bg-brand-accent/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 md:w-[500px] md:h-[500px] bg-brand-primary/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 md:w-[600px] md:h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)] pointer-events-none"></div>

      <div className="section-shell flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16 px-4 sm:px-6 lg:px-8 w-full relative z-10 max-w-7xl mx-auto">
        {/* RIGHT IMAGE - 3D Card Design */}
        <div className="flex-1 flex justify-center items-center relative w-full order-1 md:order-2">
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[420px] py-10 sm:py-12">
            {/* 3D Card Stack */}
            <div className="relative w-full group perspective-1000">
              {/* Background Cards - Creating depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl transform rotate-6 translate-y-8 scale-95 opacity-60 group-hover:rotate-8 transition-all duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl border border-white/25 shadow-2xl transform -rotate-4 translate-y-4 scale-97 opacity-70 group-hover:-rotate-6 transition-all duration-500"></div>

              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-white/30 via-white/20 to-white/10 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-[0_30px_60px_rgba(0,0,0,0.3)] transform group-hover:scale-105 group-hover:rotate-2 transition-all duration-500">
                <img src="/images/card.png" alt="Smart Card Mockup" />
              </div>
            </div>

            {/* Floating Stats Cards */}
            <div className="absolute -top-2 sm:top-0 -left-6 sm:-left-10 md:-left-12 bg-white/15 backdrop-blur-xl rounded-xl p-2 sm:p-3 border border-white/30 shadow-xl animate-float hover:bg-white/20 transition-all duration-300 z-20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-yellow-400/30 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-200">Fast</p>
                  <p className="text-xs sm:text-sm font-bold">1 Tap Share</p>
                </div>
              </div>
            </div>

            <div
              className="absolute -bottom-2 sm:bottom-0 -right-6 sm:-right-10 md:-right-12 bg-white/15 backdrop-blur-xl rounded-xl p-2 sm:p-3 border border-white/30 shadow-xl animate-float hover:bg-white/20 transition-all duration-300 z-20"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-400/30 rounded-lg flex items-center justify-center">
                  <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-200">Track</p>
                  <p className="text-xs sm:text-sm font-bold">Analytics</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LEFT CONTENT */}
        <div className="flex-1 space-y-5 sm:space-y-6 w-full order-2 md:order-1 text-center md:text-left max-w-xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-white/15 backdrop-blur-xl rounded-full border border-white/30 shadow-lg animate-logo hover:bg-white/20 transition-all duration-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-accent"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span className="text-xs font-bold text-white uppercase tracking-wide">
              Smart Business Cards
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight animate-logo-delay">
            Share Your Identity
            <br />
            In{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-brand-accent via-yellow-400 to-brand-accent bg-clip-text text-transparent animate-gradient">
                One Tap
              </span>
              <span className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-1.5 sm:h-2 bg-gradient-to-r from-brand-accent/40 via-brand-accent to-brand-accent/40 blur-sm rounded-full"></span>
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-gray-100 font-light leading-relaxed max-w-lg mx-auto md:mx-0">
            Replace paper business cards with smart NFC technology.
            <span className="block mt-2 text-white font-semibold text-lg sm:text-xl">
              Instant. Modern. Sustainable.
            </span>
          </p>

          {/* Key Features */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto md:mx-0">
            <div className="group bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10 hover:bg-white/15 hover:border-white/30 hover:scale-105 transition-all duration-300 cursor-pointer">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mx-auto md:mx-0 mb-1.5 group-hover:scale-110 transition-transform" />
              <p className="text-xs sm:text-sm font-bold">Instant</p>
              <p className="text-[10px] sm:text-xs text-gray-300">Share</p>
            </div>
            <div className="group bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10 hover:bg-white/15 hover:border-white/30 hover:scale-105 transition-all duration-300 cursor-pointer">
              <BarChart2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mx-auto md:mx-0 mb-1.5 group-hover:scale-110 transition-transform" />
              <p className="text-xs sm:text-sm font-bold">Real-Time</p>
              <p className="text-[10px] sm:text-xs text-gray-300">Analytics</p>
            </div>
            <div className="group bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10 hover:bg-white/15 hover:border-white/30 hover:scale-105 transition-all duration-300 cursor-pointer">
              <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 mx-auto md:mx-0 mb-1.5 group-hover:scale-110 transition-transform" />
              <p className="text-xs sm:text-sm font-bold">Custom</p>
              <p className="text-[10px] sm:text-xs text-gray-300">Profile</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center md:justify-start">
            <Link
              to="/create-card"
              className="group relative overflow-hidden flex items-center justify-center gap-2 text-sm sm:text-base px-5 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-brand-accent to-yellow-500 text-white font-bold rounded-xl shadow-[0_8px_30px_rgba(242,169,29,0.4)] hover:shadow-[0_12px_40px_rgba(242,169,29,0.6)] hover:scale-105 transition-all duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-brand-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              to="/gallery"
              className="group flex items-center justify-center gap-2 text-sm sm:text-base px-6 sm:px-7 py-3 sm:py-3.5 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              View Product
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {/* 
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm group cursor-pointer">
              <div className="w-5 h-5 bg-green-400/20 rounded-lg flex items-center justify-center group-hover:bg-green-400/30 transition-colors">
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
              </div>
              <span className="text-gray-100 font-medium group-hover:text-white transition-colors">
                Free Tier
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm group cursor-pointer">
              <div className="w-5 h-5 bg-blue-400/20 rounded-lg flex items-center justify-center group-hover:bg-blue-400/30 transition-colors">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <span className="text-gray-100 font-medium group-hover:text-white transition-colors">
                Secure
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm group cursor-pointer">
              <div className="w-5 h-5 bg-yellow-400/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-400/30 transition-colors">
                <Bolt className="w-3.5 h-3.5 text-yellow-400" />
              </div>
              <span className="text-gray-100 font-medium group-hover:text-white transition-colors">
                Instant Setup
              </span>
            </div>
          </div> */}
        </div>
      </div>

      {/* Curved SVG Bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
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
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
};

export default Hero;
