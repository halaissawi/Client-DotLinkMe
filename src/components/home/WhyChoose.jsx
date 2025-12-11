import React from "react";
import { ShieldCheck, Zap, Brush, BarChart3 } from "lucide-react";

const WhyChoose = () => {
  const features = [
    {
      icon: <Zap size={30} className="text-brand-primary" />,
      title: "Professional Digital Presence",
      text: "Show your information clearly and professionally.",
    },
    {
      icon: <Brush size={30} className="text-brand-primary" />,
      title: "Always Updated",
      text: "Update your details anytime—no printing needed.",
    },
    {
      icon: <ShieldCheck size={30} className="text-brand-primary" />,
      title: "No App Required",
      text: "Anyone can view your profile instantly without an app.",
    },
    {
      icon: <BarChart3 size={30} className="text-brand-primary" />,
      title: "Eco-Friendly Alternative",
      text: "Replace paper cards with a greener digital option.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white text-brand-dark overflow-hidden">
      <div className="section-shell grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* -------- LEFT SIDE CONTENT -------- */}
        <div
          data-aos="fade-right"
          data-aos-duration="600"
          className="space-y-6 px-4 md:px-0"
        >
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
            Why Choose{" "}
            <span className="font-bold text-brand-primary whitespace-nowrap">
              <span className="inline-block w-2 h-2 sm:w-2 sm:h-2 md:w-2 md:h-2 bg-[#f2a91d] rounded-full translate-y-[2px]"></span>
              LinkMe?
            </span>
          </h2>

          <p className="text-gray-600 text-base md:text-lg max-w-md">
            A smart, simple, and professional way to share your identity—built for today’s digital world.
          </p>

          {/* Feature Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 pt-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="p-4 md:p-5 rounded-2xl bg-white border border-gray-200 shadow-md 
                transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-float"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="mb-3 w-8 h-8 md:w-auto md:h-auto flex items-center justify-center">
                  {React.cloneElement(f.icon, {
                    size: window.innerWidth < 768 ? 24 : 30,
                  })}
                </div>
                <h3 className="font-semibold text-base md:text-lg mb-1">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* -------- RIGHT SIDE IMAGE + BG TEXT -------- */}
        <div
          data-aos="fade-left"
          data-aos-duration="600"
          className="relative flex justify-center items-center px-4 md:px-0"
          style={{ minHeight: "300px" }}
        >
          {/* IMAGE */}
          <img
            src="/images/man.png"
            alt="Professional Person"
            className="relative z-10 
              w-[280px] sm:w-[340px] md:w-[420px] lg:w-[550px]
              object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
