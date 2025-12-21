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
import { motion } from "framer-motion"; // Better than AOS

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
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full py-16 sm:py-20 bg-brand-gradient text-white overflow-hidden"
      >
        {/* Animated Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-5 w-56 h-56 sm:w-80 sm:h-80 bg-brand-accent/20 rounded-full blur-xl sm:blur-3xl animate-blob"></div>
          <div className="absolute bottom-10 right-5 w-64 h-64 sm:w-[450px] sm:h-[450px] bg-brand-primary/30 rounded-full blur-xl sm:blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow mb-4 sm:mb-6"
          >
            <Sparkles className="w-4 h-4 text-brand-accent" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">
              Smart & Effortless
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight"
          >
            The <span className="text-brand-accent">Smartest</span> Way <br />
            To Share Your <span className="text-brand-accent">Identity</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 sm:mt-6 text-base sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
          >
            Learn how your NFC card turns every meeting into a lasting
            connection — effortlessly, instantly, beautifully.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-10"
          >
            <a
              href="#video"
              className="group bg-brand-accent hover:bg-yellow-500 text-white px-8 py-4 sm:px-10 sm:py-4 rounded-xl font-semibold sm:font-bold text-sm sm:text-lg shadow-lg hover:scale-105 transition inline-flex items-center justify-center gap-2"
            >
              Watch Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <Link
              to="/create-card"
              className="group bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white px-8 py-4 sm:px-10 sm:py-4 rounded-xl font-semibold sm:font-bold text-sm sm:text-lg hover:scale-105 transition inline-flex items-center justify-center gap-2"
            >
              Create Your Profile
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ================= VIDEO SPLIT SECTION ================= */}
      <section id="video" className="py-16 sm:py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 sm:gap-12 items-center">
          {/* VIDEO */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl border border-blue-100 bg-blue-600/30 aspect-video w-full"
          >
            {videoError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
                <p>Video unavailable</p>
              </div>
            ) : !isPlaying ? (
              <>
                {/* Thumbnail - Add your own image */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700"></div>
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center group"
                  aria-label="Play video"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition">
                    <Play size={32} className="text-white ml-1" fill="white" />
                  </div>
                </button>
              </>
            ) : (
              <VideoPlayer autoPlay controls className="w-full h-full" />
            )}

            <button
              onClick={() => setShowVideoModal(true)}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-2 rounded-full text-white text-xs border border-white/30 hover:bg-white/30 transition"
              aria-label="Enlarge video"
            >
              Enlarge
            </button>
          </motion.div>

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6 text-center md:text-left"
          >
            <h2 className="text-2xl sm:text-4xl font-bold text-brand-dark">
              See Your Card <span className="text-brand-accent">In Action</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              With a single tap, your profile opens instantly — no apps, no
              login required.
            </p>

            <ul className="space-y-3 sm:space-y-4 text-gray-700 text-sm sm:text-base">
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <span>Works instantly on any smartphone.</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Your profile updates in real time.</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span>Track every view, tap, and interaction.</span>
              </li>
            </ul>

            <button
              onClick={() => setShowVideoModal(true)}
              className="mt-4 bg-brand-accent hover:bg-yellow-500 text-white px-8 py-3 rounded-xl font-semibold sm:font-bold text-sm sm:text-lg shadow hover:scale-105 transition"
            >
              Watch Full Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* ================= VIDEO MODAL ================= */}
      {showVideoModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setShowVideoModal(false)}
        >
          <button
            className="absolute top-4 right-4 bg-white/20 p-3 rounded-full hover:bg-white/30 transition"
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
        </motion.div>
      )}

      {/* ================= BEFORE / AFTER SECTION ================= */}
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-14 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-blue-50 text-brand-primary px-4 py-2 rounded-full mb-4"
          >
            <TrendingUp size={16} />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">
              The Difference
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-bold text-brand-dark mb-4"
          >
            From Cards to <span className="text-brand-accent">Connections</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto"
          >
            A quick look at how your networking evolves.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="p-6 sm:p-8 bg-red-50 rounded-2xl sm:rounded-3xl border border-red-100 shadow transition-transform"
          >
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1.5 rounded-full mb-3 text-xs font-bold">
              <X size={14} /> Before
            </div>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Lost paper cards, outdated info, manual saving, no tracking.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="p-6 sm:p-8 bg-blue-50 rounded-2xl sm:rounded-3xl border border-blue-200 shadow transition-transform"
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full mb-3 text-xs font-bold">
              <CheckCircle size={14} /> After
            </div>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              One tap, live profile, instant saving, full analytics dashboard.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
