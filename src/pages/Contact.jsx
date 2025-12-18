import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Globe,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Swal from "sweetalert2";

import AOS from "aos";
import "aos/dist/aos.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const API_URL = import.meta.env.VITE_API_URL; // For Vite

  // INIT AOS
  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out",
      once: true,
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/create/contact-messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();

      setFormData({ name: "", email: "", message: "" });

      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "Your message has been sent successfully!",
        confirmButtonColor: "#060640",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "There was an error sending your message. Please try again later.",
        confirmButtonColor: "#060640",
      });
    }
  };

  return (
    <div className="bg-white overflow-hidden">
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

        {/* Subtle Grid */}
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
                bg-[size:4rem_4rem] pointer-events-none
                [mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,#000,transparent)]"
        ></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow mb-4 sm:mb-6"
            data-aos="fade-up"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-brand-accent" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">
              Contact Our Team
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight"
            data-aos="fade-up"
          >
            Get In <span className="text-brand-accent">Touch</span>
          </h1>

          {/* Description */}
          <p
            className="mt-4 sm:mt-6 text-base sm:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
            data-aos="fade-up"
          >
            Have a question or want to know more? We're here to help you with
            anything you need. Send us a message and our support team will get
            back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* ================= FORM + SIDE INFO ================= */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10 md:gap-12">
          {/* LEFT COLUMN */}
          <div className="space-y-8" data-aos="fade-right">
            {/* QUICK CONTACT */}
            <div className="rounded-3xl p-6 md:p-8 shadow-lg bg-brand-gradient text-white border border-white/10">
              <h3 className="text-2xl font-bold mb-6">Quick Contact</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Email Us</p>
                    <a
                      href="mailto:hello@smartcard.com"
                      className="font-semibold hover:underline"
                    >
                      info@dotmediajo.net

                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Call Us</p>
                    <a
                      href="tel:+1234567890"
                      className="font-semibold hover:underline"
                    >
                      +962789924535
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Visit Us</p>
                    <p className="font-semibold">
                      Wasfi Al-Tal Street, Amman, Jordan
                      <br /> 
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* HOURS CARD */}
            <div
              className="rounded-3xl p-6 md:p-8 shadow-lg bg-white border border-gray-200/70"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-brand-primary/10 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark">
                  Business Hours
                </h3>
              </div>

              <div className="space-y-3 text-gray-700 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium">Sunday to Thursday</span>
                  <span className="text-brand-accent font-semibold">
                    9:00 AM - 6:00 PM
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium">Saturday</span>
                  <span className="text-brand-accent font-semibold">
                    10:00 AM - 4:00 PM
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="font-medium">Friday</span>
                  <span className="text-gray-400 font-semibold">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* FORM COLUMN */}
          <div className="lg:col-span-2" data-aos="fade-left">
            <div className="rounded-3xl p-8 md:p-10 shadow-lg bg-white border border-gray-200/70">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-brand-primary mb-3">
                  We're Here to Help
                </h2>
                <p className="text-gray-600">
                  Send us a message and we’ll get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-accent text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* REASSURANCE SECTION */}
      <section className="py-10" data-aos="fade-up">
        <div className="max-w-4xl mx-auto text-center text-gray-500 text-sm flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-primary" />
            <span>Your data is secured with encryption</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-primary" />
            <span>Average response time: under 24 hours</span>
          </div>

          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-primary" />
            <span>Trusted by users worldwide</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
