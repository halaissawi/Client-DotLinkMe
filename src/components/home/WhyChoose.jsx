import React from "react";
import { ShieldCheck, Zap, Brush, BarChart3 } from "lucide-react";

const WhyChoose = () => {
  const features = [
    {
      icon: <Zap size={28} />,
      title: "Professional Digital Presence",
      text: "Show your information clearly and professionally.",
    },
    {
      icon: <Brush size={28} />,
      title: "Always Updated",
      text: "Update your details anytime—no printing needed.",
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "No App Required",
      text: "Anyone can view your profile instantly without an app.",
    },
    {
      icon: <BarChart3 size={28} />,
      title: "Track Your Impact",
      text: "See who's viewing and engaging with your profile.",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-white text-brand-dark overflow-hidden relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#0066ff_1px,transparent_0)] bg-[size:40px_40px]"></div>
      </div>

      <div className="section-shell grid md:grid-cols-2 gap-12 md:gap-16 items-center relative z-10">
        {/* -------- LEFT SIDE CONTENT -------- */}
        <div
          data-aos="fade-right"
          data-aos-duration="600"
          className="space-y-6 px-4 md:px-0"
        >
          <div>
            <span className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-semibold mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
              Why Choose{" "}
              <span className="relative inline-block">
                <span className="font-bold text-brand-primary whitespace-nowrap">
                  <span className="inline-block w-2 h-2 sm:w-2 sm:h-2 md:w-2 md:h-2 bg-[#f2a91d] rounded-full translate-y-[2px]"></span>
                  LinkMe?
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-brand-accent/40 via-brand-accent to-transparent rounded-full"></span>
              </span>
            </h2>
          </div>

          <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-md">
            A smart, simple, and professional way to share your identity—built
            for today's digital world.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
            {features.map((f, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 50}
                className="group relative p-5 md:p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-lg 
                transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-brand-primary/40 hover:bg-white cursor-pointer overflow-hidden"
              >
                {/* Animated gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/8 via-brand-primary/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 space-y-3">
                  {/* Icon with gradient background - matching Hero style */}
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-primary/15 to-brand-primary/5 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border border-brand-primary/20">
                    {React.cloneElement(f.icon, {
                      size: 24,
                      className: "text-brand-primary",
                      strokeWidth: 2.5,
                    })}
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-base md:text-lg text-gray-900 group-hover:text-brand-primary transition-colors pt-1">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {f.text}
                  </p>
                </div>

                {/* Subtle corner glow on hover */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/15 rounded-full opacity-0 group-hover:opacity-100 blur-3xl transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>

        {/* -------- RIGHT SIDE 3D ILLUSTRATION -------- */}
        <div
          data-aos="fade-left"
          data-aos-duration="600"
          className="relative flex justify-center items-center px-4 md:px-0"
          style={{ minHeight: "500px" }}
        >
          {/* 3D Floating Cards Stack */}
          <div className="relative w-full max-w-md perspective-1000">
            {/* Colorful background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-purple-400/15 to-brand-accent/20 rounded-full blur-3xl"></div>

            {/* Card 3 - Back - Purple gradient */}
            <div className="absolute inset-0 transform translate-y-12 -rotate-6 scale-90 opacity-40">
              <div className="bg-gradient-to-br from-purple-400/50 to-indigo-500/50 backdrop-blur-sm rounded-3xl h-64 shadow-2xl border border-purple-300/40"></div>
            </div>

            {/* Card 2 - Middle - Blue gradient */}
            <div className="absolute inset-0 transform translate-y-6 rotate-3 scale-95 opacity-60">
              <div className="bg-gradient-to-br from-blue-400/50 to-cyan-500/50 backdrop-blur-sm rounded-3xl h-64 shadow-2xl border border-blue-300/40"></div>
            </div>

            {/* Card 1 - Front */}
            <div className="relative transform hover:scale-105 hover:-rotate-2 transition-all duration-500 group cursor-pointer">
              <img
                src="/images/macbook.png"
                alt="mac book"
                className="relative z-10"
              />
            </div>

            {/* Floating decorative elements - Colorful */}
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-brand-accent/60 to-yellow-400/60 backdrop-blur-md rounded-2xl shadow-xl animate-float opacity-90 border border-yellow-300/40"></div>
            <div
              className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-pink-400/60 to-rose-500/60 backdrop-blur-md rounded-2xl shadow-xl animate-float opacity-90 border border-pink-300/40"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          {/* Stats floating cards - with color accents */}
          <div className="absolute top-10 -left-8 bg-white/80 backdrop-blur-xl rounded-xl p-4 shadow-xl border border-gray-200/60 animate-float hover:bg-white transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400/30 to-emerald-500/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-green-300/40">
                <BarChart3 size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Shares</p>
                <p className="text-lg font-bold text-gray-900">10,234</p>
              </div>
            </div>
          </div>

          <div
            className="absolute bottom-10 -right-8 bg-white/80 backdrop-blur-xl rounded-xl p-4 shadow-xl border border-gray-200/60 animate-float hover:bg-white transition-all duration-300"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400/30 to-indigo-500/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-300/40">
                <Zap size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Profile Views</p>
                <p className="text-lg font-bold text-gray-900">50,678</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
};

export default WhyChoose;
