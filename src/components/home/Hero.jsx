import React from "react";
import heroImg from "../../assets/ChatGPTImage.png";
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
    <section className="relative w-full min-h-screen bg-brand-gradient text-white flex items-center overflow-hidden pt-24 pb-16 md:pb-5">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-brand-primary/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)] pointer-events-none"></div>

      <div className="section-shell flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16 lg:gap-20 px-4 sm:px-6 lg:px-8 w-full relative z-10">
        {/* RIGHT IMAGE - Shows first on mobile, second on desktop */}
        <div className="flex-1 flex justify-center items-center relative w-full order-1 md:order-2">
          <div className="relative w-full max-w-[300px] sm:max-w-[400px] md:max-w-[480px] lg:max-w-[550px]">

            {/* Main Image */}

            <div className="w-[280px] sm:w-[360px] md:w-[460px] lg:w-[560px] xl:w-[650px] ml-auto">
              <img src={heroImg} alt="Smart Card Mockup" className="w-full h-auto drop-shadow-2xl" />
            </div>

            {/* Floating Stats Cards */}
            <div className="absolute -top-8 -left-4 sm:-left-8 bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20 shadow-2xl animate-float">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-300">Fast</p>
                  <p className="text-sm font-bold">1 Tap Share</p>
                </div>
              </div>
            </div>

            <div
              className="absolute -bottom-4 -right-4 sm:-right-8 bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20 shadow-2xl animate-float"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-400/20 rounded-xl flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-300">Track</p>
                  <p className="text-sm font-bold">Analytics</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LEFT CONTENT - Shows second on mobile, first on desktop */}
        <div className="flex-1 space-y-6 sm:space-y-8 w-full order-2 md:order-1 text-center md:text-left max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg animate-logo">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
            </span>
            <Sparkles className="w-4 h-4 text-brand-accent" />
            <span className="text-sm font-bold text-white uppercase tracking-wide">
              Smart Business Cards
            </span>
          </div>

          {/* Heading - More Powerful */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] animate-logo-delay">
            Share Your Identity
            <br />
            In{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-brand-accent via-yellow-400 to-brand-accent bg-clip-text text-transparent animate-gradient">
                One Tap
              </span>
              {/* Underline */}
              <span className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-2 bg-gradient-to-r from-brand-accent/40 via-brand-accent to-brand-accent/40 blur-sm rounded-full"></span>
            </span>
          </h1>

          {/* Description - Simpler */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 font-light leading-relaxed max-w-xl mx-auto md:mx-0">
            Replace paper business cards with smart NFC technology.
            <span className="block mt-2 text-white font-semibold">
              Instant. Modern. Sustainable.
            </span>
          </p>

          {/* Key Features - Simplified */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto md:mx-0">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mx-auto md:mx-0 mb-2" />
              <p className="text-xs sm:text-sm font-bold">Instant</p>
              <p className="text-xs text-gray-300">Share</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <BarChart2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto md:mx-0 mb-2" />
              <p className="text-xs sm:text-sm font-bold">Real-Time</p>
              <p className="text-xs text-gray-300">Analytics</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400 mx-auto md:mx-0 mb-2" />
              <p className="text-xs sm:text-sm font-bold">Custom</p>
              <p className="text-xs text-gray-300">Profile</p>
            </div>
          </div>

          {/* CTA Buttons - Stronger */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
            <Link
              to="/create-card"
              className="group relative overflow-hidden flex items-center justify-center gap-3 text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-brand-accent to-yellow-500 text-white font-bold rounded-2xl shadow-[0_10px_40px_rgba(242,169,29,0.5)] hover:shadow-[0_15px_50px_rgba(242,169,29,0.6)] hover:scale-105 transition-all duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-brand-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>

            <Link
              to="/gallery"
              className="group flex items-center justify-center gap-3 text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 bg-white/10 backdrop-blur-md text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              View Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Trust Badges - Simplified */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 pt-4">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-200">Free Forever</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-gray-200">Secure</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Bolt className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-200">Instant Setup</span>
            </div>
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

export default Hero;
