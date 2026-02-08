import React from "react";
import { Smartphone, UserPlus, Share2 } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Smartphone size={36} className="text-brand-primary" />,
      title: "Choose Your Card",
      text: "Choose your NFC card design and activate your .LinkMe account.",
    },
    {
      icon: <UserPlus size={36} className="text-brand-primary" />,
      title: "Create Your Profile",
      text: "Add your name, bio, photo, and all your social media links in minutes.",
    },
    {
      icon: <Share2 size={36} className="text-brand-primary" />,
      title: "Tap & Share",
      text: "Share your identity instantly using NFC, a QR code, or your smart link.",
    },
  ];

  return (
    <section className="relative py-20 md:py-24 overflow-hidden bg-brand-gradient text-white">
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

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Faded Background Title */}
      <h1 className="absolute top-[80px] md:top-[100px] left-1/2 -translate-x-1/2 text-[40px] sm:text-[65px] md:text-[90px] font-extrabold text-white/5 tracking-widest select-none whitespace-nowrap">
        HOW IT WORKS
      </h1>

      <div className="section-shell grid grid-cols-1 md:grid-cols-2 items-center gap-14 md:gap-16 relative z-10">
        {/* Left: Phone with Floating Animation */}
        <div data-aos="fade-right" className="flex justify-center">
          <div className="relative w-[200px] sm:w-[260px] md:w-[300px] lg:w-[340px] animate-float">
            <img
              src="/images/iphone.png"
              alt="Phone mockup"
              className="w-full h-auto object-contain rounded-xl drop-shadow-xl"
            />
          </div>
        </div>

        {/* Right: Steps */}
        <div
          data-aos="fade-left"
          className="space-y-2 text-center md:text-left"
        >
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-4 border border-white/20">
            Simple Process
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-snug mb-3">
            How{" "}
            <span className="relative inline-block">
              <span className="font-bold text-brand-accent whitespace-nowrap">
                <span className="inline-block w-2 h-2 sm:w-2 sm:h-2 md:w-2 md:h-2 bg-[#f2a91d] rounded-full translate-y-[2px]"></span>
                LinkMe
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-brand-accent/40 via-brand-accent to-transparent rounded-full"></span>
            </span>{" "}
            Works
          </h2>

          <p className="text-gray-200 max-w-md mx-auto md:mx-0 text-base sm:text-lg mb-8 opacity-90">
            Turn your physical card into a powerful digital identity in seconds.
          </p>

          {/* Steps */}
          <div className="space-y-5 sm:space-y-6">
            {steps.map((step, i) => (
              <div
                key={i}
                data-aos="fade-left"
                data-aos-delay={i * 100}
                className="group relative flex gap-5 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 hover:border-white/30 hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Step Number */}
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white/60 font-bold text-sm border border-white/20">
                  {i + 1}
                </div>

                <div className="relative z-10 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-white/30">
                  {step.icon}
                </div>
                <div className="relative z-10 flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-200 text-sm sm:text-base leading-relaxed opacity-90">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
