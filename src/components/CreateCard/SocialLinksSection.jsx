import React, { useState, useRef, useEffect } from "react";
import {
  Link as LinkIcon,
  AlertCircle,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle2,
  ChevronDown,
  Search,
} from "lucide-react";

import { SOCIAL_PLATFORMS, countryCodes } from "./constants";

export default function SocialLinksSection({
  socialLinks,
  onSocialLinksChange,
}) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [selectedWhatsAppCountry, setSelectedWhatsAppCountry] = useState(
    countryCodes[0]
  );
  const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);
  const [isWhatsAppDropdownOpen, setIsWhatsAppDropdownOpen] = useState(false);
  const [phoneSearchQuery, setPhoneSearchQuery] = useState("");
  const [whatsappSearchQuery, setWhatsappSearchQuery] = useState("");
  const phoneDropdownRef = useRef(null);
  const whatsappDropdownRef = useRef(null);
  const phoneSearchInputRef = useRef(null);
  const whatsappSearchInputRef = useRef(null);

  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{7,15}$/;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        phoneDropdownRef.current &&
        !phoneDropdownRef.current.contains(event.target)
      ) {
        setIsPhoneDropdownOpen(false);
        setPhoneSearchQuery("");
      }
      if (
        whatsappDropdownRef.current &&
        !whatsappDropdownRef.current.contains(event.target)
      ) {
        setIsWhatsAppDropdownOpen(false);
        setWhatsappSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isPhoneDropdownOpen && phoneSearchInputRef.current) {
      setTimeout(() => phoneSearchInputRef.current?.focus(), 100);
    }
    if (isWhatsAppDropdownOpen && whatsappSearchInputRef.current) {
      setTimeout(() => whatsappSearchInputRef.current?.focus(), 100);
    }
  }, [isPhoneDropdownOpen, isWhatsAppDropdownOpen]);

  // Filter countries based on search
  const filteredPhoneCountries = countryCodes.filter(
    (country) =>
      country.name.toLowerCase().includes(phoneSearchQuery.toLowerCase()) ||
      country.code.toLowerCase().includes(phoneSearchQuery.toLowerCase())
  );

  const filteredWhatsAppCountries = countryCodes.filter(
    (country) =>
      country.name.toLowerCase().includes(whatsappSearchQuery.toLowerCase()) ||
      country.code.toLowerCase().includes(whatsappSearchQuery.toLowerCase())
  );

  const handleInputChange = (platform, value, validationFn) => {
    onSocialLinksChange(platform, value);

    if (touched[platform] || value.length > 0) {
      const isValid = value.length === 0 || validationFn(value);
      setErrors((prev) => ({
        ...prev,
        [platform]: !isValid,
      }));
    }
  };

  const handleBlur = (platform) => {
    setTouched((prev) => ({ ...prev, [platform]: true }));
  };

  const isFieldValid = (platform) => {
    return socialLinks[platform] && !errors[platform] && touched[platform];
  };

  const handlePhoneCountrySelect = (country) => {
    setSelectedCountry(country);
    onSocialLinksChange("phone_code", country.code);
    setIsPhoneDropdownOpen(false);
    setPhoneSearchQuery("");
  };

  const handleWhatsAppCountrySelect = (country) => {
    setSelectedWhatsAppCountry(country);
    onSocialLinksChange("whatsapp_code", country.code);
    setIsWhatsAppDropdownOpen(false);
    setWhatsappSearchQuery("");
  };

  // Validation function for social platforms
  const validateSocialPlatform = (platform, value) => {
    const trimmedValue = value.trim();

    // If it starts with http/https, validate as URL
    if (trimmedValue.toLowerCase().startsWith("http")) {
      return urlRegex.test(trimmedValue);
    }

    // Otherwise validate as username (at least 3 characters, alphanumeric + dots, underscores, hyphens)
    const usernameRegex = /^[a-zA-Z0-9._-]{3,}$/;
    return usernameRegex.test(trimmedValue);
  };

  // Country Selector Component (reusable)
  const CountrySelector = ({
    selectedCountry,
    isOpen,
    setIsOpen,
    searchQuery,
    setSearchQuery,
    filteredCountries,
    onSelect,
    dropdownRef,
    searchInputRef,
  }) => (
    <div
      className="w-28 sm:w-32 md:w-36 flex-shrink-0 relative"
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select country code"
        aria-expanded={isOpen}
        className="w-full h-[46px] px-2 sm:px-3 md:px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-brand-primary focus:border-brand-primary focus:outline-none focus:ring-3 focus:ring-brand-primary/10 transition-all duration-200 flex items-center justify-between group"
      >
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="text-lg sm:text-xl flex-shrink-0">
            {selectedCountry.flag}
          </span>
          <span className="font-semibold text-xs sm:text-sm text-gray-700 truncate">
            {selectedCountry.code}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-64 sm:w-72 left-0 bg-white rounded-xl shadow-2xl border-2 border-gray-100 overflow-hidden">
          {/* Search Box */}
          <div className="p-3 border-b border-gray-100 bg-gray-50/50">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country..."
                aria-label="Search country"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
              />
            </div>
          </div>

          {/* Countries List */}
          <div className="max-h-56 sm:max-h-64 overflow-y-auto py-1">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => onSelect(country)}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gradient-to-r hover:from-brand-primary/5 hover:to-purple-500/5 transition-all duration-150 ${
                    selectedCountry.code === country.code
                      ? "bg-gradient-to-r from-brand-primary/10 to-purple-500/10"
                      : ""
                  }`}
                >
                  <span className="text-xl sm:text-2xl flex-shrink-0">
                    {country.flag}
                  </span>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-700">
                        {country.code}
                      </span>
                      <span className="text-xs text-gray-500 truncate">
                        {country.name}
                      </span>
                    </div>
                  </div>
                  {selectedCountry.code === country.code && (
                    <CheckCircle2
                      size={18}
                      className="text-brand-primary flex-shrink-0"
                    />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-500">No countries found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="pt-6 border-t-2 border-gray-100 space-y-4">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div className="space-y-1 flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-brand-dark flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-brand-primary/10 to-purple-500/10 flex items-center justify-center flex-shrink-0">
              <LinkIcon
                size={14}
                className="sm:w-4 sm:h-4 text-brand-primary"
              />
            </div>
            <span className="truncate">Social Links & Contact</span>
          </h3>
          <p className="text-xs text-gray-500 ml-0 sm:ml-9">
            Add your social profiles and contact information
          </p>
        </div>
        <div className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-amber-50 rounded-full border border-amber-200 flex-shrink-0">
          <span className="text-xs font-medium text-amber-700">Optional</span>
        </div>
      </div>

      {/* Social Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {SOCIAL_PLATFORMS.map((platform) => {
          // PHONE INPUT
          if (platform.key === "phone") {
            return (
              <div
                key={platform.key}
                className="space-y-2 group relative col-span-1 md:col-span-2"
              >
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Phone size={14} className="text-green-600" />
                  </div>
                  <span className="truncate">{platform.label}</span>
                  {isFieldValid(platform.key) && (
                    <CheckCircle2
                      size={14}
                      className="text-green-500 ml-auto flex-shrink-0"
                    />
                  )}
                </label>

                <div className="flex gap-2 sm:gap-3">
                  <CountrySelector
                    selectedCountry={selectedCountry}
                    isOpen={isPhoneDropdownOpen}
                    setIsOpen={setIsPhoneDropdownOpen}
                    searchQuery={phoneSearchQuery}
                    setSearchQuery={setPhoneSearchQuery}
                    filteredCountries={filteredPhoneCountries}
                    onSelect={handlePhoneCountrySelect}
                    dropdownRef={phoneDropdownRef}
                    searchInputRef={phoneSearchInputRef}
                  />

                  {/* Phone Number Input */}
                  <div className="flex-1 relative min-w-0">
                    <input
                      type="tel"
                      value={socialLinks[platform.key] || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        handleInputChange(
                          platform.key,
                          value,
                          phoneRegex.test.bind(phoneRegex)
                        );
                      }}
                      onBlur={() => handleBlur(platform.key)}
                      placeholder={platform.placeholder}
                      className={`w-full rounded-xl px-3 sm:px-4 py-3 text-sm font-medium focus:outline-none focus:ring-3 transition-all duration-200 ${
                        errors[platform.key] && touched[platform.key]
                          ? "border-2 border-red-400 focus:ring-red-100 bg-red-50/50"
                          : isFieldValid(platform.key)
                          ? "border-2 border-green-400 focus:ring-green-100 bg-green-50/50"
                          : "border-2 border-gray-200 focus:border-brand-primary focus:ring-brand-primary/10 bg-white"
                      }`}
                    />
                    {isFieldValid(platform.key) && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle2 size={18} className="text-green-500" />
                      </div>
                    )}
                  </div>
                </div>

                {errors[platform.key] && touched[platform.key] && (
                  <div className="flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle
                      size={14}
                      className="text-red-500 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-xs text-red-600 font-medium">
                      Please enter a valid phone number (7-15 digits)
                    </p>
                  </div>
                )}
              </div>
            );
          }

          // WHATSAPP INPUT WITH COUNTRY CODE
          if (platform.key === "whatsapp") {
            return (
              <div
                key={platform.key}
                className="space-y-2 group col-span-1 md:col-span-2"
              >
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-green-50 flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={14} className="text-green-600" />
                  </div>
                  <span className="truncate">{platform.label}</span>
                  {isFieldValid(platform.key) && (
                    <CheckCircle2
                      size={14}
                      className="text-green-500 ml-auto flex-shrink-0"
                    />
                  )}
                </label>

                <div className="flex gap-2 sm:gap-3">
                  <CountrySelector
                    selectedCountry={selectedWhatsAppCountry}
                    isOpen={isWhatsAppDropdownOpen}
                    setIsOpen={setIsWhatsAppDropdownOpen}
                    searchQuery={whatsappSearchQuery}
                    setSearchQuery={setWhatsappSearchQuery}
                    filteredCountries={filteredWhatsAppCountries}
                    onSelect={handleWhatsAppCountrySelect}
                    dropdownRef={whatsappDropdownRef}
                    searchInputRef={whatsappSearchInputRef}
                  />

                  {/* WhatsApp Number Input */}
                  <div className="flex-1 relative min-w-0">
                    <input
                      type="tel"
                      value={socialLinks[platform.key] || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        handleInputChange(
                          platform.key,
                          value,
                          phoneRegex.test.bind(phoneRegex)
                        );
                      }}
                      onBlur={() => handleBlur(platform.key)}
                      placeholder={platform.placeholder}
                      className={`w-full rounded-xl px-3 sm:px-4 py-3 text-sm font-medium focus:outline-none focus:ring-3 transition-all duration-200 ${
                        errors[platform.key] && touched[platform.key]
                          ? "border-2 border-red-400 focus:ring-red-100 bg-red-50/50"
                          : isFieldValid(platform.key)
                          ? "border-2 border-green-400 focus:ring-green-100 bg-green-50/50"
                          : "border-2 border-gray-200 focus:border-brand-primary focus:ring-brand-primary/10 bg-white"
                      }`}
                    />
                    {isFieldValid(platform.key) && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle2 size={18} className="text-green-500" />
                      </div>
                    )}
                  </div>
                </div>

                {errors[platform.key] && touched[platform.key] && (
                  <div className="flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle
                      size={14}
                      className="text-red-500 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-xs text-red-600 font-medium">
                      Please enter a valid WhatsApp number (7-15 digits)
                    </p>
                  </div>
                )}
              </div>
            );
          }

          // EMAIL INPUT
          if (platform.key === "email") {
            return (
              <div
                key={platform.key}
                className="space-y-2 group col-span-1 md:col-span-2"
              >
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Mail size={14} className="text-blue-600" />
                  </div>
                  <span className="truncate">{platform.label}</span>
                  {isFieldValid(platform.key) && (
                    <CheckCircle2
                      size={14}
                      className="text-green-500 ml-auto flex-shrink-0"
                    />
                  )}
                </label>

                <div className="relative">
                  <input
                    type="email"
                    value={socialLinks[platform.key] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange(
                        platform.key,
                        value,
                        emailRegex.test.bind(emailRegex)
                      );
                    }}
                    onBlur={() => handleBlur(platform.key)}
                    placeholder={platform.placeholder}
                    className={`w-full rounded-xl px-3 sm:px-4 py-3 text-sm font-medium focus:outline-none focus:ring-3 transition-all duration-200 ${
                      errors[platform.key] && touched[platform.key]
                        ? "border-2 border-red-400 focus:ring-red-100 bg-red-50/50"
                        : isFieldValid(platform.key)
                        ? "border-2 border-green-400 focus:ring-green-100 bg-green-50/50"
                        : "border-2 border-gray-200 focus:border-brand-primary focus:ring-brand-primary/10 bg-white"
                    }`}
                  />
                  {isFieldValid(platform.key) && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <CheckCircle2 size={18} className="text-green-500" />
                    </div>
                  )}
                </div>

                {errors[platform.key] && touched[platform.key] && (
                  <div className="flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle
                      size={14}
                      className="text-red-500 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-xs text-red-600 font-medium">
                      Please enter a valid email address
                    </p>
                  </div>
                )}
              </div>
            );
          }

          // OTHER SOCIAL PLATFORMS
          const Icon = platform.icon;
          const iconColors = {
            website: "text-purple-600 bg-purple-50",
            linkedin: "text-blue-700 bg-blue-50",
            instagram: "text-pink-600 bg-pink-50",
            x: "text-gray-900 bg-gray-100",
            github: "text-gray-700 bg-gray-100",
          };

          return (
            <div key={platform.key} className="space-y-2 group">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                    iconColors[platform.key] || "bg-gray-100"
                  }`}
                >
                  <Icon
                    size={14}
                    className={
                      iconColors[platform.key]?.split(" ")[0] || "text-gray-600"
                    }
                  />
                </div>
                <span className="truncate">{platform.label}</span>
                {isFieldValid(platform.key) && (
                  <CheckCircle2
                    size={14}
                    className="text-green-500 ml-auto flex-shrink-0"
                  />
                )}
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={socialLinks[platform.key] || ""}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    handleInputChange(platform.key, rawValue, (val) =>
                      validateSocialPlatform(platform.key, val)
                    );
                  }}
                  onBlur={() => handleBlur(platform.key)}
                  placeholder={platform.placeholder}
                  className={`w-full rounded-xl px-3 sm:px-4 py-3 text-sm font-medium focus:outline-none focus:ring-3 transition-all duration-200 ${
                    errors[platform.key] && touched[platform.key]
                      ? "border-2 border-red-400 focus:ring-red-100 bg-red-50/50"
                      : isFieldValid(platform.key)
                      ? "border-2 border-green-400 focus:ring-green-100 bg-green-50/50"
                      : "border-2 border-gray-200 focus:border-brand-primary focus:ring-brand-primary/10 bg-white"
                  }`}
                />
                {isFieldValid(platform.key) && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CheckCircle2 size={18} className="text-green-500" />
                  </div>
                )}
              </div>

              {errors[platform.key] && touched[platform.key] && (
                <div className="flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle
                    size={14}
                    className="text-red-500 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-xs text-red-600 font-medium">
                    Please enter a valid username (3+ characters) or URL
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
