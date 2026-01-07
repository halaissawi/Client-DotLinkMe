import React, { useState, useEffect, useRef } from "react";
import { Plus, Edit2, ChevronDown, Search } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import Swal from "sweetalert2";

const PLATFORM_ENUM = [
  { value: "website", label: "Website" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter" },
  { value: "facebook", label: "Facebook" },
  { value: "github", label: "GitHub" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
];

const COUNTRY_CODES = [
  { name: "Jordan", code: "+962", shortcut: "JO" },
  { name: "Saudi Arabia", code: "+966", shortcut: "SA" },
  { name: "UAE", code: "+971", shortcut: "AE" },
  { name: "Qatar", code: "+974", shortcut: "QA" },
  { name: "Kuwait", code: "+965", shortcut: "KW" },
  { name: "Bahrain", code: "+973", shortcut: "BH" },
  { name: "Oman", code: "+968", shortcut: "OM" },
  { name: "Egypt", code: "+20", shortcut: "EG" },
  { name: "USA", code: "+1", shortcut: "US" },
  { name: "UK", code: "+44", shortcut: "GB" },
  { name: "Canada", code: "+1", shortcut: "CA" },
  { name: "Australia", code: "+61", shortcut: "AU" },
  { name: "Germany", code: "+49", shortcut: "DE" },
  { name: "France", code: "+33", shortcut: "FR" },
  { name: "Italy", code: "+39", shortcut: "IT" },
  { name: "Spain", code: "+34", shortcut: "ES" },
  { name: "Netherlands", code: "+31", shortcut: "NL" },
  { name: "Sweden", code: "+46", shortcut: "SE" },
  { name: "Norway", code: "+47", shortcut: "NO" },
  { name: "Denmark", code: "+45", shortcut: "DK" },
  { name: "Finland", code: "+358", shortcut: "FI" },
  { name: "Turkey", code: "+90", shortcut: "TR" },
  { name: "India", code: "+91", shortcut: "IN" },
  { name: "Pakistan", code: "+92", shortcut: "PK" },
  { name: "China", code: "+86", shortcut: "CN" },
  { name: "Japan", code: "+81", shortcut: "JP" },
  { name: "South Korea", code: "+82", shortcut: "KR" },
  { name: "Brazil", code: "+55", shortcut: "BR" },
  { name: "Mexico", code: "+52", shortcut: "MX" },
  { name: "Argentina", code: "+54", shortcut: "AR" },
  { name: "South Africa", code: "+27", shortcut: "ZA" },
  { name: "Singapore", code: "+65", shortcut: "SG" },
  { name: "New Zealand", code: "+64", shortcut: "NZ" },
  { name: "Russia", code: "+7", shortcut: "RU" },
  { name: "Morocco", code: "+212", shortcut: "MA" },
  { name: "Nigeria", code: "+234", shortcut: "NG" },
  { name: "Kenya", code: "+254", shortcut: "KE" },
  { name: "Bangladesh", code: "+880", shortcut: "BD" },
  { name: "Thailand", code: "+66", shortcut: "TH" },
  { name: "Vietnam", code: "+84", shortcut: "VN" },
  { name: "Philippines", code: "+63", shortcut: "PH" },
  { name: "Malaysia", code: "+60", shortcut: "MY" },
];

export default function SocialLinkModal({
  isOpen,
  onClose,
  onAdd,
  onEdit, // New prop for editing
  editingLink = null, // The link being edited (null for add mode)
  existingPlatforms = [],
}) {
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const isEditMode = !!editingLink;

  // Filter platforms - in edit mode, include current platform
  const availablePlatforms = PLATFORM_ENUM.filter(
    (p) =>
      !existingPlatforms.includes(p.value) ||
      (isEditMode && p.value === editingLink.platform)
  );

  // Filter countries based on search query
  const filteredCountries = COUNTRY_CODES.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.includes(searchQuery) ||
      country.shortcut.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Extract country code and number from existing URL for edit mode
  const extractPhoneData = (phoneUrl) => {
    // For WhatsApp: https://wa.me/9627XXXXXXX
    if (phoneUrl.includes("wa.me/")) {
      const number = phoneUrl.split("wa.me/")[1];
      // Try to match country code
      const matchedCountry = COUNTRY_CODES.find((c) =>
        number.startsWith(c.code.replace("+", ""))
      );
      if (matchedCountry) {
        const localNumber = number.replace(
          matchedCountry.code.replace("+", ""),
          ""
        );
        return { country: matchedCountry, number: localNumber };
      }
      return { country: COUNTRY_CODES[0], number };
    }

    // For Phone: +9627XXXXXXX
    const matchedCountry = COUNTRY_CODES.find((c) =>
      phoneUrl.startsWith(c.code)
    );
    if (matchedCountry) {
      const localNumber = phoneUrl.replace(matchedCountry.code, "");
      return { country: matchedCountry, number: localNumber };
    }

    return { country: COUNTRY_CODES[0], number: phoneUrl };
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSearchQuery("");
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        // Edit mode - populate with existing data
        setPlatform(editingLink.platform);

        if (
          editingLink.platform === "whatsapp" ||
          editingLink.platform === "phone"
        ) {
          const { country, number } = extractPhoneData(editingLink.url);
          setSelectedCountry(country);
          setUrl(number);
        } else {
          setUrl(editingLink.url);
        }
      } else {
        // Add mode - reset form
        setPlatform("");
        setUrl("");
        setSelectedCountry(COUNTRY_CODES[0]);
      }
      setIsDropdownOpen(false);
      setSearchQuery("");
    }
  }, [isOpen, editingLink, isEditMode]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchQuery("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let trimmedUrl = url.trim();

    // Email validation
    if (platform === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedUrl)) {
        Swal.fire({
          title: "Invalid Email",
          text: "Please enter a valid email address.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
    }

    // WhatsApp validation (number only)
    if (platform === "whatsapp") {
      const cleanedNumber = trimmedUrl.replace(/\D/g, "");
      if (cleanedNumber.length < 7 || cleanedNumber.length > 15) {
        Swal.fire({
          title: "Invalid WhatsApp Number",
          text: "Please enter a valid phone number (7-15 digits).",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
      const fullNumber = `${selectedCountry.code.replace(
        "+",
        ""
      )}${cleanedNumber}`;
      trimmedUrl = `https://wa.me/${fullNumber}`;
    }

    // Phone validation
    if (platform === "phone") {
      const cleanedNumber = trimmedUrl.replace(/\D/g, "");
      if (cleanedNumber.length < 7 || cleanedNumber.length > 15) {
        Swal.fire({
          title: "Invalid Phone Number",
          text: "Please enter a valid phone number (7-15 digits).",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
      trimmedUrl = `${selectedCountry.code}${cleanedNumber}`;
    }

    if (isEditMode) {
      onEdit(editingLink.id, platform, trimmedUrl);
    } else {
      onAdd(platform, trimmedUrl);
    }

    setPlatform("");
    setUrl("");
    onClose();
  };

  if (!isOpen) return null;

  const needsCountryCode = platform === "whatsapp" || platform === "phone";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {isEditMode ? "Edit Social Link" : "Add Social Link"}
        </h2>

        {availablePlatforms.length === 0 && !isEditMode ? (
          <div className="text-center py-6">
            <p className="text-gray-600 mb-4">All platforms have been added!</p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Platform Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => {
                  setPlatform(e.target.value);
                  if (!isEditMode) setUrl(""); // Only reset URL in add mode
                }}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all"
                disabled={isEditMode} // Disable platform change in edit mode
                required
              >
                <option value="">Select Platform</option>
                {availablePlatforms.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              {isEditMode && (
                <p className="text-xs text-gray-500 mt-1">
                  Platform cannot be changed when editing
                </p>
              )}
            </div>

            {/* Input fields */}
            {platform && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {platform === "email"
                    ? "Email Address"
                    : platform === "phone"
                    ? "Phone Number"
                    : platform === "whatsapp"
                    ? "WhatsApp Number"
                    : "URL / Contact"}
                </label>

                {needsCountryCode ? (
                  <div className="flex gap-2">
                    {/* Country Code Selector */}
                    <div
                      className="w-40 flex-shrink-0 relative"
                      ref={dropdownRef}
                    >
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full h-[46px] px-3 py-3 bg-white border border-gray-300 rounded-xl hover:border-brand-primary focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 transition-all duration-200 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <ReactCountryFlag
                            countryCode={selectedCountry.shortcut}
                            svg
                            style={{ width: "1.5em", height: "1.5em" }}
                          />
                          <span className="font-semibold text-sm text-gray-700">
                            {selectedCountry.code}
                          </span>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`text-gray-400 transition-transform duration-200 ${
                            isDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                        <div className="absolute z-[100] mt-2 w-72 bg-white rounded-xl shadow-2xl border-2 border-gray-100 overflow-hidden left-0">
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
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                              />
                            </div>
                          </div>

                          {/* Countries List */}
                          <div className="max-h-64 overflow-y-auto py-1">
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map((country) => (
                                <button
                                  key={`${country.code}-${country.shortcut}`}
                                  type="button"
                                  onClick={() => handleCountrySelect(country)}
                                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gradient-to-r hover:from-brand-primary/5 hover:to-purple-500/5 transition-all duration-150 ${
                                    selectedCountry.code === country.code &&
                                    selectedCountry.shortcut ===
                                      country.shortcut
                                      ? "bg-gradient-to-r from-brand-primary/10 to-purple-500/10"
                                      : ""
                                  }`}
                                >
                                  <ReactCountryFlag
                                    countryCode={country.shortcut}
                                    svg
                                    style={{ width: "1.5em", height: "1.5em" }}
                                  />
                                  <div className="flex-1 text-left">
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-sm text-gray-700">
                                        {country.code}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {country.name}
                                      </span>
                                    </div>
                                  </div>
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-8 text-center">
                                <p className="text-sm text-gray-500">
                                  No countries found
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Phone/WhatsApp Input */}
                    <input
                      type="tel"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all"
                      placeholder={
                        platform === "whatsapp"
                          ? "7X XXX XXXX"
                          : "Enter phone number"
                      }
                      required
                    />
                  </div>
                ) : (
                  <input
                    type={platform === "email" ? "email" : "text"}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all"
                    placeholder={
                      platform === "email"
                        ? "example@email.com"
                        : "Enter URL or contact info"
                    }
                    required
                  />
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!platform}
                className="px-4 py-2.5 rounded-xl bg-brand-primary text-white font-medium hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isEditMode ? (
                  <>
                    <Edit2 className="w-4 h-4" /> Update Link
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Add Link
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
