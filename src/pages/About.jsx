import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import {
  CreditCard,
  Users,
  Smartphone,
  Shield,
  TrendingUp,
} from "lucide-react";

const AboutUs = () => {
  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: "ease-out" });
  }, []);

  return (
    <div className=" bg-white text-brand-dark ">
      <section className="section-shell pt-28 pb-10 border-b border-gray-200/60 ">
        <div
          className="grid md:grid-cols-2 gap-12 md:gap-16 items-center"
          data-aos="fade-up"
        >
          {/* LEFT SIDE */}
          <div className="space-y-5 max-w-3xl" data-aos="fade-right">
            <p className="text-sm font-medium text-brand-primary uppercase tracking-wide">
              About LinkMe
            </p>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight">
              We turn <span className="text-brand-primary">simple cards</span>{" "}
              into <span className="text-brand-accent">smart connections</span>.
            </h1>

            <p className="text-lg text-gray-600  max-w-xl">
              LinkMe transforms a standard NFC card into a dynamic digital identity — allowing you to share 
              who you are in a single tap, with no apps and no friction.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              <div className="card-glass  px-4 py-3">
                <p className="text-xs uppercase text-gray-500 mb-1">
                  Built for
                </p>
                <p className="text-sm font-medium">
                  Everyone Shaping Their Future
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200  px-4 py-3">
                <p className="text-xs uppercase text-gray-500 mb-1">
                  Your Gateway
                </p>
                <p className="text-sm font-medium">to Better Networking</p>
              </div>

              <div className="rounded-2xl border border-gray-200  px-4 py-3">
                <p className="text-xs uppercase text-gray-500 mb-1">
                  Everything You Are
                </p>
                <p className="text-sm font-medium">In One Linkd</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div
            className="relative w-full max-w-md mx-auto pt-6 lg:pt-0"
            data-aos="zoom-in"
            data-aos-delay="150"
          >
            <div className="absolute -inset-4 bg-brand-primary/10  blur-2xl rounded-3xl pointer-events-none" />

            <div className="relative rounded-3xl bg-brand-gradient text-white p-6 md:p-8 shadow-xl flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-blue-200/80">
                    LINKME IN A NUTSHELL
                  </p>
                  <h2 className="text-xl md:text-2xl font-semibold mt-1">
                    NFC card + digital profile
                  </h2>
                </div>

                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                  <CreditCard size={24} />
                </div>
              </div>

              <div className="space-y-3 text-sm text-blue-100">
                <p>• Share your profile instantly</p>
                <p>• Works on any modern device</p>
                <p>• Update anytime without reprinting</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-20 md:py-24">
        <div
          className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-start"
          data-aos="fade-up"
        >
          {/* LEFT */}
          <div className="space-y-6 max-w-2xl" data-aos="fade-right">
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Our story started with{" "}
              <span className="text-brand-primary">lost cards</span> and{" "}
              <span className="text-brand-accent">missed chances</span>.
            </h2>

            <p className="text-gray-600  text-lg leading-relaxed">
              LinkMe was born after countless events and interviews where
              traditional business cards ended up forgotten.
            </p>

            <p className="text-gray-600  text-lg leading-relaxed">
              So we built something simple and powerful: a digital profile tied
              to a smart NFC card that works with a single tap.
            </p>
          </div>

          {/* RIGHT */}
          <div className="grid gap-6 md:gap-8">
            <div
              className="rounded-2xl border border-gray-200  p-6 flex gap-4"
              data-aos="fade-left"
            >
              <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                <Smartphone size={24} />
              </div>
              <div>
                <p className="text-lg font-semibold">
                  Digital-first, human-centered
                </p>
                <p className="text-sm text-gray-600 ">
                  A profile that feels personal and alive.
                </p>
              </div>
            </div>

            <div
              className="rounded-2xl border border-gray-200  p-6 flex gap-4"
              data-aos="fade-left"
              data-aos-delay="150"
            >
              <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-brand-accent/10 text-brand-accent">
                <Users size={24} />
              </div>
              <div>
                <p className="text-lg font-semibold">Built by young creators</p>
                <p className="text-sm text-gray-600 ">
                  Started as a student idea, now a real solution.
                </p>
              </div>
            </div>

            <div
              className="rounded-2xl border border-gray-200  p-6 flex gap-4"
              data-aos="fade-left"
              data-aos-delay="300"
            >
              <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <Shield size={24} />
              </div>
              <div>
                <p className="text-lg font-semibold">Privacy & control</p>
                <p className="text-sm text-gray-600 ">
                  You own your data—always.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="section-shell py-20 md:py-24 ">
        <div className="max-w-2xl mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
            More than a card — a full identity system.
          </h2>
          <p className="text-gray-600  text-lg mt-3">
            Everything you need to share your identity smartly and instantly.
          </p>
        </div>

        <div
          className="grid md:grid-cols-3 gap-10 md:gap-12"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="rounded-2xl border border-gray-200  bg-white  p-6">
            <div className="h-12 w-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4">
              <CreditCard size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart NFC cards</h3>
            <p className="text-sm text-gray-600 ">
              Tap-to-share with premium NFC cards mapped to your profile.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200  bg-white  p-6">
            <div className="h-12 w-12 rounded-xl bg-brand-accent/10 text-brand-accent flex items-center justify-center mb-4">
              <Smartphone size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Digital profile</h3>
            <p className="text-sm text-gray-600 ">
              A clean, customizable page for your links, bio, and contact info.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200  bg-white  p-6">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Insights (soon)</h3>
            <p className="text-sm text-gray-600 ">
              Analytics to help you understand how people interact with your
              identity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
