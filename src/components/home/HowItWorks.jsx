import React from "react";
import { Smartphone, UserPlus, Share2 } from "lucide-react";
import phoneImg from "../../assets/pagee.png";



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
      text: "Share your identity instantly using NFC, a QR code, or your smart link.",
    },
  ];

  return (
    <section className="relative py-20 md:py-24 overflow-hidden bg-gradient-to-b from-white to-[#f4f6ff]">

      {/* Faded Background Title */}
      <h1 className="absolute top-[-20px] md:top-[-10px] left-1/2 -translate-x-1/2 text-[40px] sm:text-[65px] md:text-[90px] font-extrabold text-[#f2a91d]/20 tracking-widest select-none whitespace-nowrap">
        HOW IT WORKS
      </h1>

      <div className="section-shell grid grid-cols-1 md:grid-cols-2 items-center gap-14 md:gap-16 relative z-10">

        {/* Left: Phone Mockup */}
        <div data-aos="fade-right" className="flex justify-center">
          <div className="relative w-[200px] sm:w-[260px] md:w-[300px] lg:w-[340px]">
            <img
              src={phoneImg}
              alt="Phone mockup"
              className="w-full h-auto object-contain rounded-xl drop-shadow-xl"
            />


          </div>
        </div>

        {/* Right: Steps Text */}
        <div data-aos="fade-left" className="space-y-2 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl font-semibold leading-snug">
            How{" "}
            <span className="font-bold text-brand-primary whitespace-nowrap">
              <span className="inline-block w-2 h-2 sm:w-2 sm:h-2 md:w-2 md:h-2 bg-[#f2a91d] rounded-full translate-y-[2px]"></span>
              LinkMe
            </span>{" "}
            Works
          </h2>

          <p className="text-gray-600 max-w-md mx-auto md:mx-0 text-base sm:text-lg">
            Turn your physical card into a powerful digital identity in seconds.
          </p>

          {/* Steps */}
          <div className="space-y-5 sm:space-y-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex gap-4 p-5 rounded-2xl bg-white shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="mt-1">{step.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
