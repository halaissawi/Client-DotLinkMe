import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  ArrowRight,
  Play,
  Zap,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const HowItWorks = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out",
      once: true,
    });
  }, []);

  return (
    <div className="bg-white overflow-x-hidden">
      {/* ================= HERO ================= */}
      <section
        className="relative w-full py-16 sm:py-20 bg-brand-gradient text-white overflow-hidden"
        data-aos="fade-up"
      >
        {/* Animated Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-5 w-56 h-56 sm:w-80 sm:h-80 bg-brand-accent/20 rounded-full blur-2xl sm:blur-3xl animate-blob"></div>
          <div className="absolute bottom-10 right-5 w-64 h-64 sm:w-[450px] sm:h-[450px] bg-brand-primary/30 rounded-full blur-2xl sm:blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow mb-4 sm:mb-6"
            data-aos="fade-up"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-brand-accent" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">
              Smart & Effortless
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight"
            data-aos="fade-up"
          >
            The <span className="text-brand-accent">Smartest</span> Way <br />
            To Share Your <span className="text-brand-accent">Identity</span>
          </h1>

          <p
            className="mt-4 sm:mt-6 text-base sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
            data-aos="fade-up"
          >
            Learn how your NFC card turns every meeting into a lasting
            connection — effortlessly, instantly, beautifully.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-10"
            data-aos="fade-up"
          >
            <a
              href="#video"
              className="group bg-brand-accent hover:bg-yellow-500 text-white px-7 py-3 sm:px-10 sm:py-4 rounded-xl font-semibold sm:font-bold text-sm sm:text-lg shadow-lg hover:scale-105 transition inline-flex items-center gap-2"
            >
              Watch Demo
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <Link
              to="/create-card"
              className="group bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white px-7 py-3 sm:px-10 sm:py-4 rounded-xl font-semibold sm:font-bold text-sm sm:text-lg hover:scale-105 transition inline-flex items-center gap-2"
            >
              Create Your Profile
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= VIDEO SPLIT SECTION ================= */}
      <section
        id="video"
        className="py-16 sm:py-24 px-4 bg-gray-50"
        data-aos="fade-up"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 sm:gap-12 items-center">
          {/* VIDEO */}
          <div
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl border border-blue-100 bg-blue-600/30 w-full"
            data-aos="fade-right"
          >
            {!isPlaying ? (
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:scale-110 transition">
                  <Play size={28} className="text-white" fill="white" />
                </div>
              </button>
            ) : (
              <video
                src="/videos/demo.mp4"
                autoPlay
                controls
                className="w-full h-full"
              />
            )}

            <button
              onClick={() => setShowVideoModal(true)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/20 backdrop-blur-md px-2 py-1.5 sm:px-3 sm:py-2 rounded-full text-white text-[10px] sm:text-xs border border-white/30 hover:bg-white/30"
            >
              Enlarge
            </button>
          </div>

          {/* TEXT */}
          <div
            className="space-y-4 sm:space-y-6 text-center md:text-left"
            data-aos="fade-left"
          >
            <h2 className="text-2xl sm:text-4xl font-bold text-brand-dark">
              See Your Card <span className="text-brand-accent">In Action</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              With a single tap, your profile opens instantly — no apps, no login required.
            </p>

            <ul className="space-y-3 sm:space-y-4 text-gray-700 text-sm sm:text-base">
              <li className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                Works instantly on any smartphone.
              </li>
              <li className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                Your profile updates in real time.
              </li>
              <li className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                Track every view, tap, and interaction.
              </li>
            </ul>

            <button
              onClick={() => setShowVideoModal(true)}
              className="mt-2 sm:mt-4 bg-brand-accent hover:bg-yellow-500 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl font-semibold sm:font-bold text-sm sm:text-lg shadow hover:scale-105 transition"
            >
              Watch Full Demo
            </button>
          </div>
        </div>
      </section>

      {/* ================= VIDEO MODAL ================= */}
      {showVideoModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[999] px-4"
          data-aos="fade-up"
        >
          <button
            className="absolute top-4 right-4 bg-white/20 p-2 rounded-full hover:bg-white/30 transition"
            onClick={() => setShowVideoModal(false)}
          >
            <X size={22} className="text-white" />
          </button>

          <div className="w-full max-w-[700px] rounded-xl overflow-hidden shadow-2xl border border-white/20">
            <video
              src="/videos/demo.mp4"
              autoPlay
              controls
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* ================= BEFORE / AFTER SECTION ================= */}
      <section className="py-16 sm:py-24 px-4 bg-white" data-aos="fade-up">
        <div className="max-w-6xl mx-auto text-center mb-14 sm:mb-16">
          <div
            className="inline-flex items-center gap-2 bg-blue-50 text-brand-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-3 sm:mb-4"
            data-aos="fade-up"
          >
            <TrendingUp size={14} className="sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">
              The Difference
            </span>
          </div>

          <h2
            className="text-3xl sm:text-5xl font-bold text-brand-dark mb-3 sm:mb-4"
            data-aos="fade-up"
          >
            From Cards to <span className="text-brand-accent">Connections</span>
          </h2>

          <p
            className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto"
            data-aos="fade-up"
          >
            A quick look at how your networking evolves.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-10 max-w-4xl mx-auto">
          <div
            className="p-6 sm:p-8 bg-red-50 rounded-2xl sm:rounded-3xl border border-red-100 shadow hover:-translate-y-1 sm:hover:-translate-y-2 transition"
            data-aos="fade-right"
          >
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full mb-3 text-[11px] sm:text-xs font-bold">
              <X size={12} /> Before
            </div>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Lost paper cards, outdated info, manual saving, no tracking.
            </p>
          </div>

          <div
            className="p-6 sm:p-8 bg-blue-50 rounded-2xl sm:rounded-3xl border border-blue-200 shadow hover:-translate-y-1 sm:hover:-translate-y-2 transition"
            data-aos="fade-left"
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-3 text-[11px] sm:text-xs font-bold">
              <CheckCircle size={12} /> After
            </div>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              One tap, live profile, instant saving, full analytics dashboard.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
