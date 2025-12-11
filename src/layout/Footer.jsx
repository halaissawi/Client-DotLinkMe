import React from "react";
import { Link } from "react-router-dom";
import {
  Instagram,
  Linkedin,
  Globe,
  Twitter,
  Phone,
  Mail,
  MapPin,
  Copyright,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0c0f1d] text-[#c9c9d9] py-12 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <h3 className="text-3xl font-extrabold text-white">
            <span className="font-bold text-brand-primary whitespace-nowrap">
              <span className="inline-block w-2 h-2 sm:w-2 sm:h-2 md:w-2 md:h-2 bg-[#f2a91d] rounded-full translate-y-[2px]"></span>
              LinkMe
            </span>
          </h3>

          <p className="text-sm text-[#9ea0b5] leading-relaxed max-w-xs">
            Smart NFC-powered identity. Share your profile with a single tap.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 pt-2">
            <a className="hover:text-brand-primary transition" href="#">
              <Globe size={18} />
            </a>
            <a className="hover:text-brand-primary transition" href="#">
              <Instagram size={18} />
            </a>
            <a className="hover:text-brand-primary transition" href="#">
              <Twitter size={18} />
            </a>
            <a className="hover:text-brand-primary transition" href="#">
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="">
          <h4 className="text-white font-semibold mb-3">Navigation</h4>
          <ul className="space-y-2 text-sm text-[#a1a3b8]">
            <li>
              <Link to="/" className="hover:text-brand-primary">
                Home
              </Link>
            </li>
            <li>
              <Link to="/create-card" className="hover:text-brand-primary">
                Create Card
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:text-brand-primary">
                How It Works
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-brand-primary">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-brand-primary">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="">
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-[#a1a3b8]">
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-brand-primary" /> +962789924535
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-brand-primary" />{" "}
              info@dotmediajo.net
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-brand-primary" /> Jordan-Amman
              Wasfi Al Tal Street
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 pt-6 border-t border-[#1d2133] text-center text-xs text-[#7e8093] flex items-center justify-center gap-1">
        <Copyright className="w-3 h-3" /> {new Date().getFullYear()} LinkMe. All
        rights reserved.
      </div>
    </footer>
  );
}
