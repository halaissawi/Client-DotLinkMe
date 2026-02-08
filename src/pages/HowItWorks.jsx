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

const HowItWorks = () => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showVideoModal) {
        setShowVideoModal(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showVideoModal]);

  // Lock scroll when modal is open
  useEffect(() => {
    if (showVideoModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showVideoModal]);

  // Video Player Component
  const VideoPlayer = ({
    autoPlay = false,
    controls = true,
    className = "",
  }) => (
    <video
      src="/videos/demo.mp4"
      autoPlay={autoPlay}
      controls={controls}
      className={className}
      onError={() => {
        setVideoError(true);
        console.error("Failed to load video");
      }}
    />
  );

  return (
    <div className="bg-white overflow-x-hidden">
      {/* ================= HERO ================= */}
      <section className="relative w-full py-16 sm:py-20 md:py-24 bg-brand-gradient text-white overflow-hidden">
        {/* Animated Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-5 w-56 h-56 sm:w-80 sm:h-80 bg-brand-accent/20 rounded-full blur-xl sm:blur-3xl animate-blob"></div>
          <div className="absolute bottom-10 right-5 w-64 h-64 sm:w-[450px] sm:h-[450px] bg-brand-primary/30 rounded-full blur-xl sm:blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div
            data-aos="fade-up"
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg mb-4 sm:mb-6"
          >
            <Sparkles className="w-4 h-4 text-brand-accent" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">
              Smart & Effortless
            </span>
          </div>

          {/* Heading */}
          <h1
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4 sm:mb-6"
          >
            The{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-brand-accent via-yellow-300 to-brand-accent bg-clip-text text-transparent">
                Smartest
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-brand-accent/40 via-brand-accent to-brand-accent/40 rounded-full"></span>
            </span>{" "}
            Way <br />
            To Share Your{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-brand-accent via-yellow-300 to-brand-accent bg-clip-text text-transparent">
                Identity
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-brand-accent/40 via-brand-accent to-brand-accent/40 rounded-full"></span>
            </span>
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-base sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
          >
            Learn how your NFC card turns every meeting into a lasting
            connection — effortlessly, instantly, beautifully.
          </p>

          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-10"
          >
            <a
              href="#video"
              className="group bg-brand-accent hover:bg-yellow-500 text-white px-8 py-4 sm:px-10 sm:py-4 rounded-xl font-semibold sm:font-bold text-sm sm:text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              Watch Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <Link
              to="/create-card"
              className="group bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white px-8 py-4 sm:px-10 sm:py-4 rounded-xl font-semibold sm:font-bold text-sm sm:text-lg hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              Create Your Profile
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
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
      </section>

      {/* ================= VIDEO SPLIT SECTION ================= */}
      <section
        id="video"
        className="relative py-16 sm:py-24 px-4 bg-gray-50 overflow-hidden"
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#0066ff_1px,transparent_0)] bg-[size:40px_40px]"></div>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 sm:gap-12 items-center relative z-10">
          {/* VIDEO */}
          <div
            data-aos="fade-right"
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 border-blue-100 bg-gradient-to-br from-blue-500 to-blue-700 aspect-video w-full"
          >
            {videoError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
                <p>Video unavailable</p>
              </div>
            ) : !isPlaying ? (
              <>
                {/* Thumbnail */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700"></div>
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center group"
                  aria-label="Play video"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300 shadow-xl">
                    <Play size={32} className="text-white ml-1" fill="white" />
                  </div>
                </button>
              </>
            ) : (
              <VideoPlayer autoPlay controls className="w-full h-full" />
            )}

            <button
              onClick={() => setShowVideoModal(true)}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300"
              aria-label="Enlarge video"
            >
              Enlarge
            </button>
          </div>

          {/* TEXT */}
          <div
            data-aos="fade-left"
            className="space-y-4 sm:space-y-6 text-center md:text-left"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-brand-dark">
              See Your Card{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary bg-clip-text text-transparent">
                  In Action
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-brand-primary/40 via-brand-accent to-brand-primary/40 rounded-full"></span>
              </span>
            </h2>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              With a single tap, your profile opens instantly — no apps, no
              login required.
            </p>

            <ul className="space-y-3 sm:space-y-4 text-gray-700 text-sm sm:text-base">
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-yellow-600" />
                </div>
                <span>Works instantly on any smartphone.</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span>Your profile updates in real time.</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <span>Track every view, tap, and interaction.</span>
              </li>
            </ul>

            <button
              onClick={() => setShowVideoModal(true)}
              className="mt-4 bg-brand-accent hover:bg-yellow-500 text-white px-8 py-3 rounded-xl font-semibold sm:font-bold text-sm sm:text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Watch Full Demo
            </button>
          </div>
        </div>
      </section>

      {/* ================= VIDEO MODAL ================= */}
      {showVideoModal && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fadeIn"
          onClick={() => setShowVideoModal(false)}
        >
          <button
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/30 transition-all duration-300"
            onClick={() => setShowVideoModal(false)}
            aria-label="Close video"
          >
            <X size={24} className="text-white" />
          </button>

          <div
            className="w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <VideoPlayer autoPlay controls className="w-full h-full" />
          </div>
        </div>
      )}

      {/* ================= BEFORE / AFTER SECTION ================= */}
      <section className="relative py-16 sm:py-24 px-4 bg-white overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#0066ff_1px,transparent_0)] bg-[size:40px_40px]"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center mb-14 sm:mb-16 relative z-10">
          <div
            data-aos="fade-up"
            className="inline-flex items-center gap-2 bg-blue-50 text-brand-primary px-4 py-2 rounded-full mb-4 border border-blue-100"
          >
            <TrendingUp size={16} />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">
              The Difference
            </span>
          </div>

          <h2
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-3xl sm:text-5xl font-bold text-brand-dark mb-4"
          >
            From Cards to{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary bg-clip-text text-transparent">
                Connections
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-brand-primary/40 via-brand-accent to-brand-primary/40 rounded-full"></span>
            </span>
          </h2>

          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto"
          >
            A quick look at how your networking evolves.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-10 max-w-4xl mx-auto relative z-10">
          <div
            data-aos="fade-right"
            className="group p-6 sm:p-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl sm:rounded-3xl border-2 border-red-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1.5 rounded-full mb-3 text-xs font-bold">
              <X size={14} /> Before
            </div>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Lost paper cards, outdated info, manual saving, no tracking.
            </p>
          </div>

          <div
            data-aos="fade-left"
            className="group p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl sm:rounded-3xl border-2 border-blue-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full mb-3 text-xs font-bold">
              <CheckCircle size={14} /> After
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
